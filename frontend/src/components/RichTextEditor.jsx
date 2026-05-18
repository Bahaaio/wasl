import { useCallback, useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";

const editorConfig = {
  namespace: "WaslRichText",
  theme: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
  onError(error) {
    console.error(error);
  },
};

export default function RichTextEditor({ value = "", onChange, placeholder }) {
  const [align, setAlign] = useState("left");

  const handleChange = useCallback(
    editorState => {
      editorState.read(() => {
        const root = $getRoot();
        const plain = root.getTextContent();
        onChange && onChange(plain);
      });
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 shadow-lg shadow-slate-950/20 transition-all duration-200 hover:border-slate-600/80 hover:shadow-slate-950/30">
        <EditorToolbar align={align} setAlign={setAlign} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`min-h-44 p-3 text-slate-100 outline-none transition-colors duration-200 focus:ring-0 ${
                  align === "center"
                    ? "text-center"
                    : align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-3 top-3 text-slate-500 transition-opacity duration-200">
                {placeholder || "Write something..."}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <EditorValuePlugin value={value} />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}

function EditorValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();
  const lastAppliedValueRef = useRef(null);

  useEffect(() => {
    const normalizedValue = typeof value === "string" ? value : "";

    if (lastAppliedValueRef.current === normalizedValue) {
      return;
    }

    editor.update(() => {
      const root = $getRoot();
      const currentText = root.getTextContent();

      if (currentText === normalizedValue) {
        return;
      }

      root.clear();

      const lines = normalizedValue.split(/\r?\n/);
      if (lines.length === 0) {
        root.append($createParagraphNode());
        return;
      }

      lines.forEach(line => {
        const paragraph = $createParagraphNode();
        if (line.length > 0) {
          paragraph.append($createTextNode(line));
        }
        root.append(paragraph);
      });
    });

    lastAppliedValueRef.current = normalizedValue;
  }, [editor, value]);

  return null;
}

function EditorToolbar({ align, setAlign }) {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const isBold = selection.hasFormat && selection.hasFormat("bold");
            const isItalic =
              selection.hasFormat && selection.hasFormat("italic");
            const isUnderline =
              selection.hasFormat && selection.hasFormat("underline");
            setActive({
              bold: !!isBold,
              italic: !!isItalic,
              underline: !!isUnderline,
            });
          } else {
            setActive({ bold: false, italic: false, underline: false });
          }
        } catch {
          setActive({ bold: false, italic: false, underline: false });
        }
      });
    });
    return () => unregister();
  }, [editor]);

  const applyFormat = format =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);

  const buttonBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-700/80 hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30";
  const activeClass =
    "border-orange-500/70 bg-slate-700/90 text-orange-300 shadow-sm shadow-orange-500/10";

  return (
    <div className="flex items-center gap-2 rounded-t-xl border-b border-slate-700/80 bg-linear-to-b from-slate-950/35 to-slate-900/40 px-3 py-2">
      <button
        type="button"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        className={buttonBase}
        aria-label="Undo"
        title="Undo"
      >
        ↶
      </button>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        className={buttonBase}
        aria-label="Redo"
        title="Redo"
      >
        ↷
      </button>
      <div className="h-6 border-l border-slate-700/80" />
      <button
        type="button"
        onClick={() => applyFormat("bold")}
        className={`${buttonBase} ${active.bold ? activeClass : ""}`}
        aria-label="Bold"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => applyFormat("italic")}
        className={`${buttonBase} ${active.italic ? activeClass : ""}`}
        aria-label="Italic"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => applyFormat("underline")}
        className={`${buttonBase} ${active.underline ? activeClass : ""}`}
        aria-label="Underline"
        title="Underline"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      </button>
      <div className="h-6 border-l border-slate-700/80" />
      <button
        type="button"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        className={buttonBase}
        aria-label="Bulleted list"
        title="Bulleted list"
      >
        <span className="text-lg leading-none">•</span>
        <span className="text-xs font-medium tracking-wide">List</span>
      </button>
      <div className="ml-auto flex items-center gap-2 pr-1">
        <button
          type="button"
          onClick={() => setAlign("left")}
          className={`${buttonBase} ${align === "left" ? activeClass : ""}`}
          aria-label="Align left"
          title="Align left"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="14" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="16" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setAlign("center")}
          className={`${buttonBase} ${align === "center" ? activeClass : ""}`}
          aria-label="Align center"
          title="Align center"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="7" y1="6" x2="17" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="8" y1="18" x2="16" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setAlign("right")}
          className={`${buttonBase} ${align === "right" ? activeClass : ""}`}
          aria-label="Align right"
          title="Align right"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="10" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="8" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
