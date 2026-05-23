import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";

export default function AppLayout({
  children,
  contentMaxWidth = "max-w-3xl",
  contentClassName = "",
  mainClassName = "",
  className = "",
}) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-[#0B1120] text-slate-100 ${className}`}
    >
      <Navbar />

      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-1 items-stretch gap-6 pt-16">
        {/* Sidebar column — stretches with page so sticky sidebar can follow scroll */}
        <div className="w-0 shrink-0 lg:w-64">
          <SideBar />
        </div>

        {/* Feed column — style posts/pages here, independent of sidebar */}
        <div className="flex min-w-0 flex-1 justify-start pb-8 pl-2 pt-4 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
          <main className={`flex w-full justify-start ${mainClassName}`}>
            <div className={`w-full ${contentMaxWidth} ${contentClassName}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
