<template>
	<button
		class="ui-btn"
		:class="btnType"
		:type="type"
		:disabled="disabled"
		v-bind="$attrs"
		@click="onClick"
	>
		<slot />
	</button>
</template>

<script lang="ts">
type ButtonTypes = 'button' | 'submit' | 'reset';

export default defineComponent({
	inheritAttrs: false,
	props: {
		btnType: {
			type: String,
		},
		type: {
			type: String as PropType<ButtonTypes>,
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
	border-radius: 0.5rem;
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
.half-height {
	height: 2.5rem;
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

.red {
	background: var(--red);
}
.red:hover {
	background: var(--red-hover);
}
.border {
	border: 1px solid rgb(51 65 85);
	background: var(--input-bg);
}
.border:hover {
	border-color: rgb(98 122 157);
	background: var(--input-bg);
}
</style>
