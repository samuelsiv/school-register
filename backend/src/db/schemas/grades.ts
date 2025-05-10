import { pgTable, serial, integer, numeric, date, text, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students.js';
import { homeworks } from './homeworks.js';
import { teachers } from './teachers.js';

export const grades = pgTable('grades', {
  gradeId: serial('grade_id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }),
  homeworkId: integer('homework_id').notNull().references(() => homeworks.homeworkId, { onDelete: 'cascade' }),
  teacherId: integer('teacher_id').references(() => teachers.teacherId, { onDelete: 'set null' }),
  gradeValue: numeric('grade_value').notNull(),
  dateOfGrade: date('date_of_grade').defaultNow(),
  comment: text('comment'),
}, (table) => {
  return {
    uniqueStudentHomework: unique().on(table.studentId, table.homeworkId),
  };
});

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.studentId],
  }),
  homework: one(homeworks, {
    fields: [grades.homeworkId],
    references: [homeworks.homeworkId],
  }),
  teacher: one(teachers, {
    fields: [grades.teacherId],
    references: [teachers.teacherId],
  }),
}));