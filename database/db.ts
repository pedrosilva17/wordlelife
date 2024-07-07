import Database from 'better-sqlite3';

let db: Database.Database;

export function getDB(): Database.Database {
	if (!db) {
		db = new Database('./database.db', { verbose: console.log });
	}
	return db;
}
