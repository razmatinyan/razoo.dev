<template>
	<transition name="loader">
		<Loading v-if="loading" />
	</transition>

	<div id="__layout">
		<header id="header">
			<div class="icon-wrapper">
				<NuxtLink to="/admin">
					<Icon name="heroicons:user-circle" color="white" size="1em" />
				</NuxtLink>
			</div>
			<NuxtLink v-for="item of menu" :key="item.text" :to="item.path" class="action">
				{{ item.text }}
				<Icon v-if="item.icon" class="header-icon" :name="item.icon" />
			</NuxtLink>
			<button type="button" @click="logOut" class="action ghosted">Log Out</button>
		</header>

		<div id="content">
			<section id="admin" class="container">
				<slot />
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import '@/assets/admin.css';

interface Menu {
	path: string;
	text: string;
	icon?: string;
}

const menu: Menu[] = [
	{
		path: '/admin',
		text: 'Home',
	},
	{
		path: '/admin/work/add',
		text: 'Add',
	},
	{
		path: '/',
		text: 'Site',
		icon: 'heroicons:arrow-up-right-20-solid',
	},
];
const client = useSupabaseClient();
const user = useSupabaseUser();
const logOut = async (): Promise<void> => {
	await client.auth.signOut();
};
const loading: Ref = ref<boolean>(true);

watchEffect(() => {
	if (!user.value) navigateTo('/login');
});

onMounted(() => {
	loading.value = false;
});
</script>

<style scoped>
#content {
	padding-top: 145px;
	min-height: 100vh;
}

#header {
	position: fixed;
	top: 1rem;
	left: 50%;
	transform: translate3d(-50%, 0, 0);
	width: max-content;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 6px;
	gap: 8px;
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.25);
	z-index: 10;
	user-select: none;
}
.icon {
	display: block;
}
.btn {
	height: 100%;
}
.btn > button {
	height: 100%;
}
.header-icon {
	width: 1rem;
	height: 1rem;
	margin-left: 4px;
}
.action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	background: rgba(255, 255, 255, 0);
	padding: 0 1rem;
	color: #fff;
	font-size: 1rem;
	letter-spacing: 0.95px;
	border-radius: 10px;
	transition: background var(--smooth);
}
.action.ghosted {
	background: rgba(255, 255, 255, 0.1);
}
.action:hover {
	background: rgba(255, 255, 255, 0.2);
}

.loader-enter-from {
	opacity: 0;
	visibility: hidden;
}
.loader-enter-to {
	opacity: 1;
	visibility: visible;
}
.loader-enter-active {
	transition: var(--smooth);
}
.loader-leave-active {
	transition: var(--smooth);
}
.loader-leave-to {
	opacity: 0;
	visibility: hidden;
}
</style>
