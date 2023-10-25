import { H3Event } from 'h3';
import { Cloudinary } from '../../utils/cloudinary';
import type { Images } from '@/types/images.d';

export default defineEventHandler(async (event: H3Event) => {
	const image = await readBody<Images>(event);
	const filename = image.filename;

	try {
		const cloudinary = new Cloudinary();
		const cloudinaryFilename = filename.split('.')[0];
		const data = await cloudinary.deleteFile(cloudinaryFilename);

		if (data.result !== 'ok') {
			throw createError({
				statusCode: 400,
				statusMessage: 'Error while deleting file.',
			});
		}

		return {
			statusCode: 200,
			data: {
				filename: '',
			} as Images,
		};
	} catch (err) {
		return {
			statusCode: 400,
			statusMessage: 'Error while deleting file.',
		};
	}
});
