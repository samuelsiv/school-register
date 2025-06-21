import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { teachers } from "./teachers";

export const teacherClasses = pgTable("teachers_classes", {
  teacherId: integer("teacher_id").notNull().references(() => teachers.teacherId, { onDelete: "cascade" }),
  classId: integer("class_id").notNull().references(() => classes.classId, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({ columns: [table.teacherId, table.classId] }),
]);

export const teacherClassesRelations = relations(teacherClasses, ({ one }) => ({
  teacher: one(teachers, {
    fields: [teacherClasses.teacherId],
    references: [teachers.teacherId],
  }),
  class: one(classes, {
    fields: [teacherClasses.classId],
    references: [classes.classId],
  }),
}));

export type TeacherClassCombination = typeof teacherClasses.$inferSelect;
