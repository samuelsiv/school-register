import {relations} from "drizzle-orm";
import {pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";
import {students} from "./students";
import {teachers} from "./teachers";

export const users = pgTable("users", {
  creationDate: timestamp("creation_date").defaultNow(),
  email: varchar("email", {length: 255}).notNull().unique(),
  lastLoginDate: timestamp("last_login_date"),
  name: varchar("name", {length: 255}).notNull(),
  password: varchar("password", {length: 255}).notNull(),
  role: varchar("role", {length: 50}).notNull(),
  surname: varchar("surname", {length: 255}).notNull(),
  userId: serial("user_id").primaryKey(),
  username: varchar("username", {length: 255}),
});

export const usersRelations = relations(users, ({one}) => ({
  student: one(students, {
    fields: [users.userId],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.userId],
    references: [teachers.userId],
  }),
}));

export type User = typeof users.$inferSelect;
