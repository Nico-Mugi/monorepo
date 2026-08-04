import { SectionTitle } from "./section-title";

interface SideSectionProps {
  title: string;
  items: React.ReactNode[];
}

export const SideSection = ({ title, items }: SideSectionProps) => (
  <div className="flex flex-col gap-1">
    {/* <h3 className="font-[Raleway,sans-serif] text-[11px] font-bold uppercase text-white/75 mb-2">
      {title}
    </h3> */}
    <SectionTitle className="px-2">{title}</SectionTitle>
    <div className="px-2">{items}</div>
  </div>
);
