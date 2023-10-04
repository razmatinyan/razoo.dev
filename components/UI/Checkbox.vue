<template>
	<label>
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
		<span>{{ label }}</span>
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
