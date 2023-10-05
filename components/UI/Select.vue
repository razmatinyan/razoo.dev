<template>
	<div class="select" v-click-outside="clickOutside">
		<div
			class="ui ui-select"
			@click="showOptions = !showOptions"
			:class="{ opened: showOptions }"
		>
			<div class="label" :class="{ placeholderText: !selected }">
				{{ !selected ? placeholder : selected }}
			</div>
			<Icon class="sel-icon" name="heroicons:chevron-down-20-solid" color="white" />
		</div>
		<transition name="scale" appear>
			<div ref="dropdown" class="options" v-if="showOptions">
				<span
					v-for="option in options"
					:key="option"
					class="option"
					:class="{ selected: selected === option }"
					@click="selectOption(option)"
				>
					{{ option }}
					<Icon
						v-if="selected === option"
						name="heroicons:check-20-solid"
						color="white"
						size="1.1rem"
					/>
				</span>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
interface SelectProps {
	options: string[];
	placeholder?: string | number;
	selected?: string | number | null;
}

const emit = defineEmits<{
	select: [option: string];
}>();

defineProps<SelectProps>();

const showOptions: Ref = ref<boolean>(false);
const dropdown: Ref = ref<HTMLElement | null>(null);
usePositioner({ el: dropdown });

function selectOption(option: string): void {
	emit('select', option);
	showOptions.value = false;
}

function clickOutside() {
	if (showOptions.value === true) {
		showOptions.value = false;
	}
}
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
	transition: 100ms ease;
}
.scale-enter-from,
.scale-leave-to {
	opacity: 0;
	transform: scale(0.99);
}

.select {
	position: relative;
}
.ui-select > .label {
	display: flex;
	align-items: center;
	height: 100%;
}

.ui-select > .label.placeholderText {
	color: #767676;
}
.ui-select > .sel-icon {
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translate(0, -50%);
}
.select .options {
	position: absolute;
	width: 100%;
	max-height: 400px;
	z-index: 1;
	font-size: 1rem;
	background: var(--input-bg);
	padding: 10px;
	border-radius: 10px;
	box-shadow: var(--border-shadow);
	overflow-y: auto;
}
.select .options .option {
	display: block;
	transition: var(--smooth);
	cursor: pointer;
	margin-bottom: 4px;
	padding: 10px;
	border-radius: 8px;
}
.select .options .option:last-child {
	margin-bottom: 0;
}
.select .options .option.selected {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--primary-soft);
	color: var(--blue);
}
.select .options .option:hover {
	background: var(--primary-soft);
}
.select .options .option.selected:hover {
	background: var(--primary-soft);
}
</style>
