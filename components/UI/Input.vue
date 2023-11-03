<template>
	<input
		:type="type"
		:placeholder="placeholder"
		:value="modelValue"
		v-bind="$attrs"
		ref="input"
		class="ui ui-input"
		@input="onInput"
	/>
</template>

<script setup lang="ts">
import type { InputType } from '~/types/form.d';

defineProps<InputType>();
const emit = defineEmits(['update:modelValue']);

const input = ref<HTMLInputElement | null>(null);
const onInput = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>
