import { db } from "@/db/index.js";
import { and, eq } from "drizzle-orm";
import { SelectedFields } from "drizzle-orm/pg-core";

/**
 * Queries a single item from the database based on the provided table and conditions.
 * @param table - The database table to query.
 * @param conditions - An array of conditions to filter the query.
 * @returns The single item if found, or null if not found.
 */
export async function querySingleItem<T>(
  table: any, 
  conditions: Array<any>, 
  select?: SelectedFields
): Promise<T | null> {
  const result = await (select ? db.select(select) : db.select())
    .from(table)
    .where(and(...conditions))
    .limit(1);

  return result.length > 0 ? (result[0] as T) : null;
}

/**
 * Inserts a single item into the database and returns the inserted item.
 * @param table - The database table to insert into.
 * @param values - The values to insert.
 * @returns The inserted item.
 */
export async function insertSingleItem<T>(table: any, values: Partial<T>): Promise<T> {
  const [insertedItem] = await db
    .insert(table)
    .values(values)
    .returning();

  return insertedItem as T;
}

