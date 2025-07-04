import {relations} from "drizzle-orm";
import {integer, pgTable, serial} from "drizzle-orm/pg-core";
import {classes} from "./classes";
import {events} from "./events";
import {grades} from "./grades";
import {users} from "./users";

export const students = pgTable("students", {
  studentId: serial("student_id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.userId, {onDelete: "cascade"}),
  classId: integer("class_id").references(() => classes.classId, {onDelete: "set null"}),
});

export const studentsRelations = relations(students, ({one, many}) => ({
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

export type Student = typeof students.$inferSelect;
