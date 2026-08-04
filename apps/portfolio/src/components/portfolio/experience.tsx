import { BriefcaseIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { m } from "~/lib/paraglide/messages";

export function ExperienceSection() {
  const locale_experience = [
    {
      title: m.experience_1_position(),
      company: m.experience_1_company(),
      periodShort: m.experience_1_date(),
      highlights: [
        m.experience_1_highlight_1(),
        m.experience_1_highlight_2(),
        m.experience_1_highlight_3(),
      ],
    },
    {
      title: m.experience_2_position(),
      company: m.experience_2_company(),
      periodShort: m.experience_2_date(),
      highlights: [
        m.experience_2_highlight_1(),
        m.experience_2_highlight_2(),
        m.experience_2_highlight_3(),
      ],
    },
    {
      title: m.experience_3_position(),
      company: m.experience_3_company(),
      periodShort: m.experience_3_date(),
      highlights: [m.experience_3_highlight_1(), m.experience_3_highlight_2()],
    },
  ];

  return (
    <section id="experience" className="bg-neutral-900 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-3">
          <BriefcaseIcon size={14} className="text-[#8FAF83]" />
          <span className="text-[#8FAF83] text-xs font-semibold uppercase tracking-widest">
            {m.sections_experience_subtitle()}
          </span>
        </div>
        <SectionHeading>{m.sections_experience_title()}</SectionHeading>

        <div className="relative mt-12">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-linear-to-b from-[#8FAF83]/50 via-neutral-700 to-transparent hidden md:block" />

          <div className="flex flex-col gap-8">
            {locale_experience.map((exp, index) => (
              <div key={exp.company} className="md:pl-20 relative group">
                <div className="hidden md:block absolute left-4.75 top-5 w-3.5 h-3.5 rounded-full bg-neutral-900 border-2 border-[#8FAF83] group-hover:bg-[#8FAF83] transition-colors duration-300" />

                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 group-hover:border-[#8FAF83]/30 transition-colors duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-white text-base leading-snug">
                        {exp.title}
                      </h3>
                      <p className="text-[#8FAF83] text-sm mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {index === 0 && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#8FAF83]/15 text-[#8FAF83] border border-[#8FAF83]/25">
                          {m.experience_current_badge()}
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 italic">
                        {exp.periodShort}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {exp.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed"
                      >
                        <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[#8FAF83]/60" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
