<template>
	<textarea
		:placeholder="placeholder"
		:value="modelValue"
		:rows="5"
		@input="$emit('update:modelValue', ($event as InputEvent).target.value)"
		class="ui ui-textarea"
	/>
</template>

<script setup lang="ts">
interface TextareaType {
	rows?: number;
	modelValue?: string;
	placeholder?: string;
}

interface InputEvent extends Event {
	target: HTMLInputElement;
}

defineProps<TextareaType>();
defineEmits(['update:modelValue']);
</script>
