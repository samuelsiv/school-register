import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const parentStudents = pgTable('parent_students', {
  parentId: integer('parent_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
  studentId: integer('student_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.parentId, table.studentId] }),
]);

export const parentStudentsRelations = relations(parentStudents, ({ one }) => ({
    parent: one(users, {
        fields: [parentStudents.parentId],
        references: [users.userId],
    }),
    student: one(users, {
        fields: [parentStudents.studentId],
        references: [users.userId],
    }),
}));