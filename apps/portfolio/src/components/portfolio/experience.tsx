import { BriefcaseIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { m } from "~/lib/paraglide/messages";

export function ExperienceSection() {
  const locale_experience = [
    {
      title: m.portfolio_experience_1_position(),
      company: m.portfolio_experience_1_company(),
      periodShort: m.portfolio_experience_1_date(),
      highlights: [
        m.portfolio_experience_1_highlight_1(),
        m.portfolio_experience_1_highlight_2(),
        m.portfolio_experience_1_highlight_3(),
      ],
    },
    {
      title: m.portfolio_experience_2_position(),
      company: m.portfolio_experience_2_company(),
      periodShort: m.portfolio_experience_2_date(),
      highlights: [
        m.portfolio_experience_2_highlight_1(),
        m.portfolio_experience_2_highlight_2(),
        m.portfolio_experience_2_highlight_3(),
      ],
    },
    {
      title: m.portfolio_experience_3_position(),
      company: m.portfolio_experience_3_company(),
      periodShort: m.portfolio_experience_3_date(),
      highlights: [m.portfolio_experience_3_highlight_1(), m.portfolio_experience_3_highlight_2()],
    },
  ];

  return (
    <section id="experience" className="bg-card py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-3">
          <BriefcaseIcon size={14} className="text-primary" />
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">
            {m.portfolio_sections_experience_subtitle()}
          </span>
        </div>
        <SectionHeading>{m.portfolio_sections_experience_title()}</SectionHeading>

        <div className="relative mt-12">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-linear-to-b from-primary/50 via-input to-transparent hidden md:block" />

          <div className="flex flex-col gap-8">
            {locale_experience.map((exp, index) => (
              <div key={exp.company} className="md:pl-20 relative group">
                <div className="hidden md:block absolute left-4.75 top-5 w-3.5 h-3.5 rounded-full bg-card border-2 border-primary group-hover:bg-primary transition-colors duration-300" />

                <div className="bg-background border border-border rounded-2xl p-6 group-hover:border-primary/30 transition-colors duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-base leading-snug">
                        {exp.title}
                      </h3>
                      <p className="text-primary text-sm mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {index === 0 && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                          {m.portfolio_experience_current_badge()}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground/70 italic">
                        {exp.periodShort}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {exp.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-primary/60" />
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
