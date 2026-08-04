interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
}

export const ContactItem = ({ icon, text, href }: ContactItemProps) => {
  const content = (
    <div className="flex items-center gap-2.5 mb-2">
      <div className="w-6.5 h-6.5 rounded-full bg-white/18 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="font-[Lato,sans-serif] text-[12px] text-white/90 leading-snug">
        {text}
      </span>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        className="hover:underline decoration-white"
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }
  return content;
};
