import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseIcon,
  ChartNoAxesCombined,
  GraduationCap,
  MailCheckIcon,
} from "lucide-react";
import { Footer } from "~/components/footer";
import { Nav } from "~/components/nav";
import { ContactSection } from "~/components/portfolio/contact";
import { EducationSection } from "~/components/portfolio/education";
import { ExperienceSection } from "~/components/portfolio/experience";
import { HeroSection } from "~/components/portfolio/hero";
import { SkillsSection } from "~/components/portfolio/skills";
import { m } from "~/lib/paraglide/messages";
import { seo } from "@repo/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...seo({
        title: "Nicolas Thouvenin - Portfolio",
        description:
          "Portfolio de Nicolas Thouvenin, développeur web spécialisé en React et Node.js. Découvrez mon expérience, mes compétences et comment me contacter.",
        image: "https://nicolas-thouvenin.dev/logos/vertical.png",
        url: "https://nicolas-thouvenin.dev",
        site_name: "Nicolas Thouvenin - Portfolio",
        twitterHandle: "@Nico-Mugi",
      }),
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav
        links={[
          {
            label: m.nav_experience(),
            href: "#experience",
            icon: <BriefcaseIcon size={20} />,
          },
          {
            label: m.nav_education(),
            href: "#education",
            icon: <GraduationCap size={20} />,
          },
          {
            label: m.nav_skills(),
            href: "#skills",
            icon: <ChartNoAxesCombined size={20} />,
          },
          {
            label: m.nav_contact(),
            href: "#contact",
            icon: <MailCheckIcon size={20} />,
          },
        ]}
        ctaLink={{
          label: m.nav_view_cv(),
          href: "/cv",
        }}
      />
      <HeroSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
