import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const logs = sqliteTable(
  "logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    service: text("service").notNull(),
    level: text("level").notNull(),
    requestId: text("request_id"),
    path: text("path"),
    method: text("method"),
    // Full evlog wide-event payload — nothing captured is lost even though
    // most of it isn't broken into its own indexed column.
    event: text("event", { mode: "json" }).notNull(),
  },
  (table) => [
    index("logs_timestamp_idx").on(table.timestamp),
    index("logs_service_idx").on(table.service),
    index("logs_level_idx").on(table.level),
    index("logs_requestId_idx").on(table.requestId),
  ],
);
