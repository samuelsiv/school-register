import {relations} from "drizzle-orm";
import {date, integer, pgTable, serial, smallint, text, varchar} from "drizzle-orm/pg-core";
import {classes} from "./classes";
import {students} from "./students";
import {teachers} from "./teachers";

export const events = pgTable("events", {
  eventId: serial("event_id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.studentId, {onDelete: "cascade"}), // assigned to
  teacherId: integer("teacher_id").references(() => teachers.teacherId, {onDelete: "cascade"}), // created by
  eventDate: date("event_date").notNull(),
  eventHour: smallint("event_hour").notNull(),
  eventType: varchar("event_type", {length: 50}).notNull(), // e.g. ["present", "absence", "delay", "leave"]
  eventDescription: text("event_description"), // e.g. "other"
  classId: integer("class_id").notNull().references(() => classes.classId, {onDelete: "cascade"}),
});

export const eventsRelations = relations(events, ({one}) => ({
  student: one(students, {
    fields: [events.studentId],
    references: [students.studentId],
  }),
  teacher: one(teachers, {
    fields: [events.teacherId],
    references: [teachers.teacherId],
  }),
  class: one(classes, {
    fields: [events.classId],
    references: [classes.classId],
  }),
}));

export type Event = typeof events.$inferSelect;
