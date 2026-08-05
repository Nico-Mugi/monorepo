import { SectionHeading } from "./section-heading";
import { m } from "~/lib/paraglide/messages";

export function EducationSection() {
  const locale_education = [
    {
      degreeShort: m.portfolio_education_1_degree(),
      school: m.portfolio_education_1_school(),
      periodShort: m.portfolio_education_1_date(),
    },
    {
      degreeShort: m.portfolio_education_2_degree(),
      school: m.portfolio_education_2_school(),
      periodShort: m.portfolio_education_2_date(),
    },
    {
      degreeShort: m.portfolio_education_3_degree(),
      school: m.portfolio_education_3_school(),
      periodShort: m.portfolio_education_3_date(),
    },
  ];

  return (
    <section id="education" className="bg-background py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading>{m.portfolio_sections_education_title()}</SectionHeading>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {locale_education.map((edu, i) => (
            <div
              key={edu.school}
              className="relative bg-card border border-border rounded-2xl p-6 overflow-hidden hover:border-primary/30 transition-colors duration-300 group"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent" />
              <span className="absolute top-3 right-4 text-6xl font-black text-muted select-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-xs text-muted-foreground/70 mb-4 font-mono">
                {edu.periodShort}
              </p>
              <h3 className="font-semibold text-foreground text-sm leading-snug mb-3 relative">
                {edu.degreeShort}
              </h3>
              <p className="text-primary text-sm relative">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
