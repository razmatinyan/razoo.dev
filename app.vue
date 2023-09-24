<template>
	<div id="noise"></div>
	<div id="cursor" ref="cursor">
		<div class="cursor"></div>
	</div>

  	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
import '../locomotive-scroll/dist/locomotive-scroll.css';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.config({
  	nullTargetWarn: false,
});

const cursor = ref('');
const speed = 5;
let posX = 0;
let posY = 0;
let mouseX = 0;
let mouseY = 0;

const mouseMoveHandler = (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
}

const mouseEnterHandler = (e) => {
	cursor.value.classList.remove('hide');
}

const mouseLeaveHandler = (e) => {
	cursor.value.classList.add('hide');
}

onMounted(() => {
	const { locomotive } = useNuxtApp();
	
	if (!"ontouchstart" in window || !navigator.msMaxTouchPoints) {
		document.addEventListener('mouseenter', mouseEnterHandler);
		document.addEventListener('mouseleave', mouseLeaveHandler);
		window.addEventListener('mousemove', mouseMoveHandler);

		gsap.to({}, 0.01, {
			repeat: -1,
			onRepeat: function () {
				posX += (mouseX - posX) / speed;
				posY += (mouseY - posY) / speed;
				gsap.set(cursor.value, {
					css: {
						left: posX,
						top: posY
					}
				});
			}
		});
	}
})

onBeforeUnmount(() => {
	if (!"ontouchstart" in window || !navigator.msMaxTouchPoints) {
		document.removeEventListener('mouseenter', mouseEnterHandler);
		document.removeEventListener('mouseleave', mouseLeaveHandler);
		window.removeEventListener('mousemove', mouseMoveHandler);
	}
})
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
    background-image: url(../images/noise.png);
    background-repeat: repeat;
    z-index: 9997;
	user-select: none;
	pointer-events: none;
}
#cursor {
	--size: .9rem;
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
    transition: transform .2s ease;
    mix-blend-mode: difference;
}
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