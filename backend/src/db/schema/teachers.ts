import { pgTable, serial, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { classes } from './classes.js';
import { teachersSubjects } from './teacherSubjects.js';
import { homeworks } from './homeworks.js';
import { grades } from './grades.js';

export const teachers = pgTable('teachers', {
  teacherId: serial('teacher_id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.userId, { onDelete: 'cascade' }),
});

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.userId],
  }),
  coordinatingClasses: many(classes),
  teacherSubjects: many(teachersSubjects),
  homeworks: many(homeworks),
  grades: many(grades),
}));

export type Teacher = typeof teachers.$inferSelect;