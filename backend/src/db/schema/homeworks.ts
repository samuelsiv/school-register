import {relations} from "drizzle-orm";
import {date, integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {classes} from "./classes";
import {subjects} from "./subjects";
import {teachers} from "./teachers";

export const homeworks = pgTable("homeworks", {
  classId: integer("class_id").notNull().references(() => classes.classId, {onDelete: "cascade"}),
  createdAt: date("created_at").defaultNow(),
  description: text("description"),
  dueDate: date("due_date"),
  homeworkId: serial("homework_id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.subjectId, {onDelete: "cascade"}),
  teacherId: integer("teacher_id").references(() => teachers.teacherId, {onDelete: "set null"}),
  title: varchar("title", {length: 255}).notNull(),
});

export const homeworksRelations = relations(homeworks, ({one}) => ({
  class: one(classes, {
    fields: [homeworks.classId],
    references: [classes.classId],
  }),
  subject: one(subjects, {
    fields: [homeworks.subjectId],
    references: [subjects.subjectId],
  }),
  teacher: one(teachers, {
    fields: [homeworks.teacherId],
    references: [teachers.teacherId],
  }),
}));

export type Homework = typeof homeworks.$inferSelect;
