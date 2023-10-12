<template>
	<div
		@dragenter.prevent="toggleActive"
		@dragleave.prevent="toggleActive"
		@dragover.prevent
		@drop.prevent="toggleActive"
		@click="triggerInput"
		:style="{ 'pointer-events': loading ? 'none' : 'all' }"
		:class="{ 'active-area': active, uploaded: refImage }"
		class="area"
	>
		<Transition name="fade" appear>
			<UIFileInputLoading v-show="loading" />
		</Transition>

		<div v-if="!refImage" class="area-content">
			<div class="in">
				<Icon name="heroicons:plus-20-solid" />
				<span class="text">{{ text }}</span>
			</div>

			<input
				:required="required"
				ref="input"
				type="file"
				class="file"
				@change="onChange($event)"
			/>
		</div>

		<div v-if="refImage" class="image-block">
			<div class="options">
				<div class="option">
					<Icon name="heroicons:arrow-path-20-solid" />
				</div>
				<div class="option" @click="isOpen = !isOpen">
					<Icon name="heroicons:x-mark" />
				</div>
			</div>
			<div class="img">
				<NuxtPicture :src="refImage" />
			</div>

			<UIModal v-model="isOpen" title="Delete image">
				<template #content>
					<p class="content-text">This File will be deleted forever. Are you sure?</p>
				</template>

				<template #buttons>
					<UIButton class="" @click="isOpen = false">Cancel</UIButton>
					<UIButton class="" @click="deleteImage(refImage)">Delete</UIButton>
				</template>
			</UIModal>
		</div>
	</div>
</template>

<script lang="ts">
import type { Images } from '@/types/images.d';

type UploadResult = {
	status: number;
	data: Images;
	message?: string;
};

export default defineComponent({
	props: {
		modelValue: {
			type: Object,
			default: {},
		},
		text: {
			type: String,
			default: 'Add Image',
		},
		required: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue', 'change'],
	setup(props, { emit }) {
		const input = ref<HTMLInputElement>();
		const active = ref<boolean>(false);
		const loading = ref<boolean>(false);
		const { text, required, image } = props;
		const refImage = toRef(image);
		const isOpen = ref<boolean>(false);

		const toggleActive = (): void => {
			active.value = !active.value;
		};

		const triggerInput = (): void => {
			input.value?.click();
		};

		const onChange = async (event: InputEvent): Promise<void> => {
			loading.value = true;
			const target = event.target as HTMLInputElement;
			const file = target.files ? (target.files[0] as File) : '';

			if (!file) return;
			if (file.type !== 'image/jpeg' && file.type !== 'image/png') return;

			const formData = new FormData();
			formData.append('file', file);

			const { data, error } = await useFetch('/api/admin/upload', {
				method: 'post',
				body: formData,
			});

			const res = unref(data) as UploadResult;
			refImage.value = res.data.filename;
			loading.value = false;

			emit('update:modelValue', res.data as Images);
			emit('change');
		};

		const deleteImage = async (filename: string): Promise<void> => {
			console.log(filename);
		};

		return {
			input,
			active,
			loading,
			text,
			required,
			image,
			refImage,
			isOpen,
			onChange,
			deleteImage,
			triggerInput,
			toggleActive,
		};
	},
});
</script>

<style scoped>
.area {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 100%;
	width: 100%;
	min-height: 250px;
	padding: 10px;
	box-shadow: var(--border-shadow);
	border-radius: 10px;
	background-color: var(--input-bg);
	cursor: pointer;
	user-select: none;
	overflow: hidden;
}
.area:hover,
.area.active {
	box-shadow: 0 0 0 3px var(--primary);
}
.active-area {
	box-shadow: none;
	border: 2px dashed var(--primary-hover);
}
.area-content {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100%;
}
.in {
	display: flex;
	align-items: center;
	flex-direction: column;
}
.icon {
	color: var(--placeholder-color);
	transition: color var(--smooth);
}
.text {
	display: block;
	margin-top: 10px;
	color: var(--placeholder-color);
	transition: color var(--smooth);
}
.img {
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;
	border-bottom-right-radius: 8px;
	border-bottom-left-radius: 8px;
	overflow: hidden;
}
.options {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 6px;
	margin-bottom: 10px;
}
.option {
	width: 30px;
	height: 30px;
	padding: 5px;
	border: 1px solid rgb(51 65 85);
	border-radius: 4px;
	transition: background var(--smooth);
}
.option:hover {
	background: rgba(255, 255, 255, 0.1);
}
.option .icon {
	display: block;
	width: 100%;
	height: 100%;
	color: white;
}

input {
	display: none;
}
.fade-enter-active,
.fade-leave-active {
	transition: var(--smooth);
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
