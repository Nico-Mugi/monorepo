import { Link } from "@tanstack/react-router";
import { contactItems } from "~/config/contactItems";
import { m } from "~/lib/paraglide/messages";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-neutral-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#8FAF83]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-[#8FAF83]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FAF83]/10 border border-[#8FAF83]/25 text-[#8FAF83] text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FAF83] animate-pulse" />
              {m.hero_available_badge()}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none mb-4">
              Nicolas
              <br />
              <span className="text-neutral-400">Thouvenin</span>
            </h1>

            <p className="text-base md:text-lg text-[#8FAF83] font-medium mb-6 tracking-wide">
              {m.personal_title()}
            </p>

            <p className="text-neutral-400 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              {m.personal_bio()}
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="#contact"
                className="px-6 py-2.5 rounded-lg bg-[#8FAF83] text-neutral-950 text-sm font-semibold hover:bg-[#a0c096] transition-colors duration-200"
              >
                {m.hero_contact_cta()}
              </a>

              <Link
                to="/cv"
                className="px-6 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-medium hover:border-neutral-500 hover:text-white transition-all duration-200"
              >
                {m.hero_view_cv_cta()}
              </Link>
            </div>
          </div>

          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#8FAF83]/15 blur-2xl scale-125 pointer-events-none" />
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-0.5 bg-linear-to-br from-[#8FAF83]/70 via-[#8FAF83]/20 to-transparent">
              <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden">
                <img
                  src={"/Thouvenin Nicolas.png"}
                  alt="Nicolas Thouvenin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-neutral-800 flex flex-wrap gap-6 justify-center md:justify-start">
          {contactItems.map(({ icon: Icon, value, href }) =>
            href ? (
              <a
                key={value}
                href={href}
                className="flex items-center gap-2 text-neutral-500 text-sm hover:text-[#8FAF83] transition-colors duration-200"
              >
                <Icon size={13} />
                {value}
              </a>
            ) : (
              <span
                key={value}
                className="flex items-center gap-2 text-neutral-500 text-sm"
              >
                <Icon size={13} />
                {value}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
