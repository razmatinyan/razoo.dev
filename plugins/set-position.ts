export default defineNuxtPlugin((nuxt) => {
	nuxt.vueApp.directive('set-position', {
		mounted(el, binding, vnode) {
			// TODO: Write function which will calculate the position of element using getBoundingClientRect() and will change its position if needed. Apply these function for element mounting and window resize/scrolling.
		},
	});
});
