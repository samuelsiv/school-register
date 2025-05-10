import { pgTable, serial, integer, date, smallint, varchar, text, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students.js';
import { classes } from './classes.js';
import { teachers } from './teachers.js';

export const events = pgTable('events', {
  eventId: serial('event_id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.studentId, { onDelete: 'cascade' }), // assigned to
  teacherId: integer('teacher_id').references(() => teachers.teacherId, { onDelete: 'cascade' }), // created by
  eventDate: date('event_date').notNull(),
  eventHour: smallint('event_hour').notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // e.g. "absence", "delay", "early leave", "present", "homework", "other", "note"
  eventDescription: text('event_description'), // e.g. "other"
}, (table) => [
   unique('uniqueAttendance').on(table.studentId, table.eventDate, table.eventHour),
]);

export const eventsRelations = relations(events, ({ one }) => ({
  student: one(students, {
    fields: [events.studentId],
    references: [students.studentId],
  }),
  teacher: one(teachers, {
    fields: [events.teacherId],
    references: [teachers.teacherId],
  })
}));