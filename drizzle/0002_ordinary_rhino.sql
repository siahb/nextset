CREATE TABLE `program_workout_logs` (
	`user_id` text NOT NULL,
	`program_id` text NOT NULL,
	`week` integer NOT NULL,
	`slot` integer NOT NULL,
	`payload` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `program_id`, `week`, `slot`)
);
