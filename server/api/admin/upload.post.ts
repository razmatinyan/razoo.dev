import { H3Event } from 'h3';
import { Cloudinary } from '../../utils/cloudinary';
import type { Images } from '@/types/images.d';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody<{ file: string }>(event);
	const file: string = body.file;

	if (!file) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No File provided.',
		});
	}

	try {
		const cloudinary = new Cloudinary();
		const uploadedFile = await cloudinary.uploadFile(file);
		const data: Images = { filename: `${uploadedFile.public_id}.${uploadedFile.format}` };

		return {
			statusCode: 200,
			data,
		};
	} catch (err) {
		return {
			statusCode: 400,
			statusMessage: 'Failed to upload image.',
		};
	}
});
