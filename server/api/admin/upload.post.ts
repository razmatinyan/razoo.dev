import { H3Event } from 'h3';
import { Cloudinary } from '../../utils/cloudinary';
import { protect } from '~/server/utils/protect';
import type { Images } from '~/types/images.d';
import type { ResponseError } from '~/types/response.d';

interface UploadResponse {
	statusCode: number;
	statusMessage?: string;
	data?: Images;
}

export default defineEventHandler(async (event: H3Event): Promise<UploadResponse> => {
	await protect(event);

	const body = await readBody<{ file: string }>(event);
	const file: string = body.file;

	try {
		if (!file) {
			return createError({
				statusCode: 400,
				statusMessage: 'No File provided.',
			});
		}

		const cloudinary = new Cloudinary();
		const uploadedFile = await cloudinary.uploadFile(file);
		const data: Images = { filename: `${uploadedFile.public_id}.${uploadedFile.format}` };

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
