import { H3Event } from 'h3';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event: H3Event) => {
	try {
		await serverSupabaseUser(event);
	} catch (err) {
		throw createError({
			statusCode: 401,
			message: 'No authorized user found.',
		});
	}
});
