import { serverSupabaseClient } from '#supabase/server';
import { protect } from '~/server/utils/protect';
import { parseNestedJSON } from '~/server/utils/parseNestedJSON';
import type { H3Event } from 'h3';
import type { Database } from '~/types/database.d';
import type { Project, ProjectAddResponse, ProjectSchema } from '~/types/project.d';
import type { ResponseError } from '~/types/response.d';
import type { Images } from '~/types/images.d';

type RequestEdit = {
	slug: ProjectSchema['slug'];
	allImages?: ProjectSchema['allImages'];
};

export default defineEventHandler(async (event: H3Event): Promise<ProjectAddResponse> => {
	await protect(event);

	const req = await readBody<Project>(event);

	if (!req) {
		return createError({
			statusCode: 400,
			statusMessage: 'No data provided.',
		});
	}

	const db = await serverSupabaseClient<Database>(event);

	const editedReq: RequestEdit = {
		slug: req.title
			.toLowerCase()
			.split(/[ _.]+/)
			.join('-'),
		allImages: req.allImages.filter((item) => item.filename !== ''),
	};
	Object.assign(req, editedReq);

	try {
		const { data: result, error } = await db.from('projects').insert(req).select();

		if (error !== null) {
			return createError({
				statusCode: 400,
				statusMessage: error.message,
			});
		}

		const parsedData = {
			allImages: parseNestedJSON<Images>(result[0].allImages),
			techStack: parseNestedJSON<Record<string, string[]>>(result[0].techStack),
		};
		Object.assign(result[0], parsedData);

		const data: ProjectSchema = { ...result[0] };

		return {
			statusCode: 201,
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
