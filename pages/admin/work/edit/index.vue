<template>
	<h1 class="section-title center">Edit Work</h1>

	<p v-if="pending" class="pending-text">Loading...</p>

	<section v-else-if="projects" id="edit" class="content projects">
		<div v-for="project in projects" :key="project.id" class="row-project">
			<div class="project">
				<div class="image">
					<NuxtImg
						provider="cloudinary"
						format="webp"
						width="200"
						:src="project.coverImage.filename"
						:placeholder="[200, 113]"
					/>
				</div>
				<div class="info">
					<h2>{{ project.title }}</h2>
					<span class="date">{{ formatDate(project.created_at) }}</span>
				</div>
				<div class="actions">
					<NuxtLink :to="`/admin/work/edit/${project.id}`" class="action">
						<Icon name="heroicons:pencil-20-solid" color="white" />
					</NuxtLink>
					<span class="action">
						<Icon name="heroicons:trash-20-solid" color="white" />
					</span>
				</div>
			</div>
		</div>
	</section>

	<p v-else class="pending-text">No any project.</p>
</template>

<script setup lang="ts">
import type { ProjectSchema, ProjectAddResponse } from '@/types/project.d';

definePageMeta({
	middleware: ['auth'],
});

/**
 * Get projects from api
 */
const { data: projects, pending } = useLazyFetch('/api/admin/projects/get-projects', {
	transform: (projects: ProjectAddResponse) => {
		projects.data = projects.data as ProjectSchema[];
		return projects.data.map((project) => ({
			id: project.id,
			title: project.title,
			coverImage: project.coverImage,
			created_at: project.created_at,
		}));
	},
});

/**
 * Date Formatter
 * @param date - date string
 * @returns date string
 */
const formatDate = (date: string): string => {
	const options: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	};
	const parsedDate = new Date(date);

	return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
};
</script>

<style scoped>
#edit {
	padding: 80px 0;
}
.pending-text {
	display: block;
	margin-top: 40px;
	text-align: center;
	font-size: 1rem;
}
.row-project {
	margin-bottom: 20px;
	padding: 10px;
	background: var(--input-bg);
	border-radius: 6px;
	box-shadow: var(--border-shadow);
}
.project {
	display: flex;
}
.image {
	min-height: 113px;
	border-radius: 4px;
	filter: drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.7));
	overflow: hidden;
}
.image {
	object-fit: cover;
}
.info {
	flex-grow: 1;
	margin-left: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.info > h2 {
	font-size: 1em;
	line-height: 0.85;
	text-transform: lowercase;
}
.info > .date {
	font-size: 0.8rem;
	color: var(--placeholder-color);
}

.actions {
	display: flex;
	align-items: flex-end;
	gap: 6px;
}
.action {
	display: block;
	width: 30px;
	height: 30px;
	padding: 5px;
	border: 1px solid rgb(51 65 85);
	border-radius: 4px;
	transition: background var(--smooth);
	cursor: pointer;
}
.action:hover {
	background: rgba(255, 255, 255, 0.1);
}
.action .icon {
	display: block;
	width: 100%;
	height: 100%;
	color: white;
}
</style>
