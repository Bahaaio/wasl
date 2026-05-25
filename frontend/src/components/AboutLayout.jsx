import { useEffect, useState } from "react";

export default function AboutLayout({ team }) {
  const [active, setActive] = useState(0);
  const activeMember = team?.[active];

  useEffect(() => {
    if (!team || team.length === 0) return;
    const iv = setInterval(() => {
      setActive(prev => (prev + 1) % team.length);
    }, 9000);
    return () => clearInterval(iv);
  }, [team]);

  if (!team || team.length === 0) {
    return null;
  }

  return (
    <main className="relative z-10 pt-32 pb-24">
      <section className="bg-linear-to-r from-orange-600/8 via-slate-950 to-slate-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-6">
              The WASL Programmers
            </h1>

            <div
              key={`info-${activeMember.name}`}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 transition-all duration-500"
            >
              <p className="text-slate-100 font-semibold text-3xl mb-2">
                {activeMember.name}
              </p>
              <p className="text-orange-300 text-xl font-medium">
                {activeMember.role}
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xl">
              <div className="relative h-95 sm:h-115 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {team.map(member => (
                    <img
                      key={member.name}
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover shrink-0"
                    />
                  ))}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/70 to-transparent">
                  <p className="text-white font-semibold text-lg">
                    {activeMember.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActive(prev => (prev - 1 + team.length) % team.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Previous photo"
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  onClick={() => setActive(prev => (prev + 1) % team.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                  aria-label="Next photo"
                >
                  {">"}
                </button>
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {team.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? "w-7 bg-orange-400" : "w-2 bg-slate-700"
                    }`}
                    aria-label={`Show ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
