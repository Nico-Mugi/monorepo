interface LangItemProps {
  lang: string;
  level: string;
}

export const LangItem = ({ lang, level }: LangItemProps) => (
  <div className="flex items-center justify-between mb-2">
    <span className="font-[Lato,sans-serif] text-[12.5px] font-bold text-white">
      {lang}
    </span>
    <span className="font-[Lato,sans-serif] text-[11px] bg-white/25 text-white rounded-full px-2.5 py-0.5">
      {level}
    </span>
  </div>
);
