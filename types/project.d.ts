import { Images } from './images.d';

export type RecordString = Record<string, string[]>[];

export type TechStack = {
	type: string;
	values: string[];
};

export interface Project {
	title: string;
	siteUrl: string;
	description?: string;
	year?: string | number;
	madeWith?: string;
	techStack: RecordString;
	coverImage: Images;
	allImages: Images[];
}

export interface ProjectAddResponse {
	statusCode: number;
	statusMessage?: string;
	data?: ProjectSchema | ProjectSchema[];
}

export interface ProjectGetResponse extends ProjectAddResponse {
	data: ProjectSchema | ProjectSchema[];
}

export interface ProjectSchema {
	id?: number;
	title: string;
	slug: string;
	siteUrl: string;
	description?: string;
	year?: string | number;
	madeWith?: string;
	techStack: RecordString;
	coverImage: Images;
	allImages: Images[];
	created_at: string;
}
