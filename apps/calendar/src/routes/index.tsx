import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { Nav } from "~/components/nav";
import { getEvents, getUsers } from "~/features/calendar/requests";
import { Calendar } from "~/features/calendar/calendar";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { e2e?: boolean } => ({
    e2e:
      search.e2e === 1 || search.e2e === "1" || search.e2e === true
        ? true
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ e2e: search.e2e }),
  loader: async ({ deps }) => {
    const [events, users] = await Promise.all([
      getEvents({ e2e: deps.e2e }),
      getUsers(),
    ]);
    return { events, users };
  },
  component: Home,
});

function Home() {
  const { events, users } = Route.useLoaderData();
  return (
    <>
      <Nav />
      <main className="flex max-h-screen flex-col pt-24 pb-16">
        <div className="container p-4 md:mx-auto">
          <ClientOnly>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <Calendar events={events} users={users} />
            </Suspense>
          </ClientOnly>
        </div>
      </main>
    </>
  );
}
