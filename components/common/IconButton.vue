<script setup lang="ts">
import type { PropType } from 'vue';

const { iconName, aria, type, size, defaultColor } = defineProps({
	iconName: {
		type: String,
		required: true
	},
	aria: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: false,
		default: 'button'
	},
	size: {
		type: String as PropType<Size>,
		required: false,
		default: 'md'
	},
	defaultColor: {
		type: String as PropType<Color>,
		required: false,
		default: 'primary'
	}
});
</script>
<template>
	<UButton
		:color="defaultColor"
		:type="type"
		:aria-label="aria"
		:icon="iconName"
		:size="size"
		square
		variant="ghost"
		class="transition ease-in-out duration-300 rounded-md"
	/>
</template>
