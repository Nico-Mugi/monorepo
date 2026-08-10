import handler from "@tanstack/react-start/server-entry";
import { initLogger } from "@repo/logger/server";
import { handleLogIngestRequest } from "@repo/logger/server/ingest";
import { createD1LogDrain, pruneOldLogs } from "@repo/logger/server/d1-drain";
import { paraglideMiddleware } from "./lib/paraglide/server";

initLogger({ env: { service: "portfolio__server" }, drain: createD1LogDrain() });

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/_logs/ingest" && req.method === "POST") {
      return handleLogIngestRequest(req);
    }

    return paraglideMiddleware(req, () => handler.fetch(req));
  },

  // Only portfolio owns the cron trigger (wrangler.jsonc) — every app shares
  // the same `platform-logs` D1 database, so pruning must only run from one
  // place, not once per app.
  scheduled(_event: ScheduledController, _env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(pruneOldLogs());
  },
};
