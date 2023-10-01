<template>
	<h1 class="section-title center">Add Work</h1>
	<form @submit.prevent id="form">
		<div class="form-row double-row">
			<UIInput
				id="title"
				type="text"
				placeholder="Colorgen"
				:model-value="form.title"
				@update:model-value="(newValue: string) => (form.title = newValue)"
			/>
			<UIInput
				id="siteUrl"
				type="text"
				placeholder="https://colorgen.co/"
				:model-value="form.siteUrl"
				@update:model-value="(newValue: string) => (form.siteUrl = newValue)"
			/>
		</div>
		<div class="form-row">
			<UITextarea
				id="description"
				type="text"
				placeholder="This website is about..."
				:model-value="form.description"
				@update:model-value="(newValue: string) => (form.description = newValue)"
			/>
		</div>
		<div class="form-row">
			<UIInput
				id="year"
				type="number"
				placeholder="2023"
				:model-value="form.year"
				@update:model-value="(newValue: number) => (form.year = newValue)"
			/>
		</div>
		<div class="form-row">
			<UISelect
				placeholder="Solo or Teamwork"
				:options="madeWithOptions"
				:selected="form.madeWith"
				@select="form.madeWith = $event"
			/>
		</div>
	</form>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth'],
	layout: 'admin',
});

interface ProjectImages {
	path: string;
	order: number;
}

interface Work {
	title: string;
	siteUrl: string;
	description?: string;
	year?: number;
	madeWith?: string | number;
	techStack: string;
	coverImage: string;
	allImages: ProjectImages[];
}

const madeWithOptions: Array<string> = ['Solo', 'Teamwork'];
const form = reactive({} as Work);
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
</style>
