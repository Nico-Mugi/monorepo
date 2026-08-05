import { GlobeCheckIcon } from "lucide-react";
import { m } from "~/lib/paraglide/messages";
import { contactItems } from "~/config/contactItems";
import { EduEntry } from "~/components/cv/edu-entry";
import { SectionTitle } from "~/components/cv/section-title";
import { SideSection } from "~/components/cv/side-section";
import { ExperienceEntry } from "~/components/cv/experience-entry";
import { ContactItem } from "~/components/cv/contact-item";
import { LangItem } from "~/components/cv/lang-item";
import { SkillItem } from "~/components/cv/skill-item";
import { SimpleIcon } from "~/components/custom-icons/simple-icon";
import { ciLinkedin } from "~/components/custom-icons/linkedin";
import { BoldMessage } from "~/components/paraglide/bold-message";
import { siGithub } from "simple-icons";

/**
 * Loaded both by the route's `head()` (for on-screen/print rendering) and
 * by the server-rendered PDF pipeline (as `<link>` markup in the standalone
 * document) — the CV's Raleway/Lato type only needs to be fetched once.
 */
export const CV_GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Lato:wght@300;400;700&display=swap";

/**
 * The printable A4 page itself, independent of the `Nav` chrome around it —
 * this is the exact subtree rendered to PDF, whether via the browser's
 * print dialog, the dev-watch vite plugin, or the on-demand server function.
 */
export function CvDocument() {
  const languages = [
    { lang: m.portfolio_language_1_name(), level: m.portfolio_language_1_level() },
    { lang: m.portfolio_language_2_name(), level: m.portfolio_language_2_level() },
  ];

  const cvSkillLines = [
    m.portfolio_cv_skill_web(),
    m.portfolio_cv_skill_software(),
    m.portfolio_cv_skill_dbms(),
    m.portfolio_cv_skill_orm(),
    m.portfolio_cv_skill_styling(),
    m.portfolio_cv_skill_deployment(),
    m.portfolio_cv_skill_scraping(),
    m.portfolio_cv_skill_testing(),
    //m.portfolio_cv_skill_automation(),
    m.portfolio_cv_skill_tools(),
  ];

  const projectManagementSkills = [
    m.portfolio_pm_skill_agile(),
    m.portfolio_pm_skill_project_tools(),
    m.portfolio_pm_skill_architecture(),
    m.portfolio_pm_skill_security(),
    //m.portfolio_pm_skill_budget(),
    m.portfolio_pm_skill_risk(),
    m.portfolio_pm_skill_planning(),
  ];

  const interests = [m.portfolio_interest_tech(), m.portfolio_interest_quantum_physics()];

  const locale_experience = [
    {
      title: m.portfolio_experience_1_position(),
      company: m.portfolio_experience_1_company(),
      period: m.portfolio_experience_1_date(),
      location: m.portfolio_experience_1_location(),
      subEntries: [
        {
          company: m.portfolio_experience_1_sub_1_company(),
          period: m.portfolio_experience_1_sub_1_date(),
          bullets: [
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_1} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_2} />,
            // <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_3} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_4} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_5} />,
            // <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_6} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_7} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_8} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_9} />,
            <BoldMessage message={m.portfolio_experience_1_sub_1_bullet_10} />,
          ],
        },
        // {
        //   company: m.portfolio_experience_1_sub_2_company(),
        //   period: m.portfolio_experience_1_sub_2_date(),
        //   bullets: [
        //     m.portfolio_experience_1_sub_2_bullet_1(),
        //     m.portfolio_experience_1_sub_2_bullet_2(),
        //   ],
        // },
      ],
    },
    {
      title: m.portfolio_experience_2_position(),
      company: m.portfolio_experience_2_company(),
      period: m.portfolio_experience_2_date(),
      location: m.portfolio_experience_2_location(),
      bullets: [
        <BoldMessage message={m.portfolio_experience_2_bullet_1} />,
        <BoldMessage message={m.portfolio_experience_2_bullet_2} />,
        <BoldMessage message={m.portfolio_experience_2_bullet_3} />,
        <BoldMessage message={m.portfolio_experience_2_bullet_4} />,
      ],
    },
    {
      title: m.portfolio_experience_3_position(),
      company: m.portfolio_experience_3_company(),
      period: m.portfolio_experience_3_date(),
      location: m.portfolio_experience_3_location(),
      bullets: [
        <BoldMessage message={m.portfolio_experience_3_bullet_1} />,
        <BoldMessage message={m.portfolio_experience_3_bullet_2} />,
        <BoldMessage message={m.portfolio_experience_3_bullet_3} />,
        <BoldMessage message={m.portfolio_experience_3_bullet_4} />,
        <BoldMessage message={m.portfolio_experience_3_bullet_5} />,
        <BoldMessage message={m.portfolio_experience_3_bullet_6} />,
      ],
    },
  ];

  const locale_education = [
    {
      degree: m.portfolio_education_1_degree(),
      school: m.portfolio_education_1_school(),
      period: m.portfolio_education_1_date(),
      location: m.portfolio_education_1_location(),
    },
    {
      degree: m.portfolio_education_2_degree(),
      school: m.portfolio_education_2_school(),
      period: m.portfolio_education_2_date(),
      location: m.portfolio_education_2_location(),
    },
    {
      degree: m.portfolio_education_3_degree(),
      school: m.portfolio_education_3_school(),
      period: m.portfolio_education_3_date(),
      location: m.portfolio_education_3_location(),
    },
  ];

  return (
    <div
      className="w-full overflow-x-auto py-24 bg-neutral-900 print:py-0 print:h-fit print:overflow-visible relative"
      style={{ printColorAdjust: "exact" }}
    >
      <div className="aspect-210/297 w-[210mm] mx-auto bg-[#8FAF83] flex flex-row">
        <div className="flex flex-col gap-2 items-center">
          <div className="w-35 h-35 rounded-full border-3 border-white overflow-hidden shadow-xs mx-auto mt-2">
            <img
              src="/Thouvenin Nicolas.png"
              width={140}
              height={140}
              alt="Nicolas Thouvenin"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="w-55 flex flex-col grow justify-between">
            <SideSection
              title={m.portfolio_cv_sidebar_contact()}
              items={[
                ...contactItems,
                {
                  icon: GlobeCheckIcon,
                  label: "website",
                  value: "nicolas-thouvenin.dev",
                  href: "https://nicolas-thouvenin.dev",
                },
                {
                  icon: ({ size, color }: { size: number; color: string }) => (
                    <SimpleIcon
                      path={ciLinkedin.path}
                      title={ciLinkedin.title}
                      size={size}
                      color={color}
                    />
                  ),
                  label: "linkedin",
                  value: "linkedin.com/in/nico-thouvenin",
                  href: "https://linkedin.com/in/nico-thouvenin",
                },
                {
                  icon: ({ size, color }: { size: number; color: string }) => (
                    <SimpleIcon
                      path={siGithub.path}
                      title={siGithub.title}
                      size={size}
                      color={color}
                    />
                  ),
                  label: "github",
                  value: "github.com/Nico-Mugi",
                  href: "https://github.com/Nico-Mugi",
                },
              ].map((item) => (
                <ContactItem
                  key={item.label}
                  icon={<item.icon size={13} color="white" />}
                  text={item.value}
                  //href={item.href}
                />
              ))}
            />

            <SideSection
              title={m.portfolio_cv_sidebar_languages()}
              items={languages.map((l) => (
                <LangItem key={l.lang} lang={l.lang} level={l.level} />
              ))}
            />

            <SideSection
              title={m.portfolio_cv_sidebar_skills()}
              items={cvSkillLines.map((item) => (
                <SkillItem key={item} label={item} />
              ))}
            />

            <SideSection
              title={m.portfolio_cv_sidebar_pm()}
              items={projectManagementSkills.map((item) => (
                <SkillItem key={item} label={item} />
              ))}
            />

            <SideSection
              title={m.portfolio_cv_sidebar_interests()}
              items={interests.map((item) => (
                <SkillItem key={item} label={item} />
              ))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-0">
          <div className="h-full flex flex-col justify-center py-1 px-4">
            <h1 className="font-[Raleway,sans-serif] font-extrabold text-[32px] text-white uppercase m-0 leading-none">
              Nicolas Thouvenin
            </h1>
            <p className="font-[Raleway,sans-serif] text-[14px] text-white/90 uppercase mt-1 mb-0">
              {m.portfolio_personal_title()}
            </p>
          </div>
          <div className="px-2 pt-1 bg-white flex flex-col gap-1">
            <div>
              <SectionTitle>{m.portfolio_profile_summary_title()}</SectionTitle>
              <p className="font-[Lato,sans-serif] text-[12px] text-neutral-800 leading-snug">
                {m.portfolio_profile_summary_paragraph()}
              </p>
            </div>
            <div>
              <SectionTitle>{m.portfolio_cv_section_experience()}</SectionTitle>
              <div className="flex flex-col gap-1">
                {locale_experience.map((exp) => (
                  <ExperienceEntry
                    key={exp.company}
                    title={exp.title}
                    company={exp.company}
                    period={exp.period}
                    location={exp.location}
                    bullets={exp.bullets}
                  >
                    {exp.subEntries && (
                      <div className="*:pl-2 *:border-l-[#8FAF83] *:border-l-2 mt-1 gap-2 flex flex-col">
                        {exp.subEntries.map((sub) => (
                          <ExperienceEntry
                            key={sub.company}
                            company={sub.company}
                            period={sub.period}
                            bullets={sub.bullets}
                          />
                        ))}
                      </div>
                    )}
                  </ExperienceEntry>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle>{m.portfolio_cv_section_education()}</SectionTitle>
              <div className="flex flex-col gap-1">
                {locale_education.map((edu) => (
                  <EduEntry
                    key={edu.school}
                    degree={edu.degree}
                    school={edu.school}
                    period={edu.period}
                    location={edu.location}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
