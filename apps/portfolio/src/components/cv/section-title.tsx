import { cn } from "~/lib/shadcn/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle = ({ children, className }: SectionTitleProps) => (
  <div
    className={cn("flex flex-row gap-1 items-center bg-white py-1", className)}
  >
    <h2 className="font-[Raleway,sans-serif] text-[13px] font-bold text-gray-700 uppercase whitespace-nowrap leading-none">
      {children}
    </h2>
    <div className="w-full h-0.5 bg-[#8FAF83]" />
  </div>
);
