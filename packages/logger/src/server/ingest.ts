import { z } from "zod";

import { log } from "#@/server/index";

const NormalizedLogLevelSchema = z.enum(["info", "error", "warn", "debug"]).catch("info");

const ClientLogPayloadSchema = z.object({
  event: z
    .object({
      environment: z.string(),
      level: z.string(),
      service: z.string(),
      timestamp: z.string()
    })
    .catchall(z.json()),
  request: z
    .object({
      method: z.string().optional(),
      path: z.string().optional(),
      requestId: z.string().optional()
    })
    .optional()
});

const ClientLogBatchSchema = z.array(ClientLogPayloadSchema);

type ClientLogPayload = z.infer<typeof ClientLogPayloadSchema>;

type NormalizedEvent = Omit<ClientLogPayload["event"], "level" | "timestamp"> & {
  clientTimestamp?: string;
  method?: string;
  path?: string;
  requestId?: string;
};

type LogIngestOptions = {
  maxPayloadBytes?: number;
};

/**
 * Accept browser log events posted by `@repo/logger/client`'s HTTP drain, and
 * re-emit them through the server logger. Framework-agnostic (plain
 * `Request` in, `Response` out) so any TanStack Start API/server route can
 * forward straight to it.
 *
 * @example
 * ```ts
 * // src/server.ts, alongside this app's other path-based routing
 * if (url.pathname === "/api/_logs/ingest" && req.method === "POST") {
 *   return handleLogIngestRequest(req);
 * }
 * ```
 */
export async function handleLogIngestRequest(
  request: Request,
  options: LogIngestOptions = {}
): Promise<Response> {
  const maxPayloadBytes = options.maxPayloadBytes ?? 64 * 1024;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxPayloadBytes) {
    return new Response("Log payload is too large", { status: 413 });
  }

  const result = await request.json().then(
    (body) => ClientLogBatchSchema.safeParse(body),
    () => null
  );

  if (!result) {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const batch = result.success ? result.data : [];
  for (const payload of batch) {
    emitClientLog(payload);
  }

  return new Response(null, { status: 204 });
}

function emitClientLog(payload: ClientLogPayload) {
  const { level: _level, timestamp, ...event } = payload.event;
  const normalizedEvent: NormalizedEvent = {
    ...(timestamp !== undefined && event.clientTimestamp === undefined
      ? { clientTimestamp: timestamp }
      : {}),
    ...event
  };

  if (payload.request?.method && normalizedEvent.method === undefined) {
    normalizedEvent.method = payload.request.method;
  }

  if (payload.request?.path && normalizedEvent.path === undefined) {
    normalizedEvent.path = payload.request.path;
  }

  if (payload.request?.requestId && normalizedEvent.requestId === undefined) {
    normalizedEvent.requestId = payload.request.requestId;
  }

  const clientEvent = {
    ...normalizedEvent,
    source: "client"
  };

  switch (NormalizedLogLevelSchema.parse(payload.event.level)) {
    case "debug":
      log.debug(clientEvent);
      return;
    case "error":
      log.error(clientEvent);
      return;
    case "warn":
      log.warn(clientEvent);
      return;
    case "info":
      log.info(clientEvent);
      return;
  }
}
