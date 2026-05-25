import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Blog"],
    },
    {
      title: "Resources",
      links: [
        "Community Rules",
        "Help Center",
        "API Documentation",
        "Moderator Guidelines",
      ],
    },
    {
      title: "Legal",
      links: ["User Agreement", "Privacy Policy", "Content Policy"],
    },
  ];

  const socialLinks = ["Twitter", "Github", "Discord"];

  return (
    <footer className="relative border-t border-slate-800/70 bg-slate-950/70 backdrop-blur-md pt-16 pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-orange-500 to-red-500 flex items-center justify-center shadow-[0_0_30px_-12px_rgba(249,115,22,0.8)]">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-3xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                WASL
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-xs">
              The front page of your internet. Reimagined for 2026.
            </p>
          </div>

          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-slate-100 text-lg tracking-tight">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                {section.links.map(link => (
                  <li key={link}>
                    {link === "About" ? (
                      <Link
                        to="/about"
                        className="text-left text-base hover:text-orange-300 transition-colors"
                      >
                        {link}
                      </Link>
                    ) : (
                      <button className="text-left text-base hover:text-orange-300 transition-colors">
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800/80 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 WASL Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {socialLinks.map(link => (
              <button
                key={link}
                className="px-3 py-1.5 rounded-full border border-slate-800 hover:border-orange-500/40 hover:text-slate-200 transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
