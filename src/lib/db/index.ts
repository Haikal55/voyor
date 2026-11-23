import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "voyor.db");

const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

export const sqlite =
  globalForDb.sqlite ??
  new Database(dbPath, {
    fileMustExist: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

try {
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
} catch (e) {
  console.warn("Could not set pragmas on SQLite connection", e);
}

export const db = drizzle(sqlite, { schema });
