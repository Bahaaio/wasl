import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./api/interceptor";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Dev-only click logger to help debug unexpected navigation on vote clicks
if (process.env.NODE_ENV === "development") {
  document.addEventListener(
    "click",
    e => {
      try {
        const el = e.target.closest && e.target.closest("button, a");
        if (!el) return;
        const aria = el.getAttribute && el.getAttribute("aria-label");
        const text = (el.innerText || "").trim();
        const isVote =
          /upvote|downvote/i.test(aria || "") || /upvote|downvote/i.test(text);
        if (!isVote) return;

        const beforeY = typeof window !== "undefined" ? window.scrollY : null;
        const stack = new Error().stack;

        console.log("[VOTE-CLICK]", {
          tag: el.tagName,
          type: el.getAttribute && el.getAttribute("type"),
          href: el.getAttribute && el.getAttribute("href"),
          aria,
          text,
          defaultPrevented: e.defaultPrevented,
          nearestForm: !!(el.closest && el.closest("form")),
          location: typeof window !== "undefined" ? window.location.href : null,
          beforeScrollY: beforeY,
          time: performance && performance.now && performance.now(),
          stack,
          outerHTML: el.outerHTML && el.outerHTML.slice(0, 400),
        });

        // log scroll position shortly after click to detect small refreshs
        setTimeout(() => {
          try {
            console.log("[VOTE-CLICK-AFTER]", {
              afterScrollY: window.scrollY,
              time: performance.now(),
            });
          } catch (err) {
            console.error("[VOTE-CLICK] after logger error", err);
          }
        }, 80);

        // defensively prevent default on problematic anchors used as buttons
        if (
          el.tagName === "A" &&
          el.getAttribute &&
          el.getAttribute("href") === "#"
        ) {
          e.preventDefault();
          console.warn("[VOTE-CLICK] prevented default on anchor href='#'");
        }
      } catch (err) {
        console.error("[VOTE-CLICK] logger error", err);
      }
    },
    true
  );
}
