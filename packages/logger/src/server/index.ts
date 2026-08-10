import { defu } from "defu";
import {
  auditRedactPreset,
  createError as createEvlogError,
  createLogger as createEvlogLogger,
  createRequestLogger as createEvlogRequestLogger,
  initLogger as initEvlogLogger,
  log as evlog,
  parseError as parseEvlogError,
  type LoggerConfig as EvlogLoggerConfig,
  type ParsedError as EvlogParsedError,
  type RequestLogger as EvlogRequestLogger
} from "evlog";

import { LOG_SERVICES } from "#@/constants/services";

type ServerLoggerConfig = EvlogLoggerConfig;

const DEFAULT_REDACT_PATHS = [
  ...(auditRedactPreset.paths ?? []),
  "apiKey",
  "authorization",
  "cookie",
  "cookies",
  "password",
  "secret",
  "set-cookie",
  "token",
  "accessToken",
  "refreshToken"
];

const DEFAULT_SERVER_LOGGER_CONFIG = {
  env: {
    service: LOG_SERVICES.DEFAULT
  },
  redact: {
    paths: DEFAULT_REDACT_PATHS
  }
} satisfies ServerLoggerConfig;

let isInitialized = false;

/**
 * Initialize server-side evlog once per Worker isolate.
 *
 * @example
 * ```ts
 * import { initLogger } from "@repo/logger/server";
 *
 * initLogger({ env: { service: "parlor__server" } });
 * ```
 */
export function initLogger(config: ServerLoggerConfig = {}) {
  if (isInitialized) {
    return;
  }

  initEvlogLogger(defu(config, DEFAULT_SERVER_LOGGER_CONFIG) as ServerLoggerConfig);
  isInitialized = true;
}

export { LOG_SERVICES };

/**
 * Create a standalone wide-event logger for jobs, scripts, or non-request work
 * (e.g. Durable Object lifecycle/WS events, which aren't reachable from
 * TanStack Start's request middleware).
 *
 * @example
 * ```ts
 * import { createLogger } from "@repo/logger/server";
 *
 * const logger = createLogger({ roomId });
 * logger.set({ event: "room_created" });
 * logger.emit();
 * ```
 */
export const createLogger = createEvlogLogger;

/**
 * Create a request-scoped wide-event logger when framework middleware is not in play.
 */
export const createRequestLogger = createEvlogRequestLogger;

/**
 * Simple server-side logging API for one-off structured events.
 */
export const log = evlog;

/**
 * Create a structured error for request handlers and jobs.
 */
export const createError = createEvlogError;

/**
 * Convert unknown thrown values into structured, response-safe error fields.
 */
export const parseError = parseEvlogError;

export type RequestLogger = EvlogRequestLogger;
export type ParsedError = EvlogParsedError;
