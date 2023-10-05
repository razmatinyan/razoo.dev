import { toValue, onMounted, watchEffect } from 'vue';
import type { Sizes, PositionerOptions } from '../types/positioner.d';

type BoundingOptions<B = boolean, N = number> = {
	top: B;
	bottom: B;
	left?: B;
	right?: B;
	any?: B;
	all?: B;
	width: N;
	height: N;
};

/**
 * Check if an element is out of viewport and get its sizes
 * @param {HTMLElement} elem element that function will be applied
 * @return {BoundingOptions} Information about element is out of viewport, and elements width and height
 */
const getPositionsAndViewport = (el: HTMLElement): BoundingOptions => {
	// Get element's bounding
	const bounding = el.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	const options = {} as BoundingOptions;
	options.top = bounding.top < 0;
	options.bottom =
		bounding.bottom + 20 > (window.innerHeight || document.documentElement.clientHeight);
	options.left = bounding.left < 0;
	options.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	options.any = options.top || options.left || options.bottom || options.right;
	options.all = options.top && options.left && options.bottom && options.right;
	options.width = bounding.width;
	options.height = bounding.height;

	return options;
};

/* Set CSS variable on element */
const setDistance = (el: HTMLElement, value: number): void => {
	el.style.setProperty('--distance', `${value}px`);
};

const setPosition = (el: HTMLElement, arg: string | undefined, value: Sizes): void => {
	const values: Sizes = {
		top: value.top,
		bottom: value.bottom,
	};

	if (arg === 'dropdown') {
		const { top, bottom, height } = getPositionsAndViewport(el);

		if (bottom) {
			setDistance(el, -Math.abs(values.bottom));
			el.style.top = `calc(-${Math.round(height)}px + var(--distance))`;
		}

		if (top) {
			setDistance(el, values.top);
			el.style.top = `var(--distance)`;
		}

		if (!top && !bottom) {
			setDistance(el, values.top);
			el.style.top = `var(--distance)`;
		}
	}
};

export function usePositioner({
	el,
	type = 'dropdown',
	sizes = {
		top: 60,
		bottom: 20,
	},
}: PositionerOptions) {
	onMounted(() => {
		watchEffect(() => {
			const element = toValue(el);
			if (element !== null) {
				setPosition(element, type, sizes);
			}
		});
	});
}
