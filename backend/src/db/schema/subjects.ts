import {relations} from "drizzle-orm";
import {pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {homeworks} from "./homeworks";
import type {students} from "./students";
import {teachersSubjects} from "./teacherSubjects";

export const subjects = pgTable("subjects", {
  subjectId: serial("subject_id").primaryKey(),
  subjectName: varchar("subject_name", {length: 255}).notNull().unique(),
  description: text("description"),
});

export const subjectsRelations = relations(subjects, ({many}) => ({
  teacherSubjects: many(teachersSubjects),
  homeworks: many(homeworks),
}));

export type Subject = typeof students.$inferSelect;
