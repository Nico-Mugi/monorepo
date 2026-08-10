import { initLogger as initEvlogLogger, log as evlogLog } from "evlog";
import { createHttpLogDrain, type HttpLogDrainOptions } from "evlog/http";

import { LOG_SERVICES } from "#@/constants/services";

type ClientLoggerConfig = {
  batchedTransport?: HttpLogDrainOptions;
  console?: boolean;
  enabled?: boolean;
  minLevel?: NonNullable<Parameters<typeof initEvlogLogger>[0]>["minLevel"];
  pretty?: boolean;
  service?: string;
};

type LogMethod = typeof evlogLog.info;
// evlog's `error` has an extra `(error: Error): void` overload the other
// three levels don't — kept separate so `withIdentity` doesn't have to
// pretend all four share one shape.
type ErrorLogMethod = typeof evlogLog.error;
type LogEvent = Parameters<LogMethod>[0];

const DEFAULT_CLIENT_LOGGER_CONFIG = {
  service: LOG_SERVICES.DEFAULT
} satisfies ClientLoggerConfig;

let isInitialized = false;
let identityContext: LogEvent = {};

const debugLogMethod = evlogLog.debug.bind(evlogLog) as LogMethod;
const errorLogMethod = evlogLog.error.bind(evlogLog) as ErrorLogMethod;
const infoLogMethod = evlogLog.info.bind(evlogLog) as LogMethod;
const warnLogMethod = evlogLog.warn.bind(evlogLog) as LogMethod;

function isBrowserRuntime() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Initialize browser logging with evlog's HTTP drain transport.
 *
 * @example
 * ```ts
 * import { initLog } from "@repo/logger/client";
 *
 * initLog({
 *   service: "parlor__client",
 *   batchedTransport: {
 *     drain: { credentials: "include", endpoint: "/api/_logs/ingest" },
 *   },
 * });
 * ```
 */
export function initLog(config: ClientLoggerConfig = {}) {
  if (!isBrowserRuntime()) {
    return;
  }

  if (isInitialized) {
    return;
  }

  initEvlogLogger({
    drain: config.batchedTransport ? createHttpLogDrain(config.batchedTransport) : undefined,
    enabled: config.enabled,
    env: {
      service: config.service ?? DEFAULT_CLIENT_LOGGER_CONFIG.service
    },
    minLevel: config.minLevel,
    pretty: config.pretty,
    silent: config.console === false
  });
  isInitialized = true;
}

export { LOG_SERVICES };

/**
 * Simple browser logging API. Object payloads automatically include the current identity context.
 *
 * @example
 * ```ts
 * import { log } from "@repo/logger/client";
 *
 * log.info({ event: "page_view", path: location.pathname });
 * log.error({ event: "global_error_boundary", error });
 * ```
 */
export const log = {
  debug: withIdentity(debugLogMethod),
  error: withIdentityError(errorLogMethod),
  info: withIdentity(infoLogMethod),
  warn: withIdentity(warnLogMethod)
} satisfies typeof evlogLog;

/**
 * Attach user/session context to future browser log events.
 */
export function setIdentity(identity: LogEvent) {
  if (!isBrowserRuntime()) {
    return;
  }

  identityContext = { ...identity };
}

/**
 * Clear browser identity context, usually on sign-out or provider cleanup.
 */
export function clearIdentity() {
  if (!isBrowserRuntime()) {
    return;
  }

  identityContext = {};
}

function withIdentity(method: LogMethod): LogMethod {
  function logWithIdentity(event: LogEvent): void;
  function logWithIdentity(tag: string, message: string): void;
  function logWithIdentity(tagOrEvent: LogEvent | string, message?: string) {
    if (!isBrowserRuntime()) {
      return;
    }

    if (isRecord(tagOrEvent) && message === undefined) {
      method({
        ...identityContext,
        ...tagOrEvent
      });
      return;
    }

    if (typeof tagOrEvent === "string") {
      if (message !== undefined) {
        method(tagOrEvent, message);
      }
      return;
    }

    method(tagOrEvent);
  }

  return logWithIdentity;
}

function withIdentityError(method: ErrorLogMethod): ErrorLogMethod {
  function logWithIdentity(event: LogEvent): void;
  function logWithIdentity(tag: string, message: string): void;
  function logWithIdentity(error: Error): void;
  function logWithIdentity(tagOrEventOrError: LogEvent | string | Error, message?: string) {
    if (!isBrowserRuntime()) {
      return;
    }

    // Errors are passed through as-is — evlog parses them itself, and
    // spreading identityContext into an Error instance wouldn't attach it
    // usefully (message/stack aren't own-enumerable properties).
    if (tagOrEventOrError instanceof Error) {
      method(tagOrEventOrError);
      return;
    }

    if (isRecord(tagOrEventOrError) && message === undefined) {
      method({
        ...identityContext,
        ...tagOrEventOrError
      });
      return;
    }

    if (typeof tagOrEventOrError === "string") {
      if (message !== undefined) {
        method(tagOrEventOrError, message);
      }
      return;
    }

    method(tagOrEventOrError);
  }

  return logWithIdentity;
}

function isRecord(value: LogEvent | string): value is LogEvent {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
