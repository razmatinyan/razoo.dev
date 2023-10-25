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
	statusMessage?: string | Array<{}> | Record<string, any> | unknown;
	data?: ProjectsTableSchema[];
}

export interface ProjectsTableSchema {
	title: string;
	slug: string;
	siteUrl: string;
	description?: string;
	year?: string | number;
	madeWith?: string;
	techStack: RecordString;
	coverImage: Images;
	allImages: Images[];
	created_at?: string;
}
