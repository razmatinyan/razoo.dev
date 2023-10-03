export default defineNuxtPlugin((nuxt) => {
	nuxt.vueApp.directive('click-outside', {
		mounted(el, binding, vnode) {
			el.clickOutside = function (event: Event) {
				if (!(el === event.target || el.contains(event.target))) {
					binding.value(event, el);
				}
			};
			document.body.addEventListener('click', el.clickOutside);
		},
		unmounted(el) {
			document.body.removeEventListener('click', el.clickOutside);
		},
	});
});
