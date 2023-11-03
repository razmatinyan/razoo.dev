import { H3Event } from 'h3';
import { serverSupabaseUser } from '#supabase/server';

export const protect = async (event: H3Event) => {
	try {
		await serverSupabaseUser(event);
	} catch (err) {
		throw createError({
			statusCode: 401,
			statusMessage: 'No authorized user found.',
		});
	}
};
