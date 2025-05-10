import { pgTable, serial, integer, date, smallint, varchar, text, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students.js';
import { classes } from './classes.js';

export const events = pgTable('events', {
  presentId: serial('present_id').primaryKey(),
  noteId: serial('note_id'),
  lateId: serial('late_id'),
  exitId: serial('exit_id'),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }),
  classId: integer('class_id').notNull().references(() => classes.classId, { onDelete: 'cascade' }),
  lessonDate: date('lesson_date').notNull(),
  lessonHour: smallint('lesson_hour').notNull(),
  attendanceStatus: varchar('attendance_status', { length: 50 }).notNull(),
  justification: text('justification'),
}, (table) => {
  return {
    uniqueAttendance: unique().on(table.studentId, table.lessonDate, table.lessonHour),
  };
});

// Relations for events
export const eventsRelations = relations(events, ({ one }) => ({
  student: one(students, {
    fields: [events.studentId],
    references: [students.studentId],
  }),
  class: one(classes, {
    fields: [events.classId],
    references: [classes.classId],
  }),
}));