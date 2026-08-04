import {
  Code2Icon,
  DatabaseIcon,
  LayersIcon,
  ServerIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { m } from "~/lib/paraglide/messages";

export function SkillsSection() {
  const skillGroups = [
    {
      icon: Code2Icon,
      items: [
        "React.js",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "Tailwind CSS",
        "CSS3",
      ],
      category: m.skill_group_frontend(),
    },
    {
      icon: ServerIcon,
      items: ["Node.js", "Python", ".NET Core", "C#"],
      category: m.skill_group_backend(),
    },
    {
      icon: DatabaseIcon,
      items: ["PostgreSQL", "Supabase", "MSSQL"],
      category: m.skill_group_databases(),
    },
    {
      icon: LayersIcon,
      items: ["Git", "Docker", "Vercel", "Azure", "Windows Server"],
      category: m.skill_group_devops(),
    },
    {
      icon: ZapIcon,
      items: ["Puppeteer", "Zapier", "n8n", "Postman"],
      category: m.skill_group_automation(),
    },
    {
      icon: ShieldCheckIcon,
      category: m.skill_group_pm(),
      items: [
        ...["Scrum", "Kanban", "Jira", "Trello"],
        m.skill_is_architecture(),
        m.skill_gdpr(),
      ],
    },
  ];

  return (
    <section id="skills" className="bg-card py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading>{m.sections_skills_title()}</SectionHeading>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map(({ category, icon: Icon, items }) => (
            <div
              key={category}
              className="bg-background border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  {Icon && <Icon size={16} className="text-primary" />}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-foreground/90 border border-input hover:border-primary/40 hover:text-foreground transition-colors duration-150 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
