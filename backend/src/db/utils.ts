import { db } from "@/db/index.js";
import { and, eq } from "drizzle-orm";

/**
 * Queries a single item from the database based on the provided table and conditions.
 * @param table - The database table to query.
 * @param conditions - An array of conditions to filter the query.
 * @returns The single item if found, or null if not found.
 */
export async function querySingleItem<T>(table: any, conditions: Array<any>): Promise<T | null> {
  const result = await db
    .select()
    .from(table)
    .where(and(...conditions))
    .limit(1);

  return result.length > 0 ? (result[0] as T) : null;
}