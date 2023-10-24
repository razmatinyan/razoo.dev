<template>
	<h1 class="section-title center">Admin Panel</h1>
	<div class="admin-menu">
		<NuxtLink v-for="item of menu" :key="item.text" :to="item.path" class="menu-item">
			<div class="in">
				<div class="icon-wrapper">
					<Icon :name="`heroicons:${item.icon}`" color="white" size="1.5em" />
				</div>
				<h2 class="item-title">{{ item.text }}</h2>
			</div>
		</NuxtLink>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth'],
	layout: 'admin',
});

interface Menu {
	path: string;
	text: string;
	icon?: string;
}

const menu: Menu[] = [
	{
		path: '/admin/work/add',
		text: 'Add',
		icon: 'plus-20-solid',
	},
	{
		path: '/admin/work/edit',
		text: 'Edit',
		icon: 'pencil-square-20-solid',
	},
	{
		path: '/admin/work/order',
		text: 'Order',
		icon: 'arrows-up-down-20-solid',
	},
];
</script>

<style scoped>
.admin-menu {
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 20px;
	max-width: 900px;
	margin: 0 auto;
	padding: 80px 0;
}

.menu-item {
	--card-padding: 24px;
	--radius: 12px;
	--hover-color: hsla(0, 0%, 100%, 0.02);
	display: flex;
	flex-direction: column;
	height: 175px;
	padding: var(--card-padding);
	position: relative;
	overflow: hidden;
	border-radius: var(--radius);
	background: #000;
	border: 1px solid #333;
	transition-property: border-color, background;
	transition-duration: 0.15s;
}

.menu-item:hover {
	background: var(--hover-color);
	border-color: #444;
}

.menu-item > .in {
	display: flex;
	align-items: center;
	flex-direction: column;
	height: 100%;
}

.menu-item > .in > .icon-wrapper {
	flex-grow: 1;
	display: flex;
	align-items: center;
}

.menu-item > .in > .item-title {
	font-size: 1.7rem;
	font-weight: 500;
}
</style>
