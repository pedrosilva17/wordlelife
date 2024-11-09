<script setup lang="ts">
const { title } = defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	titleClasses: {
		type: String,
		required: false,
		default: ''
	},
	imgPath: {
		type: String,
		required: false,
		default: ''
	}
});
const isOpen = defineModel<boolean>();
</script>
<template>
	<UModal v-model="isOpen" class="my-auto">
		<section class="flex flex-col relative p-5">
			<h1
				v-if="title"
				:class="`flex w-full text-3xl font-bold justify-center mb-5 ${titleClasses}`"
			>
				{{ title }}
			</h1>
			<div class="flex flex-col flex-1 w-full text-justify gap-5">
				<NuxtImg preload :src="imgPath" alt="Modal decorative image" height="300px" />
				<slot />
			</div>
		</section>
		<CommonIconButton
			aria="Close"
			icon-name="i-mdi-close-thick"
			@click="isOpen = false"
			class="absolute top-5 right-5 text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
		/>
	</UModal>
</template>
