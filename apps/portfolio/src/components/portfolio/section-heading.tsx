export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-2xl font-bold text-foreground whitespace-nowrap">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
