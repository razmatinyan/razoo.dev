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
					<template #item="{ _, index }">
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
import '~/assets/add-page.css';
import draggable from 'vuedraggable';
import type { Project, TechStack, ProjectAddResponse } from '~/types/project.d';
import {
	formOptions,
	madeWithOptions,
	techStackOptions,
	dragOptions,
	uploaded,
	orders,
	checkProjectData,
	addImageField,
	deleteImageField,
	clearFormData,
	dragHtmlClass,
} from '~/helpers/project.config';

definePageMeta({
	middleware: ['auth'],
});

// Variables
const form: Project = reactive({ ...formOptions });
const errors = useModalError();

// Functions
const handleSubmit = async (e: Event): Promise<void> => {
	checkProjectData(form, errors);

	if (errors.errors.value.reasons?.length) {
		return;
	} else {
		const { data, error } = await useFetch('/api/admin/add-project', {
			method: 'post',
			body: form,
			onResponseError({ response }) {
				errors.add(response._data.statusMessage);
			},
			transform: (data: ProjectAddResponse) => data,
		});

		if (!error.value) {
			if (data.value?.statusCode !== 201) {
				errors.add(data.value?.statusMessage);
			} else {
				uploaded.value = true;
			}
		}
	}
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

<style scoped></style>
