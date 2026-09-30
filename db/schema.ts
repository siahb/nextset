import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const workoutLogs=sqliteTable('workout_logs',{userId:text('user_id').notNull(),week:integer('week').notNull(),slot:integer('slot').notNull(),payload:text('payload').notNull(),updatedAt:text('updated_at').notNull()},t=>[primaryKey({columns:[t.userId,t.week,t.slot]})]);
