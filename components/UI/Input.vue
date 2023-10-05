<template>
	<input
		:type="type"
		:placeholder="placeholder"
		:value="modelValue"
		@input="$emit('update:modelValue', ($event as InputEvent).target.value)"
		class="ui ui-input"
	/>
</template>

<script setup lang="ts">
import type { InputType, InputEvent } from '@/types/form.d';

defineProps<InputType>();
defineEmits(['update:modelValue']);
</script>
