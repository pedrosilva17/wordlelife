<script setup lang="ts">
import type { PropType } from 'vue';

const { iconName, aria, type, func, size, color, hoverColor, darkColor, darkHoverColor } =
	defineProps({
		iconName: {
			type: String,
			required: true
		},
		aria: {
			type: String,
			required: true
		},
		type: {
			type: String as PropType<'toggle' | 'function'>,
			required: false,
			default: 'toggle'
		},
		func: {
			type: Function,
			required: false
		},
		size: {
			type: String as PropType<'2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
			required: false,
			default: 'md'
		},
		color: {
			type: String,
			required: false,
			default: 'text-primary-500'
		},
		hoverColor: {
			type: String,
			required: false,
			default: 'hover:bg-primary-300'
		},
		darkColor: {
			type: String,
			required: false
		},
		darkHoverColor: {
			type: String,
			required: false,
			default: 'dark:hover:bg-primary-900'
		}
	});

const model = defineModel();
</script>
<template>
	<UButton
		@click="type === 'toggle' ? (model = !model) : $emit('func')"
		:aria-label="aria"
		:icon="iconName"
		:size="size"
		square
		variant="ghost"
		:class="`transition ease-in-out duration-300 rounded-md ${color} dark:${darkColor ?? color} ${hoverColor} ${darkHoverColor}`"
	/>
</template>
