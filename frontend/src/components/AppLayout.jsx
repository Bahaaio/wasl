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

      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-1 items-start gap-6 pt-16">
        {/* Sidebar column — style in SideBar.jsx only */}
        <div className="shrink-0">
          <SideBar />
        </div>

        {/* Feed column — style posts/pages here, independent of sidebar */}
        <div className="flex min-w-0 flex-1 justify-center pb-8 pt-4 pr-4 sm:pr-6 lg:pr-8">
          <main className={`flex w-full justify-center ${mainClassName}`}>
            <div className={`w-full ${contentMaxWidth} ${contentClassName}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
