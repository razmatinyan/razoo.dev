import { H3Event } from 'h3';
import { v2 as cloudinary } from 'cloudinary';
import type { Images } from '@/types/images.d';

export default defineEventHandler(async (event: H3Event) => {
	const image = await readBody<Images>(event);
	const filename = image.filename;

	try {
		const cloudinaryFilename = filename.split('.')[0];
		const result = await cloudinary.uploader.destroy(cloudinaryFilename);

		if (result.result !== 'ok') {
			throw new Error('Error while deleting file.');
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
