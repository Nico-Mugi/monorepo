import { env, waitUntil } from "cloudflare:workers";
import { lt } from "drizzle-orm";
import { type AnyD1Database, drizzle } from "drizzle-orm/d1";
import type { DrainContext, DrainFn } from "evlog";

import { logs } from "#@/server/schema";

type LogsEnv = { LOGS_DB: AnyD1Database };

function getLogsDb() {
  return drizzle((env as LogsEnv).LOGS_DB);
}

function readEventString(event: DrainContext["event"], key: string): string | undefined {
  const value = (event as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

async function insertLogRow(ctx: DrainContext): Promise<void> {
  try {
    await getLogsDb()
      .insert(logs)
      .values({
        service: ctx.event.service,
        level: ctx.event.level,
        // DrainContext.request is only populated by evlog's built-in
        // framework middleware (Hono/H3/etc.) — our hand-rolled TanStack
        // Start middleware never goes through that path, so it's always
        // empty here. requestId/path/method are set as top-level event
        // fields instead (see tanstack-start/middleware.ts's `logger.set()`
        // call), which is what actually carries them into the drain.
        requestId: readEventString(ctx.event, "requestId") ?? ctx.request?.requestId,
        path: readEventString(ctx.event, "path") ?? ctx.request?.path,
        method: readEventString(ctx.event, "method") ?? ctx.request?.method,
        event: ctx.event,
      });
  } catch {
    // Losing a log row is fine; crashing a request over a logging failure is not.
  }
}

/**
 * D1-backed evlog drain. Reads the `LOGS_DB` binding and `waitUntil` from
 * `cloudflare:workers` internally — no params needed beyond adding the
 * binding to an app's wrangler.jsonc.
 *
 * @example
 * ```ts
 * import { initLogger } from "@repo/logger/server";
 * import { createD1LogDrain } from "@repo/logger/server/d1-drain";
 *
 * initLogger({ env: { service: "parlor__server" }, drain: createD1LogDrain() });
 * ```
 */
export function createD1LogDrain(): DrainFn {
  return (ctx) => {
    waitUntil(insertLogRow(ctx));
  };
}

/**
 * Deletes rows older than `retentionDays`. Meant to be called from a single
 * app's cron-triggered `scheduled()` handler — every app shares the same
 * `platform-logs` database, so this must only run from one place.
 *
 * @example
 * ```ts
 * import { pruneOldLogs } from "@repo/logger/server/d1-drain";
 *
 * export default {
 *   fetch: ...,
 *   scheduled(event, env, ctx) {
 *     ctx.waitUntil(pruneOldLogs());
 *   },
 * };
 * ```
 */
export async function pruneOldLogs(retentionDays = 30): Promise<void> {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  await getLogsDb().delete(logs).where(lt(logs.timestamp, cutoff));
}
