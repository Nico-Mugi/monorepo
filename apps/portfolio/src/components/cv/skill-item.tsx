interface SkillItemProps {
  label: string;
}

export const SkillItem = ({ label }: SkillItemProps) => (
  <div className="font-[Lato,sans-serif] text-[12px] text-white/90 pb-1 border-b border-white/20 mb-1.5">
    {label}
  </div>
);
