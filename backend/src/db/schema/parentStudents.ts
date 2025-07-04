import {relations} from "drizzle-orm";
import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {students} from "./students";
import {users} from "./users";

export const parentStudents = pgTable("parent_students", {
  parentId: integer("parent_id").notNull().references(() => users.userId, {onDelete: "cascade"}),
  studentId: integer("student_id").notNull().references(() => students.studentId, {onDelete: "cascade"}),
}, (table) => [
  primaryKey({columns: [table.parentId, table.studentId]}),
]);

export const parentStudentsRelations = relations(parentStudents, ({one}) => ({
  parent: one(users, {
    fields: [parentStudents.parentId],
    references: [users.userId],
  }),
  student: one(students, {
    fields: [parentStudents.studentId],
    references: [students.studentId],
  }),
}));

export type ParentStudentCombination = typeof parentStudents.$inferSelect;
