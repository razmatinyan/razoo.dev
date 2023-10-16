import formidable from 'formidable';
import type { Files as FormidableFiles, Fields as FormidableFields } from 'formidable';
import fs from 'fs';
import { H3Event } from 'h3';
import type { Images } from '@/types/images.d';

const DIR = process.env.NODE_ENV === 'development' ? './public/storage/' : '/storage/';

export default defineEventHandler(async (event: H3Event) => {
	const form = formidable({ uploadDir: DIR });
	let _: FormidableFields;
	let files: FormidableFiles;
	let res: Images | undefined = { filename: '' };

	if (!fs.existsSync(DIR)) {
		fs.mkdirSync(DIR);
	}

	try {
		[_, files] = await form.parse(event.node.req);
	} catch (err) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Directory does not exist.',
		});
	}

	if (files) {
		let filename: string = '';
		let realFileName: string = '';

		if (Array.isArray(files.file)) {
			files.file.forEach((file: formidable.File) => {
				const parts = file.originalFilename?.split('.') as string[];
				const title: string = parts[0];
				const ext: string = parts[parts.length - 1];

				realFileName = `${Date.now()}-${title}.${ext}`;
				filename = `${DIR}${realFileName}`;

				fs.rename(file.filepath, filename, (err) => {
					if (err)
						throw createError({
							statusCode: 400,
							statusMessage: 'Error while image upload.',
						});
				});
			});
		}

		res = { filename: realFileName };
	}

	return {
		statusCode: 200,
		data: res,
	};
});
