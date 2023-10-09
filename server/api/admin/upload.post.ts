import formidable from 'formidable';
import fs from 'fs';
import { H3Event } from 'h3';
import type { Images } from '@/types/images.d';

const DIR = './public/storage/';

export default defineEventHandler(async (event: H3Event) => {
	const form = formidable({ uploadDir: DIR });

	const [_, files] = await form.parse(event.node.req);
	let filename = '';
	let realFileName = '';

	if (Array.isArray(files.file)) {
		files.file.forEach((file: formidable.File) => {
			const parts = file.originalFilename?.split('.') as string[];
			const title = parts[0];
			const ext = parts[parts.length - 1];

			realFileName = `${Date.now()}-${title}.${ext}`;
			filename = `${DIR}${realFileName}`;

			fs.rename(file.filepath, filename, (err) => {
				return { status: 400, message: 'Image uploading error.' };
			});
		});
	}

	const res = { filename: realFileName } as Images;

	return {
		status: 200,
		data: res,
	};
});
