CREATE TABLE `workout_logs` (
	`user_id` text NOT NULL,
	`week` integer NOT NULL,
	`slot` integer NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `week`, `slot`)
);
