<template>
	<div
		@dragenter.prevent="toggleActive"
		@dragleave.prevent="toggleActive"
		@dragover.prevent
		@drop.prevent="toggleActive"
		@click="(e) => callInput && triggerInput()"
		:style="{ 'pointer-events': loading ? 'none' : 'all' }"
		:class="{ 'active-area': active, uploaded: refImage }"
		v-bind="$attrs"
		class="area"
	>
		<Transition name="fade" appear>
			<UIFileInputLoading v-show="loading" />
		</Transition>

		<div v-show="!refImage" class="area-content">
			<div class="in">
				<Icon name="heroicons:plus-20-solid" size="1.5em" />
				<span class="text">{{ $props.text }}</span>
			</div>

			<input
				:required="$props.required"
				ref="input"
				type="file"
				class="file"
				@change="onChange($event)"
			/>
		</div>

		<div v-if="refImage" class="image-block">
			<div class="options">
				<div class="option" @click="triggerInput">
					<Icon name="heroicons:arrow-path-20-solid" />
				</div>
				<div class="option" @click="isOpen = !isOpen">
					<Icon name="heroicons:x-mark" />
				</div>
			</div>
			<div class="img">
				<NuxtPicture provider="cloudinary" :src="refImage" />
			</div>
		</div>

		<UIModal v-model="isOpen" title="Delete image">
			<template #content>
				<p class="content-text">This File will be deleted forever. Are you sure?</p>
			</template>

			<template #buttons>
				<UIButton class="border half-height" @click="isOpen = false">Cancel</UIButton>
				<UIButton class="red half-height" @click="deleteImage(refImage)">Delete</UIButton>
			</template>
		</UIModal>

		<UIModal v-model="isError.open" title="Error">
			<template #content>
				<p class="content-text">{{ isError.msg }}</p>
			</template>
		</UIModal>
	</div>
</template>

<script lang="ts">
import type { Images } from '@/types/images.d';

type UploadResult = {
	statusCode: number;
	data: Images;
	statusMessage?: string;
};

export default defineComponent({
	props: {
		modelValue: {
			type: String,
			default: '',
		},
		text: {
			type: String,
			default: 'Add Image',
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'add', 'change', 'delete', 'error'],
	setup(props, { emit }) {
		const refImage = toRef(props.modelValue);
		const input = ref<HTMLInputElement>();
		const active = ref<boolean>(false);
		const loading = ref<boolean>(false);
		const isOpen = ref<boolean>(false);
		const callInput = refImage.value ? ref<boolean>(false) : ref<boolean>(true);
		const isError: { open: boolean; msg: string | undefined } = reactive({
			open: false,
			msg: '',
		});

		const toggleActive = (): void => {
			active.value = !active.value;
		};

		const triggerInput = (): void => {
			input.value?.click();
		};

		const convertToDataURL = (file: File) => {
			return new Promise((resolve, reject) => {
				const fileReader = new FileReader();
				fileReader.readAsDataURL(file);

				fileReader.onload = () => {
					resolve(fileReader.result);
				};

				fileReader.onerror = (error) => {
					reject(error);
				};
			});
		};

		const onChange = async (event: InputEvent): Promise<void> => {
			loading.value = true;
			const target = event.target as HTMLInputElement;
			const file = target.files ? (target.files[0] as File) : '';

			if (!file) {
				loading.value = false;
				return;
			}

			if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
				loading.value = false;
				return handleError('Error with file type.');
			}

			const formData = new FormData();
			formData.append('file', file);

			const requestFile = await convertToDataURL(file);
			const { data, error } = await useFetch('/api/admin/upload', {
				method: 'post',
				body: {
					file: requestFile,
				},
				onResponseError({ response }) {
					handleError(response._data.statusMessage);
				},
			});

			if (!error.value) {
				const res = unref(data) as UploadResult;

				if (res.statusCode === 200) {
					if (res.data.filename) {
						let emitAddOrNot = true;
						if (refImage.value !== '') emitAddOrNot = false;
						refImage.value = res.data.filename;
						emit('update:modelValue', res.data.filename);
						emit('change');
						if (emitAddOrNot) emit('add');
					} else {
						handleError('No Image Recieved.');
					}
				} else {
					handleError(res.statusMessage);
				}
			}

			loading.value = false;
		};

		const deleteImage = async (
			filename: string,
			emptyVals: boolean = true
		): Promise<void | ReturnType<typeof setTimeout>> => {
			isOpen.value = false;

			if (filename) {
				const { data, error } = await useFetch('/api/admin/delete-file', {
					method: 'delete',
					body: {
						filename,
					},
					onResponseError({ response }) {
						handleError(response._data.statusMessage);
					},
				});

				if (!error.value) {
					const res = unref(data) as UploadResult;

					if (res.statusCode === 200) {
						if (res.data.filename === '') {
							if (emptyVals) {
								refImage.value = '';
								input.value!.files = new DataTransfer().files;
								emit('update:modelValue', '');
								return setTimeout(() => {
									emit('delete');
								}, 200);
							}

							input.value!.files = new DataTransfer().files;
							emit('update:modelValue', res.data.filename);
							return emit('change');
						} else {
							return handleError('Error while changing value.');
						}
					} else {
						return handleError(res.statusMessage);
					}
				}
			}
		};

		const handleError = (errText: string | undefined): void => {
			isError.msg = errText;
			isError.open = true;
			emit('error', errText);
		};

		return {
			input,
			active,
			loading,
			refImage,
			isOpen,
			isError,
			callInput,
			onChange,
			deleteImage,
			triggerInput,
			toggleActive,
		};
	},
	watch: {
		async refImage(newVal: string, oldVal: string) {
			this.refImage = this.$props.modelValue;

			if (newVal && oldVal) {
				await this.deleteImage(oldVal, false);
				this.$emit('update:modelValue', newVal);
			}

			if (this.refImage === '') this.callInput = true;
			else this.callInput = false;
		},
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
