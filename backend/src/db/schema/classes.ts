import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { homeworks } from "./homeworks.js";
import { students } from "./students.js";
import { teachers } from "./teachers.js";

export const classes = pgTable("classes", {
  classId: serial("class_id").primaryKey(),
  className: varchar("class_name", { length: 255 }).notNull().unique(),
  schoolYear: varchar("school_year", { length: 50 }),
  coordinatorTeacherId: integer("coordinator_teacher_id").references(() => teachers.teacherId),
});

export const classesRelations = relations(classes, ({ many, one }) => ({
  students: many(students),
  coordinator: one(teachers, {
    fields: [classes.coordinatorTeacherId],
    references: [teachers.teacherId],
  }),
  homeworks: many(homeworks),
  events: many(events),
}));

export type Class = typeof classes.$inferSelect;
