/**
 * Stable service names used in evlog events.
 *
 * Naming convention: `<app>__server` for TanStack Start SSR/server-fn logs,
 * `<app>__client` for browser logs sent through an app's own `/api/_logs/ingest`
 * route, `default` as the fallback when a service is not explicitly selected.
 *
 * Apps pass their own app name at init:
 * `initLogger({ env: { service: "parlor__server" } })`.
 */
export const LOG_SERVICES = Object.freeze({
  DEFAULT: "default"
});

export type LogService = string;
