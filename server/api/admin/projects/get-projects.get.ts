import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';
import type { H3Event } from 'h3';
import type { Database } from '@/types/database.d';
import type { ProjectAddResponse, ProjectSchema } from '@/types/project.d';
import type { ResponseError } from '@/types/response.d';

export default defineEventHandler(async (event: H3Event): Promise<void | ProjectAddResponse> => {
	try {
		await serverSupabaseUser(event);
	} catch (err) {
		return createError({
			statusCode: 401,
			message: 'No authorized user found.',
		});
	}

	const db = await serverSupabaseClient<Database>(event);

	try {
		const { data: result, error } = await db.from('projects').select();

		if (error !== null) {
			return createError({
				statusCode: 400,
				statusMessage: error.message,
			});
		}

		const data: ProjectSchema[] = result;

		return {
			statusCode: 200,
			data,
		};
	} catch (err: unknown) {
		const error = err as ResponseError;
		return {
			statusCode: error.statusCode,
			statusMessage: error.statusMessage,
		};
	}
});
