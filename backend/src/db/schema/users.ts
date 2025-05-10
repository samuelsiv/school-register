import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students.js';
import { teachers } from './teachers.js';

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  creationDate: timestamp('creation_date').defaultNow(),
  lastLoginDate: timestamp('last_login_date'),
});

export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.userId],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.userId],
    references: [teachers.userId],
  }),
}));