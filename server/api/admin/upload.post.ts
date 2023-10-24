import { H3Event } from 'h3';
import { v2 as cloudinary } from 'cloudinary';
import type { Images } from '@/types/images.d';
import type { UploadApiOptions } from '@/types/cloudinary.d';

const config = useRuntimeConfig();

cloudinary.config({
	cloud_name: config.cloud_name,
	api_key: config.cloud_api_key,
	api_secret: config.cloud_secret,
	secure: true,
});

const options: UploadApiOptions = {
	overwrite: true,
	invalidate: true,
	resource_type: 'auto',
};

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody<{ file: string }>(event);
	const file: string = body.file;

	if (!file) {
		return {
			statusCode: 400,
			statusMessage: 'No File provided.',
		};
	}

	try {
		const uploadedFile = await cloudinary.uploader.upload(file, options);
		const result: Images = { filename: `${uploadedFile.public_id}.${uploadedFile.format}` };

		return {
			statusCode: 200,
			data: result,
		};
	} catch (err) {
		return {
			statusCode: 400,
			statusMessage: 'Failed to upload image.',
		};
	}
});
