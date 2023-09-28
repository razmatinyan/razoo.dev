export default defineNuxtRouteMiddleware((to) => {
	const user = useSupabaseUser();

	if (!user.value && to.path.includes('/admin')) {
		return navigateTo('/login');
	} else if (user.value && to.path === '/login') {
		return navigateTo('/admin');
	}
});
