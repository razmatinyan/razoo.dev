<template>
    <h1 class="section-title center">Admin Panel</h1>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth'],
    layout: "admin",
});
</script>
