<template>
	<transition
		name="modal"
		@before-enter="useScrollbarPadding('stop')"
		@after-leave="useScrollbarPadding('start')"
	>
		<div v-show="isOpen" :id="id" class="dialog">
			<div class="overlay" @click="(e) => !preventClose && close(false)"></div>
			<div
				class="modal"
				:style="{
					'max-width': width + 'px',
				}"
				@click.stop
			>
				<div class="modal-header">
					<h2 class="modal-title">{{ title }}</h2>
				</div>

				<div class="modal-content">
					<div class="content" v-if="$slots.content">
						<slot name="content"></slot>
					</div>
					<div class="buttons" v-if="$slots.buttons">
						<slot name="buttons"></slot>
					</div>
				</div>

				<div class="close" @click="close(false)">
					<Icon name="heroicons:x-mark-20-solid" />
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
export default defineComponent({
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},
		id: {
			type: String,
			default: () => `dialog-${useId()}`,
		},
		title: {
			type: String,
			default: 'Information',
		},
		width: {
			type: Number,
			default: 600,
		},
		overlay: {
			type: Boolean,
			default: true,
		},
		preventClose: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'close'],
	setup(props, { emit }) {
		const { $locomotive } = useNuxtApp();
		const isOpen = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit('update:modelValue', value);
			},
		});
		const showContent = ref<boolean>(false);

		const close = (value: boolean): void => {
			isOpen.value = value;
			emit('close');
		};

		const useScrollbarPadding = (action: string): void => {
			if (action === 'stop') {
				$locomotive.stop();
				document.documentElement.style.overflow = 'hidden';
				document.documentElement.style.paddingRight = '8px';
			} else if (action === 'start') {
				document.documentElement.style.overflow = 'auto';
				document.documentElement.style.paddingRight = '0px';
				$locomotive.start();
			}
		};

		return {
			isOpen,
			showContent,
			close,
			useScrollbarPadding,
		};
	},
});
</script>

<style scoped>
.dialog {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 0 20px;
	z-index: 1001;
}
.overlay {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 1;
}
.modal {
	position: relative;
	width: 100%;
	background-color: var(--input-bg);
	border-radius: 10px;
	box-shadow: 0 0 16px 4px rgba(0, 0, 0, 0.1);
	z-index: 2;
}
.modal-header {
	display: flex;
	align-items: center;
	padding: 15px 30px;
	box-shadow: rgba(255, 255, 255, 0.1) 0 1px;
}
.modal-header > .modal-title {
	margin-bottom: 0;
	font-size: 18px;
	text-align: center;
}
.modal-content {
	padding: 30px;
	overflow-y: auto;
	font-size: 1rem;
}
.modal-content > .buttons {
	display: flex;
	align-items: center;
	margin-top: 30px;
}
.close {
	position: absolute;
	top: 10px;
	right: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	width: 28px;
	height: 28px;
	border-radius: 5px;
	background: transparent;
	transition: background var(--smooth);
}
.close:hover {
	background: rgba(255, 255, 255, 0.1);
}
.close > .icon {
	--icon-size: 0.7em;
	width: var(--icon-size);
	height: var(--icon-size);
}
.modal-enter-active {
	transition: all 300ms ease-out;
}
.modal-enter-from {
	opacity: 0;
	transform: scale(0.95);
}
.modal-enter-to {
	opacity: 1;
	transform: scale(1);
}
.modal-leave-active {
	transition: all 200ms ease-in;
}
.modal-leave-from {
	opacity: 1;
	transform: scale(1);
}
.modal-leave-to {
	opacity: 0;
	transform: scale(0.95);
}

@media only screen and (max-width: 480px) {
	.modal-header > .modal-title {
		font-size: 16px;
		text-align: left;
	}
}
</style>
