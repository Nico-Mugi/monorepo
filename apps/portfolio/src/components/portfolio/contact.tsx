import { contactItems } from "~/config/contactItems";
import { cn } from "~/lib/shadcn/utils";
import { m } from "~/lib/paraglide/messages";

export function ContactSection() {
  return (
    <section id="contact" className="bg-background py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {m.contact_section_title()}{" "}
            <span className="text-primary">
              {m.contact_section_title_accent()}
            </span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {m.contact_section_description()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {contactItems.map(({ icon: Icon, label, value, href }) => {
            const card = (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/30 transition-colors duration-300 h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground/70 mb-1.5 uppercase tracking-wide">
                  {label}
                </p>
                <p
                  className={cn(
                    "text-sm text-foreground/90",
                    href
                      ? "group-hover:text-primary transition-colors break-all"
                      : "",
                  )}
                >
                  {value}
                </p>
              </div>
            );
            return href ? (
              <a key={label} href={href} className="block group">
                {card}
              </a>
            ) : (
              card
            );
          })}
        </div>
      </div>
    </section>
  );
}
