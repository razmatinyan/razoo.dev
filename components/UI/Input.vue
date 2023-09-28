<template>
	<input
        :type="type"
        :required="required"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="ui-input"
    >
</template>

<script setup lang="ts">
interface InputType {
    type: string,
    modelValue?: String,
    required?: string,
    placeholder?: string,
}

defineProps<InputType>();
defineEmits(['update:modelValue']);
</script>

<style scoped>
.ui-input {
    position: relative;
    display: block;
    width: 100%;
    height: 45px;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    padding-left: 0.875rem;
    padding-right: 0.875rem;
    color: var(--white);
    font-size: 1rem;
    background: var(--input-bg);
    border-radius: 10px;
    outline: none;
    border: none;
    --tw-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    box-shadow: inset 0 0 0 1px rgba(55 65 81 / 1);
    transition: var(--smooth);
}
.ui-input:focus {
    box-shadow: 0 0 0 3px var(--primary);
}
</style>