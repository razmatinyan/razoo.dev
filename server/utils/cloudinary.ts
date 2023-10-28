import { v2 as cloudinary } from 'cloudinary';
import type {
	UploadApiOptions,
	UploadApiResponse,
	CloudinaryProperties,
} from '@/types/cloudinary.d';

const config = useRuntimeConfig();

cloudinary.config({
	cloud_name: config.cloud_name,
	api_key: config.cloud_api_key,
	api_secret: config.cloud_secret,
	secure: true,
});

/**
 * Cloudinary class, to use cloudinary API
 */
export class Cloudinary implements CloudinaryProperties {
	constructor(
		public options: UploadApiOptions = {
			overwrite: true,
			invalidate: true,
			resource_type: 'auto',
		}
	) {}

	/**
	 * Image upload to Cloudinary storage
	 * @param file base64 encoded file to upload
	 * @returns Promise with uploaded image information
	 */
	async uploadFile(file: string): Promise<UploadApiResponse> {
		return await cloudinary.uploader.upload(file, this.options);
	}

	/**
	 * Image delete from Cloudinary storage
	 * @param filename Cloudinary generated filename to delete
	 * @returns Promise with result of deleting
	 */
	async deleteFile(filename: string): Promise<{ result: string }> {
		return await cloudinary.uploader.destroy(filename);
	}
}
