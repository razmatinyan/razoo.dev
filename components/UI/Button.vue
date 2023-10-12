<template>
	<button class="ui-btn" v-bind="$attrs" @click="onClick" :class="ui" :disabled="disabled">
		<slot />
	</button>
</template>

<script lang="ts">
export default defineComponent({
	inheritAttrs: false,
	props: {
		ui: {
			type: [Array, String, Object],
		},
		type: {
			type: String,
			default: 'button',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['click'],
	setup(props, { emit }) {
		const onClick = () => {
			emit('click');
		};

		return {
			onClick,
		};
	},
});
</script>

<style scoped>
.ui-btn {
	position: relative;
	overflow: hidden;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 3rem;
	padding: 0 3rem;
	font-size: 1.1rem;
	letter-spacing: 0.95px;
	border: 0;
	border-radius: 0.2rem;
	background: var(--primary);
	color: var(--white);
	user-select: none;
	outline: none;
	transition: var(--smooth);
}
.ui-btn:hover {
	background: var(--primary-hover);
}
.full-width {
	width: 100%;
}

.corner {
	border-radius: 0.7rem;
}
.full-corner {
	border-radius: 5rem;
}
[disabled] {
	background: var(--primary-dark);
	cursor: not-allowed;
}
</style>
