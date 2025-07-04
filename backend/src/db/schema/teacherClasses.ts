import {relations} from "drizzle-orm";
import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {classes} from "./classes";
import {teachers} from "./teachers";

export const teacherClasses = pgTable("teachers_classes", {
  classId: integer("class_id").notNull().references(() => classes.classId, {onDelete: "cascade"}),
  teacherId: integer("teacher_id").notNull().references(() => teachers.teacherId, {onDelete: "cascade"}),
}, (table) => [
  primaryKey({columns: [table.teacherId, table.classId]}),
]);

export const teacherClassesRelations = relations(teacherClasses, ({one}) => ({
  class: one(classes, {
    fields: [teacherClasses.classId],
    references: [classes.classId],
  }),
  teacher: one(teachers, {
    fields: [teacherClasses.teacherId],
    references: [teachers.teacherId],
  }),
}));

export type TeacherClassCombination = typeof teacherClasses.$inferSelect;
