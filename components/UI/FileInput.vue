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
			<div class="options"></div>
			<div class="img">
				<NuxtPicture :src="refImage" />
			</div>
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

		return {
			input,
			active,
			loading,
			text,
			required,
			image,
			refImage,
			onChange,
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
