import { serverSupabaseClient } from '#supabase/server';
import { protect } from '~/server/utils/protect';
import { parseNestedJSON } from '~/server/utils/parseNestedJSON';
import type { H3Event } from 'h3';
import type { Database } from '~/types/database.d';
import type { ProjectAddResponse, ProjectSchema } from '~/types/project.d';
import type { ResponseError } from '~/types/response.d';
import type { Images } from '~/types/images.d';

export default defineEventHandler(async (event: H3Event): Promise<ProjectAddResponse> => {
	await protect(event);

	const db = await serverSupabaseClient<Database>(event);
	const id = getRouterParam(event, 'id');

	try {
		const { data: result, error } = await db.from('projects').select().eq('id', id).limit(1);

		if (error !== null) {
			return createError({
				statusCode: 400,
				statusMessage: error.message,
			});
		}

		if (!result.length) {
			return createError({
				statusCode: 400,
				statusMessage: 'Project with this ID is not found.',
			});
		}

		const parsedData = {
			allImages: parseNestedJSON<Images>(result[0].allImages),
			techStack: parseNestedJSON<Record<string, string[]>>(result[0].techStack),
		};
		Object.assign(result[0], parsedData);

		const data: ProjectSchema = { ...result[0] };

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
