import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseIcon,
  ChartNoAxesCombined,
  GraduationCap,
  LayoutGridIcon,
  MailCheckIcon,
} from "lucide-react";
import { Footer } from "~/components/footer";
import { Nav } from "~/components/nav";
import { ContactSection } from "~/components/portfolio/contact";
import { EducationSection } from "~/components/portfolio/education";
import { ExperienceSection } from "~/components/portfolio/experience";
import { HeroSection } from "~/components/portfolio/hero";
import { SkillsSection } from "~/components/portfolio/skills";
import { PLAYGROUND_URL } from "~/config/externalLinks";
import { m } from "~/lib/paraglide/messages";
import { getLocale } from "~/lib/paraglide/runtime";
import { localizedSeoUrls } from "~/utils/seo-urls";
import { seo } from "@repo/ui";

export const Route = createFileRoute("/")({
  head: () => {
    const { current, alternates, xDefaultUrl } = localizedSeoUrls("/");
    const pageSeo = seo({
      title: "Nicolas Thouvenin - Portfolio",
      description: m.portfolio_seo_home_description(),
      image: "https://nicolas-thouvenin.dev/logos/vertical.png",
      url: current,
      alternates,
      xDefaultUrl,
      locale: getLocale(),
      site_name: "Nicolas Thouvenin - Portfolio",
      twitterHandle: "@Nico-Mugi",
    });
    return { meta: pageSeo.meta, links: pageSeo.links };
  },
  component: Portfolio,
});

function Portfolio() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav
        links={[
          {
            label: m.portfolio_nav_experience(),
            href: "#experience",
            icon: <BriefcaseIcon size={20} />,
          },
          {
            label: m.portfolio_nav_education(),
            href: "#education",
            icon: <GraduationCap size={20} />,
          },
          {
            label: m.portfolio_nav_skills(),
            href: "#skills",
            icon: <ChartNoAxesCombined size={20} />,
          },
          {
            label: m.portfolio_nav_contact(),
            href: "#contact",
            icon: <MailCheckIcon size={20} />,
          },
        ]}
        ctaLink={{
          label: m.portfolio_nav_access_playground(),
          shortLabel: m.portfolio_nav_access_playground_short(),
          href: PLAYGROUND_URL,
          icon: <LayoutGridIcon size={20} />,
          target: "_blank",
          rel: "noreferrer",
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
