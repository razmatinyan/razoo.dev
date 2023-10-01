export default defineNuxtPlugin((nuxt) => {
	nuxt.vueApp.directive('click-outside', {
		mounted(el, binding, vnode) {
			el.clickOutsideEvent = function (event: Event) {
				if (!(el === event.target || el.contains(event.target))) {
					binding.value(event, el);
				}
			};
			document.body.addEventListener('click', el.clickOutsideEvent);
		},
		unmounted(el) {
			document.body.removeEventListener('click', el.clickOutsideEvent);
		},
	});
});
