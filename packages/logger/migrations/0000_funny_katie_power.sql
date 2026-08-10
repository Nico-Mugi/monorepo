CREATE TABLE `logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`service` text NOT NULL,
	`level` text NOT NULL,
	`request_id` text,
	`path` text,
	`method` text,
	`event` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `logs_timestamp_idx` ON `logs` (`timestamp`);--> statement-breakpoint
CREATE INDEX `logs_service_idx` ON `logs` (`service`);--> statement-breakpoint
CREATE INDEX `logs_level_idx` ON `logs` (`level`);--> statement-breakpoint
CREATE INDEX `logs_requestId_idx` ON `logs` (`request_id`);