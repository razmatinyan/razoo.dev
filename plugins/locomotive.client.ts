import LocomotiveScroll from 'locomotive-scroll';

export default defineNuxtPlugin(() => {
	return {
		provide: {
			locomotive: new LocomotiveScroll(),
		},
	};
});
