import type { ModalError, ModalErrorComposable } from '~/types/error';
import type { ProjectSchema, Project, TechStack, RecordString } from '~/types/project.d';

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
export const checkProjectData = (
	form: Project | ProjectSchema,
	errors: ModalErrorComposable
): void => {
	if (form.title.length < 3) errors.add('Title length must be longer than 3 characters');

	if (!isUrl(form.siteUrl)) errors.add('Site URL is not valid');

	let isStackEmpty: number = 0;
	for (const stack in form.techStack) {
		if (form.techStack[stack].data.length === 0) isStackEmpty++;
	}

	if (isStackEmpty === form.techStack.length) errors.add('Tech Stack must be chosen');

	if (form.coverImage.filename === '') errors.add('Cover Image must be uploaded');
	if (form.allImages.length === 1 && form.allImages[0].filename === '')
		errors.add('Project Images must be uploaded and more than 1 Image');
};

export const addImageField = (form: Project | ProjectSchema, imageId?: number): void => {
	form.allImages.push({ id: useId(imageId), filename: '' });
};

export const deleteImageField = (form: Project | ProjectSchema, index: number): void => {
	form.allImages.splice(index, 1);
};

export const isUrl = (url: string): boolean => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url);

export const clearFormData = (): void => {
	reloadNuxtApp();
};

export const dragHtmlClass = (action: string): void => {
	if (action === 'add') document.documentElement.classList.add('dragging');
	else if (action === 'remove') document.documentElement.classList.remove('dragging');
};
