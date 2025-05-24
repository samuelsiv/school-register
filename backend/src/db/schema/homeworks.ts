import { pgTable, serial, integer, varchar, text, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { classes } from './classes.js';
import { subjects } from './subjects.js';
import { teachers } from './teachers.js';
import { grades } from './grades.js';

export const homeworks = pgTable('homeworks', {
  homeworkId: serial('homework_id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.classId, { onDelete: 'cascade' }),
  subjectId: integer('subject_id').notNull().references(() => subjects.subjectId, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').references(() => teachers.teacherId, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: date('created_at').defaultNow(),
  dueDate: date('due_date'),
});

export const homeworksRelations = relations(homeworks, ({ one, many }) => ({
  class: one(classes, {
    fields: [homeworks.classId],
    references: [classes.classId],
  }),
  subject: one(subjects, {
    fields: [homeworks.subjectId],
    references: [subjects.subjectId],
  }),
  teacher: one(teachers, {
    fields: [homeworks.teacherId],
    references: [teachers.teacherId],
  }),
}));

export type Homework = typeof homeworks.$inferSelect;