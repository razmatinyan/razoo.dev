<template>
	<label class="checkbox-wrapper">
		<input
			:id="id"
			:name="name"
			:required="required"
			:value="value"
			:disabled="disabled"
			:checked="checked"
			v-model="toggle"
			v-bind="$attrs"
			type="checkbox"
			class="ui-checkbox"
			@change="onChange"
		/>
		<span class="checkbox-label">{{ label }}</span>
	</label>
</template>

<script lang="ts">
export default defineComponent({
	inheritAttrs: false,
	props: {
		id: {
			type: String,
			default: String(Date.now()),
		},
		value: {
			type: [String, Number, Boolean, Object],
			default: null,
		},
		modelValue: {
			type: [Boolean, Array],
			default: null,
		},
		name: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		checked: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: null,
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue', 'change'],
	setup(props, { emit }) {
		const { name } = props;

		const toggle = computed({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit('update:modelValue', value);
			},
		});

		const onChange = (event: Event) => {
			emit('change', event);
		};

		return {
			name,
			toggle,
			onChange,
		};
	},
});
</script>

<style scoped>
.checkbox-wrapper {
	display: flex;
	align-items: center;
	cursor: pointer;
}
.ui-checkbox {
	appearance: none;
	width: 1rem;
	height: 1rem;
	background-color: var(--input-bg);
	border: 1px solid rgb(51 65 85);
	border-radius: 0.25rem;
	cursor: pointer;
}
.ui-checkbox:checked {
	border-color: transparent;
	background-color: var(--primary);
	background-position: 50%;
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z'/%3E%3C/svg%3E");
}
.checkbox-label {
	display: block;
	margin-left: 10px;
	font-size: 1rem;
	user-select: none;
}
</style>
