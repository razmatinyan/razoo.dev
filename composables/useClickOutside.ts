import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Creats the click outside event, when the user is clicking out the {el} element, and applies function to that event 
 * @param el element to which will be applied composable
 * @param callback function to run, when the user will click outside of {el} 
 * @returns {void}
 */
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
