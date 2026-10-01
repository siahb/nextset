import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const workoutLogs=sqliteTable('workout_logs',{userId:text('user_id').notNull(),week:integer('week').notNull(),slot:integer('slot').notNull(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.userId,t.week,t.slot]})]);
export const trainingProfiles=sqliteTable('training_profiles',{userId:text('user_id').primaryKey(),programIds:text('program_ids').notNull(),updatedAt:text('updated_at').notNull()});

export const programWorkoutLogs=sqliteTable('program_workout_logs',{userId:text('user_id').notNull(),programId:text('program_id').notNull(),week:integer('week').notNull(),slot:integer('slot').notNull(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.userId,t.programId,t.week,t.slot]})]);

export const customPrograms=sqliteTable('custom_programs',{userId:text('user_id').notNull(),programId:text('program_id').notNull(),definition:text('definition').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.userId,t.programId]})]);
