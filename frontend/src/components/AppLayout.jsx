import Navbar from "./Navbar.jsx";
import SideBar from "./SideBar.jsx";

export default function AppLayout({
  children,
  contentMaxWidth = "max-w-3xl",
  contentClassName = "",
  mainClassName = "",
  className = "",
  showSidebar = true,
}) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-[#0B1120] text-slate-100 ${className}`}
    >
      <Navbar />

      <div
        className={`flex min-h-[calc(100vh-4rem)] w-full flex-1 items-stretch pt-16 ${showSidebar ? "gap-6" : ""}`}
      >
        {showSidebar && (
          <div className="w-0 shrink-0 lg:w-64">
            <SideBar />
          </div>
        )}

        <div className="flex min-w-0 flex-1 justify-center px-4 pb-8 pt-4 sm:px-6 lg:px-8">
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
