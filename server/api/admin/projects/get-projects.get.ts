import { serverSupabaseClient } from '#supabase/server';
import { protect } from '~/server/utils/protect';
import type { H3Event } from 'h3';
import type { Database } from '~/types/database.d';
import type { ProjectAddResponse, ProjectSchema } from '~/types/project.d';
import type { ResponseError } from '~/types/response.d';

export default defineEventHandler(async (event: H3Event): Promise<ProjectAddResponse> => {
	await protect(event);

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
