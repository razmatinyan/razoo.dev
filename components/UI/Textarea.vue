<template>
	<textarea
		:placeholder="placeholder"
		:value="modelValue"
		:rows="5"
		v-bind="$attrs"
		ref="input"
		class="ui ui-textarea"
		@input="onInput"
	/>
</template>

<script setup lang="ts">
import type { TextareaType } from '@/types/form.d';

defineProps<TextareaType>();
const emit = defineEmits(['update:modelValue']);

const input = ref<HTMLInputElement | null>(null);
const onInput = (event: Event) => {
	emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>
