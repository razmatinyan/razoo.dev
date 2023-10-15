import fs from 'fs';
import { H3Event } from 'h3';
import type { Images } from '@/types/images.d';

const DIR = './public/storage/';

export default defineEventHandler(async (event: H3Event) => {
	const image = await readBody<Images>(event);
	const filename: string = image.filename;
	const filePath: string = `${DIR}${filename}`;
	let res: Images | undefined = { filename: '' };

	try {
		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (err) => {
				if (err) return false;
			});
		}
	} catch (err) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Error while deleting file.',
		});
	}

	res = { filename: '' };

	return {
		statusCode: 200,
		data: res,
	};
});
