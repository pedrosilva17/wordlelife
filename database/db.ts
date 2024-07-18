import Database from 'better-sqlite3';

let db: Database.Database;

export function getDB(): Database.Database {
	if (!db) {
		db = new Database('database/database.db', { verbose: console.log });
	}
	return db;
}
