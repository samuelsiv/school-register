import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { classes } from "./classes";
import { grades } from "./grades";
import { homeworks } from "./homeworks";
import { teachersSubjects } from "./teacherSubjects";
import { users } from "./users";

export const teachers = pgTable("teachers", {
  teacherId: serial("teacher_id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.userId, { onDelete: "cascade" }),
});

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.userId],
  }),
  coordinatingClasses: many(classes),
  teacherSubjects: many(teachersSubjects),
  homeworks: many(homeworks),
  grades: many(grades),
}));

export type Teacher = typeof teachers.$inferSelect;
