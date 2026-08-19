import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "~/components/nav";
import { HtmlCanvasDemo } from "~/components/html-canvas-demo";
import { PixelPetDemo } from "~/components/pixel-pet-demo";
import { m } from "~/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold">{m.html_in_canvas_hero_title()}</h1>
          <p className="mt-2 text-muted-foreground">{m.html_in_canvas_hero_description()}</p>
        </header>

        <section className="rounded-2xl border border-border p-6">
          <HtmlCanvasDemo />
        </section>

        <section className="mt-8 rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold">{m.html_in_canvas_pet_section_heading()}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {m.html_in_canvas_pet_section_description()}
          </p>
          <div className="mt-6">
            <PixelPetDemo />
          </div>
        </section>
      </main>
    </div>
  );
}
