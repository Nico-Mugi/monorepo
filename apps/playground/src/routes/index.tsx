import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center text-white">
      <h1 className="text-4xl font-bold">Playground</h1>
    </main>
  );
}
