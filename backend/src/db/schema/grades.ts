import { pgTable, serial, integer, numeric, date, text, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students.js';
import { homeworks } from './homeworks.js';
import { teachers } from './teachers.js';
import { subjects } from './subjects.js';

export const grades = pgTable('grades', {
  gradeId: serial('grade_id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').notNull().references(() => teachers.teacherId, { onDelete: 'set null' }),
  subjectId: integer('subject_id').notNull().references(() => subjects.subjectId, { onDelete: 'cascade' }),
  value: numeric('value').notNull(),
  weight: numeric('weight').notNull(), // 50%, 100%
  insertedAt: date('inserted_at').defaultNow(),
  comment: text('comment'),
});

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.studentId],
  }),
  teacher: one(teachers, {
    fields: [grades.teacherId],
    references: [teachers.teacherId],
  }),
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.subjectId],
  }),
}));