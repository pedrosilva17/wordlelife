import type { H3Event } from 'h3';
import type { Wrestler } from '../../interfaces/wrestler';
import Database from 'better-sqlite3';

export default defineEventHandler(async (event: H3Event) => {
	const { action, name } = getQuery(event);
	const db = event.context.db;

	switch (action) {
		case 'all':
			return getAllWrestlers(db);
		case 'random':
			return getRandomWrestler(db);
		case 'one':
			return getWrestler(db, name as string);
		default:
			return getAllWrestlers(db);
	}
});

function getAllWrestlers(db: Database.Database) {
	const stmt = db.prepare('SELECT * FROM Wrestlers');
	return stmt.all() as Wrestler[];
}

function getRandomWrestler(db: Database.Database) {
	const stmt = db.prepare('SELECT * FROM Wrestlers ORDER BY RANDOM() LIMIT 1');
	return stmt.get() as Wrestler;
}

function getWrestler(db: Database.Database, name: string) {
	const stmt = db.prepare('SELECT * FROM Wrestlers WHERE name = ?');
	return stmt.get(name) as Wrestler;
}
