import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '@/types/database.d';
import type { H3Event } from 'h3';
import type { Project, ProjectAddResponse } from '@/types/project.d';

export default defineEventHandler(async (event: H3Event): Promise<void | ProjectAddResponse> => {
	const req = await readBody<Project>(event);
	const db = await serverSupabaseClient<Database>(event);

	try {
		const { data, error } = await db.from('projects').insert(req).select();

		if (error !== null) {
			throw createError({
				statusCode: 400,
				statusMessage: error.message as string,
			});
		}

		return {
			statusCode: 200,
			data: data[0],
		};
	} catch (err) {
		return {
			statusCode: 400,
			statusMessage: err,
		};
	}
});
