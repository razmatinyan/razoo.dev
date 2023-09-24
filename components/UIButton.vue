<template>
	<button class="btn">
		<slot />
	</button>
</template>

<style scoped>
.btn {
	position: relative;
	overflow: hidden;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 3rem;
	padding: 0 3rem;
	font-size: 1.1rem;
	border: 0;
	border-radius: .2rem;
	background: var(--primary);
	color: var(--white);
	outline: none;
	transition: var(--smooth);
}
.btn:hover {
	background: var(--primary-hover);
}

.corner {
	border-radius: 0.7rem;
}
.full-corner {
	border-radius: 5rem;
}
</style>

<script setup>

</script>
