<template>
	<div id="noise"></div>
	<div id="cursor" ref="cursor">
		<div class="cursor"></div>
	</div>

	<NuxtLayout :name="layout">
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import '../locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

const route = useRoute();
const layout = computed(() => (route.path.includes('admin') ? 'admin' : 'default'));

onMounted(() => {
	gsap.config({
		nullTargetWarn: false,
	});
});

// const nuxtApp = useNuxtApp();
// const loading = ref(false);
// nuxtApp.hook('page:start', () => {
// 	loading.value = true;
// });
// nuxtApp.hook('page:finish', () => {
// 	loading.value = false;
// });

const cursor: Ref = ref<HTMLDivElement | null>(null);
const speed: number = 5;
let posX: number = 0;
let posY: number = 0;
let mouseX: number = 0;
let mouseY: number = 0;

const mouseMoveHandler = (e: MouseEvent): void => {
	mouseX = e.clientX;
	mouseY = e.clientY;
};

const mouseEnterHandler = (e: MouseEvent): void => {
	cursor.value.classList.remove('hide');
};

const mouseLeaveHandler = (e: MouseEvent): void => {
	cursor.value.classList.add('hide');
};

onMounted(() => {
	if (!window.ontouchstart && navigator.maxTouchPoints === 0) {
		document.addEventListener('mouseenter', mouseEnterHandler);
		document.addEventListener('mouseleave', mouseLeaveHandler);
		window.addEventListener('mousemove', mouseMoveHandler);

		gsap.to(
			{},
			{
				duration: 0.01,
				repeat: -1,
				onRepeat: function () {
					posX += (mouseX - posX) / speed;
					posY += (mouseY - posY) / speed;
					gsap.set(cursor.value, {
						css: {
							left: posX,
							top: posY,
						},
					});
				},
			}
		);
	}
});

onBeforeUnmount(() => {
	if (!window.ontouchstart && navigator.maxTouchPoints === 0) {
		document.removeEventListener('mouseenter', mouseEnterHandler);
		document.removeEventListener('mouseleave', mouseLeaveHandler);
		window.removeEventListener('mousemove', mouseMoveHandler);
	}
});
</script>

<style scoped>
#noise {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	opacity: 8%;
	background-image: url(/images/noise.png);
	background-repeat: repeat;
	z-index: 9997;
	user-select: none;
	pointer-events: none;
}
#cursor {
	--size: 0.9rem;
	position: fixed;
	top: -999px;
	left: -999px;
	width: var(--size);
	height: var(--size);
	border-radius: 100%;
	transform: translate(-50%, -50%) scale(1);
	z-index: 9999;
	user-select: none;
	pointer-events: none;
	overflow: hidden;
	will-change: transform;
	transition: transform 0.2s ease;
	mix-blend-mode: difference;
}
html.dragging #cursor,
#cursor.hide {
	transform: translate(-50%, -50%) scale(0);
}
#cursor.hidden {
	display: none;
}
#cursor > .cursor {
	width: 100%;
	height: 100%;
	background: #fff;
	opacity: 1;
}
</style>
