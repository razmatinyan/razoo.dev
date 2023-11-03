import { H3Event } from 'h3';
import { protect } from '~/server/utils/protect';

export default defineEventHandler(async (event: H3Event) => {
	await protect(event);
});
