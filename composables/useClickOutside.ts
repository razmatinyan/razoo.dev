import { onBeforeUnmount, onMounted } from 'vue';

export const useClickOutside = (el: Ref, callback: Function): void => {
	if (!el) return;
	const fn = (event: Event): void => {
		if (event.target !== el.value && event.composedPath().includes(el.value)) {
			return;
		}
		if (typeof callback === 'function') {
			callback();
		}
	};

	onMounted(() => {
		document.body.addEventListener('click', fn);
	});
	onBeforeUnmount(() => {
		document.body.removeEventListener('click', fn);
	});
};
