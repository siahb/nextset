CREATE TABLE `custom_programs` (
	`user_id` text NOT NULL,
	`program_id` text NOT NULL,
	`definition` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `program_id`)
);
