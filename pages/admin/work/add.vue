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
							:id="`checkbox-${val}`"
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
			<h2 class="row-title" style="pointer-events: all">
				Project Images
				<Icon
					name="heroicons:arrows-pointing-out"
					style="margin-left: 10px; cursor: pointer"
					@click="orders = true"
				/>
			</h2>

			<div class="all-images">
				<div v-for="(image, index) in form.allImages" class="image">
					<UIFileInput
						:key="image.id"
						v-model="form.allImages[index].filename"
						@add="addImageField(form)"
						@delete="deleteImageField(form, index)"
					/>
				</div>
			</div>
		</div>

		<button type="submit" class="add-btn">
			<Icon name="heroicons:paper-airplane-solid" />
		</button>
	</form>

	<UIModal v-model="orders" title="Images" :width="900">
		<template #content>
			<transition-group>
				<draggable
					v-model="form.allImages"
					v-bind="dragOptions"
					key="draggable"
					item-key="id"
					class="order-images"
					@start="($event.item.style.opacity = 0), dragHtmlClass('add')"
					@end="($event.item.style.opacity = 1), dragHtmlClass('remove')"
				>
					<template #item="{ image, index }">
						<div v-if="form.allImages[index].filename" class="order-image">
							<div class="image">
								<NuxtImg
									provider="cloudinary"
									:src="form.allImages[index].filename"
								/>
							</div>
						</div>
					</template>
				</draggable>
			</transition-group>
		</template>
	</UIModal>

	<UIModal v-model="errors.isError" title="Error" @close="clearErrors">
		<template #content>
			<ul class="errors">
				<li
					v-for="(error, index) in errors.reasons"
					:key="`error-${index}`"
					class="error-text"
				>
					{{ error }}
				</li>
			</ul>
		</template>
	</UIModal>

	<UIModal v-model="uploaded" title="Success" @close="clearFormData">
		<template #content>
			<p class="content-text">Project is successfully uploaded.</p>
		</template>

		<template #buttons>
			<UIButton class="border half-height" @click="uploaded = false">OK</UIButton>
		</template>
	</UIModal>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import type { Project, TechStack, ProjectAddResponse } from '~/types/project.d';
import {
	formOptions,
	madeWithOptions,
	techStackOptions,
	dragOptions,
	uploaded,
	orders,
	addImageField,
	deleteImageField,
	isUrl,
	clearFormData,
	dragHtmlClass,
} from '~/helpers/project.config';

definePageMeta({
	middleware: ['auth'],
});

// Variables
const form: Project = reactive({ ...formOptions });
const errors = ref<{ isError: boolean; reasons?: Array<string | undefined> }>({
	isError: false,
	reasons: [],
});

// Functions
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
			transform: (data: ProjectAddResponse) => data,
		});

		if (!error.value) {
			if (data.value?.statusCode !== 201) {
				errors.value.isError = true;
				errors.value.reasons?.push(data.value?.statusMessage);
			} else {
				uploaded.value = true;
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
		if (!newVal.length) addImageField(form);
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

.flip-list-move {
	transition: transform 0.5s;
}
.order-images {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	flex-wrap: wrap;
	grid-gap: 20px;
}
.order-images .order-image {
	padding: 10px;
	border-radius: 5px;
	box-shadow: var(--border-shadow);
	overflow: hidden;
	cursor: move;
}
.order-images .order-image:hover {
	background: rgba(143, 143, 143, 0.1);
}

.order-images .order-image .image {
	height: 100%;
}
.order-images .order-image img {
	height: 100%;
	object-fit: cover;
	border-radius: 3px;
}
</style>
