<script setup lang="ts">
import type { PropType } from 'vue';

const { type, size, defaultColor } = defineProps({
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
const disableCond = defineModel<boolean>('disableCond');
</script>

<template>
	<UButton
		:color="defaultColor"
		:type="type"
		:disabled="disableCond ?? false"
		:class="`${sizeMap[size]} transition ease-in-out duration-300 justify-center focus-visible:ring-2 focus-visible:outline-0 text-gray-900 dark:text-gray-100`"
	>
		<slot />
	</UButton>
</template>
