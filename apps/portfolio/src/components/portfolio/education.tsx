import { SectionHeading } from "./section-heading";
import { m } from "~/lib/paraglide/messages";

export function EducationSection() {
  const locale_education = [
    {
      degreeShort: m.education_1_degree(),
      school: m.education_1_school(),
      periodShort: m.education_1_date(),
    },
    {
      degreeShort: m.education_2_degree(),
      school: m.education_2_school(),
      periodShort: m.education_2_date(),
    },
    {
      degreeShort: m.education_3_degree(),
      school: m.education_3_school(),
      periodShort: m.education_3_date(),
    },
  ];

  return (
    <section id="education" className="bg-neutral-950 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading>{m.sections_education_title()}</SectionHeading>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {locale_education.map((edu, i) => (
            <div
              key={edu.school}
              className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-hidden hover:border-[#8FAF83]/30 transition-colors duration-300 group"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#8FAF83] via-[#8FAF83]/60 to-transparent" />
              <span className="absolute top-3 right-4 text-6xl font-black text-neutral-800 select-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-xs text-neutral-500 mb-4 font-mono">
                {edu.periodShort}
              </p>
              <h3 className="font-semibold text-white text-sm leading-snug mb-3 relative">
                {edu.degreeShort}
              </h3>
              <p className="text-[#8FAF83] text-sm relative">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
