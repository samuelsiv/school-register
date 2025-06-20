import { relations } from "drizzle-orm";
import { date, integer, numeric, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { homeworks } from "./homeworks.js";
import { students } from "./students.js";
import { subjects } from "./subjects.js";
import { teachers } from "./teachers.js";

export const grades = pgTable("grades", {
  gradeId: serial("grade_id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.studentId, { onDelete: "cascade" }),
  teacherId: integer("teacher_id").notNull().references(() => teachers.teacherId, { onDelete: "set null" }),
  subjectId: integer("subject_id").notNull().references(() => subjects.subjectId, { onDelete: "cascade" }),
  value: numeric("value").notNull(),
  weight: numeric("weight").notNull(), // 50%, 100%
  insertedAt: date("inserted_at").defaultNow(),
  comment: text("comment"),
});

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.studentId],
  }),
  teacher: one(teachers, {
    fields: [grades.teacherId],
    references: [teachers.teacherId],
  }),
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.subjectId],
  }),
}));

export type Grade = typeof grades.$inferSelect;
