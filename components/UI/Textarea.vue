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
import type { TextareaType, InputEvent } from '@/types/form.d';

defineProps<TextareaType>();
defineEmits(['update:modelValue']);
</script>
