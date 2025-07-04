import {relations} from "drizzle-orm";
import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {subjects} from "./subjects";
import {teachers} from "./teachers";

export const teachersSubjects = pgTable("teachers_subjects", {
  subjectId: integer("subject_id").notNull().references(() => subjects.subjectId, {onDelete: "cascade"}),
  teacherId: integer("teacher_id").notNull().references(() => teachers.teacherId, {onDelete: "cascade"}),
}, (table) => [
  primaryKey({columns: [table.teacherId, table.subjectId]}),
]);

export const teachersSubjectsRelations = relations(teachersSubjects, ({one}) => ({
  subject: one(subjects, {
    fields: [teachersSubjects.subjectId],
    references: [subjects.subjectId],
  }),
  teacher: one(teachers, {
    fields: [teachersSubjects.teacherId],
    references: [teachers.teacherId],
  }),
}));

export type TeacherSubjectCombination = typeof teachersSubjects.$inferSelect;
