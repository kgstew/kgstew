import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})

export const learningPlansTable = pgTable('learning_plan_table', {
  id: serial('id').primaryKey(),
  goal: text('goal').notNull(),
  availableTime: numeric('available_time').notNull(),
  learningStyle: text('learning_style').notNull(),
  topics: text('topics').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect

export type InsertLearningPlan = typeof learningPlansTable.$inferInsert
export type SelectLearningPlan = typeof learningPlansTable.$inferSelect
