<template>
	<h1 class="section-title center">Add Work</h1>
	<form @submit.prevent id="form">
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
			<UIFileInput v-model="form.coverImage" text="Add Cover Image" required />
		</div>
		<div class="form-row">
			<h2 class="row-title">Project Images</h2>
			<div class="all-images">
				{{ form.allImages }}
				<div v-for="(image, index) in form.allImages" class="image">
					<UIFileInput
						:key="index"
						v-model="form.allImages[index]"
						@add="addImageField"
						@delete="deleteEmptyField(index)"
					/>
				</div>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
import type { Images } from '@/types/images.d';

definePageMeta({
	middleware: ['auth'],
	layout: 'admin',
});

type ArrOfObj = Array<{ [key: string]: string[] }>;

type TechStack = {
	type: string;
	values: string[];
};

interface Work {
	title: string;
	siteUrl: string;
	description?: string;
	year?: string | number;
	madeWith?: string;
	techStack: ArrOfObj;
	coverImage: Images;
	allImages: Images[];
}

const form: Work = reactive({
	title: '',
	siteUrl: '',
	description: '',
	year: '',
	madeWith: '',
	techStack: [{ data: [] }, { data: [] }, { data: [] }] as ArrOfObj,
	coverImage: { filename: '' },
	allImages: [{ filename: '' }],
});

watch(form.allImages, (newVal, oldVal) => {
	console.log(newVal, oldVal);
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

const addImageField = (): void => {
	form.allImages.push({ filename: '' });
};

const deleteEmptyField = (index: number): void => {
	form.allImages.splice(index, 1);
};
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
</style>
