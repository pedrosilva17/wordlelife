import { getDB } from '../../database/db';
import type { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
	event.context.db = getDB();
});
