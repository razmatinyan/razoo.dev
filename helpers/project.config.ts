import type {
	ProjectGetResponse,
	ProjectSchema,
	Project,
	TechStack,
	RecordString,
	ProjectAddResponse,
} from '~/types/project.d';

// Variables
export const formOptions: Project | ProjectSchema = {
	id: 0,
	title: '',
	slug: '',
	siteUrl: '',
	description: '',
	year: '',
	madeWith: '',
	techStack: [{ data: [] }, { data: [] }, { data: [] }] as RecordString,
	coverImage: { filename: '' },
	allImages: [{ id: useId(), filename: '' }],
	created_at: '',
};

export const madeWithOptions: Array<string> = ['Solo', 'Teamwork'];

export const techStackOptions: TechStack[] = [
	{
		type: 'Frontend',
		values: [
			'HTML',
			'Javascript',
			'Typescript',
			'jQuery',
			'Vue',
			'Nuxt/Vue',
			'THREE.js',
			'CSS',
			'SCSS',
			'Tailwind CSS',
		],
	},
	{
		type: 'Backend',
		values: ['Nuxt', 'Node.js', 'PHP'],
	},
	{
		type: 'Database',
		values: ['MySQL', 'MongoDB', 'Supabase', 'GraphQL', 'Apollo'],
	},
];

export const dragOptions = {
	animation: 200,
	group: 'description',
	disabled: false,
	ghostClass: 'ghost',
};

export const uploaded = ref<boolean>(false);

export const orders = ref<boolean>(false);

// Functions
export const addImageField = (form: Project | ProjectSchema, imageId?: number): void => {
	form.allImages.push({ id: useId(imageId), filename: '' });
};

export const deleteImageField = (form: Project | ProjectSchema, index: number): void => {
	form.allImages.splice(index, 1);
};

export const isUrl = (url: string): boolean => {
	const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	return urlRegex.test(url);
};

export const clearFormData = (): void => {
	reloadNuxtApp();
};

export const dragHtmlClass = (action: string): void => {
	if (action === 'add') document.documentElement.classList.add('dragging');
	else if (action === 'remove') document.documentElement.classList.remove('dragging');
};
