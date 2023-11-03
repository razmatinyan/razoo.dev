import { serverSupabaseClient } from '#supabase/server';
import { protect } from '~/server/utils/protect';
import type { H3Event } from 'h3';
import type { Database } from '~/types/database.d';
import type { ProjectAddResponse, ProjectSchema } from '~/types/project.d';
import type { ResponseError } from '~/types/response.d';

type RequestEdit = {
	allImages: ProjectSchema['allImages'];
};

export default defineEventHandler(async (event: H3Event): Promise<ProjectAddResponse> => {
	await protect(event);

	const id = getRouterParam(event, 'id');
	const req = await readBody<ProjectSchema>(event);
	delete req.id;

	if (!req) {
		return createError({
			statusCode: 400,
			statusMessage: 'No data provided.',
		});
	}

	const db = await serverSupabaseClient<Database>(event);

	const editedReq: RequestEdit = {
		allImages: req.allImages.filter((item) => item.filename !== ''),
	};
	Object.assign(req, editedReq);

	try {
		const { error } = await db.from('projects').update(req).eq('id', id);

		if (error !== null) {
			return createError({
				statusCode: 400,
				statusMessage: error.message,
			});
		}

		return {
			statusCode: 200,
			statusMessage: 'Updated.',
		};
	} catch (err: unknown) {
		const error = err as ResponseError;
		return {
			statusCode: error.statusCode,
			statusMessage: error.statusMessage,
		};
	}
});
