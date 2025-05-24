import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teachers } from './teachers.js';
import { classes } from './classes.js';

export const teacherClasses = pgTable('teachers_classes', {
  teacherId: integer('teacher_id').notNull().references(() => teachers.teacherId, { onDelete: 'cascade' }),
  classId: integer('class_id').notNull().references(() => classes.classId, { onDelete: 'cascade' }),
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