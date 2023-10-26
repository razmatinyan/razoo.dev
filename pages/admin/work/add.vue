<template>
	<h1 class="section-title center">Add Work</h1>
	<form @submit.prevent="handleSubmit" id="form" novalidate>
		<div class="form-row double-row">
			<UIInput v-model="form.title" id="title" type="text" placeholder="Colorgen" required />
			<UIInput
				v-model="form.siteUrl"
				id="siteUrl"
				type="text"
				placeholder="https://colorgen.co/"
				required
			/>
		</div>
		<div class="form-row">
			<UITextarea
				v-model="form.description"
				id="description"
				type="text"
				placeholder="This website is about..."
				required
			/>
		</div>
		<div class="form-row">
			<UIInput v-model="form.year" id="year" type="number" placeholder="2023" />
		</div>
		<div class="form-row">
			<UISelect
				placeholder="Solo or Teamwork"
				:options="madeWithOptions"
				:selected="form.madeWith"
				@select="form.madeWith = $event"
			/>
		</div>
		<div class="form-row">
			<h2 class="row-title">Tech Stack</h2>
			<div class="columns columns-3">
				<div
					v-for="(item, index) in (techStackOptions as TechStack[])"
					:key="index"
					class="column"
				>
					<span class="column-title">{{ item.type }}</span>
					<div class="column-options">
						<UICheckbox
							v-for="val in item.values"
							v-model="form.techStack[index].data"
							:key="val"
							:value="val"
							:id="val"
							:label="val"
							required
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="form-row">
			<h2 class="row-title">Cover Image</h2>
			<UIFileInput v-model="form.coverImage.filename" text="Add Cover Image" />
		</div>
		<div class="form-row">
			<h2 class="row-title">Project Images</h2>
			<div class="all-images">
				<div v-for="(image, index) in form.allImages" class="image">
					<UIFileInput
						:key="image.id"
						v-model="form.allImages[index].filename"
						@add="addImageField"
						@delete="deleteImageField(index)"
					/>
				</div>
			</div>
		</div>

		<button type="submit" class="add-btn">
			<Icon name="heroicons:paper-airplane-solid" />
		</button>
	</form>

	<UIModal v-model="errors.isError" title="Error" @close="clearErrors">
		<template #content>
			<ul class="errors">
				<li v-for="error in errors.reasons" :key="Date.now()" class="error-text">
					{{ error }}
				</li>
			</ul>
		</template>
	</UIModal>
</template>

<script setup lang="ts">
import type { Project, TechStack, RecordString } from '@/types/project.d';
import '@/assets/modalTransitions.css';

definePageMeta({
	middleware: ['auth'],
	layout: 'admin',
});

// Variables
let imgId = ref<number>(0);
const form: Project = reactive({
	title: '',
	siteUrl: '',
	description: '',
	year: '',
	madeWith: '',
	techStack: [{ data: [] }, { data: [] }, { data: [] }] as RecordString,
	coverImage: { filename: '' },
	allImages: [{ id: imgId.value++, filename: '' }],
});

const madeWithOptions: Array<string> = ['Solo', 'Teamwork'];
const techStackOptions: TechStack[] = [
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

const errors = ref<{ isError: boolean; reasons?: Array<string | undefined> }>({
	isError: false,
	reasons: [],
});

// Functions
const addImageField = (): void => {
	form.allImages.push({ id: imgId.value++, filename: '' });
};

const deleteImageField = (index: number): void => {
	form.allImages.splice(index, 1);
};

const isUrl = (url: string): boolean => {
	const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	return urlRegex.test(url);
};

const handleSubmit = async (e: Event): Promise<void> => {
	if (form.title.length < 3)
		errors.value.reasons?.push('Title length must be longer than 3 characters');

	if (!isUrl(form.siteUrl)) errors.value.reasons?.push('Site URL is not valid');

	let isStackEmpty: number = 0;
	for (const stack in form.techStack) {
		if (form.techStack[stack].data.length === 0) isStackEmpty++;
	}

	if (isStackEmpty === form.techStack.length)
		errors.value.reasons?.push('Tech Stack must be chosen');

	if (form.coverImage.filename === '') errors.value.reasons?.push('Cover Image must be uploaded');
	if (form.allImages.length === 1 && form.allImages[0].filename === '')
		errors.value.reasons?.push('Project Images must be uploaded and more than 1 Image');

	if (errors.value.reasons?.length) {
		errors.value.isError = true;
		return;
	} else {
		const { data, error } = await useFetch('/api/admin/add-project', {
			method: 'post',
			body: form,
			onResponseError({ response }) {
				errors.value.isError = true;
				errors.value.reasons?.push(response._data.statusMessage);
			},
		});

		if (!error.value) {
			console.log(data.value);
			if (data.value?.statusMessage) {
				errors.value.isError = true;
				errors.value.reasons?.push(data.value?.statusMessage);
			}
		}
	}
};

const clearErrors = (): void => {
	errors.value.reasons = [];
};

// Watchers
watch(
	() => form.allImages,
	(newVal) => {
		if (!newVal.length) addImageField();
	},
	{ deep: true }
);
</script>

<style scoped>
#form {
	padding: 80px 0;
}
.form-row {
	margin-bottom: 20px;
}
.form-row.double-row {
	display: flex;
	align-items: center;
	gap: 20px;
}
.row-title {
	margin: 30px 0;
	font-size: 1.9rem;
}
.columns {
	display: grid;
	grid-gap: 30px;
}
.columns-3 {
	grid-template-columns: repeat(3, 1fr);
}
.column .column-title {
	display: block;
	margin-bottom: 12px;
	font-size: 1.3rem;
}
.column .column-options {
	display: flex;
	flex-direction: column;
}
.checkbox-wrapper:not(:last-child) {
	margin-bottom: 10px;
}
.image:not(:last-child) {
	margin-bottom: 30px;
}

.add-btn {
	--btn-size: 2em;
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: var(--btn-size);
	height: var(--btn-size);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2.5rem;
	border-radius: 50%;
	background: var(--primary);
	transition: var(--smooth);
	cursor: pointer;
}
.add-btn:hover {
	background: var(--primary-hover);
}

.errors {
	padding-left: 17px;
	color: #f97b7b;
	line-height: 1;
}
.error-text:not(:last-child) {
	margin-bottom: 12px;
}
</style>
