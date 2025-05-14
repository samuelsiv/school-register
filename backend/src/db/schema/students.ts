import { pgTable, serial, integer, date, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { classes } from './classes.js';
import { grades } from './grades.js';
import { events } from './events.js';

export const students = pgTable('students', {
  studentId: serial('student_id').primaryKey(),
  userId: integer('user_id').notNull().unique().references(() => users.userId, { onDelete: 'cascade' }),
  dateOfBirth: date('date_of_birth'),
  classId: integer('class_id').references(() => classes.classId, { onDelete: 'set null' }),
  registrationDate: timestamp('registration_date').defaultNow(),
  studentName: text("student_name").default("").notNull()
});

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.userId],
  }),
  class: one(classes, {
    fields: [students.classId],
    references: [classes.classId],
  }),
  grades: many(grades),
  events: many(events),
}));