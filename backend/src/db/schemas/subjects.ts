import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teachersSubjects } from './teacherSubjects.js';
import { homeworks } from './homeworks.js';

export const subjects = pgTable('subjects', {
  subjectId: serial('subjet_id').primaryKey(),
  subjectName: varchar('subject_name', { length: 255 }).notNull().unique(),
  description: text('description'),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  teacherSubjects: many(teachersSubjects),
  homeworks: many(homeworks),
}));