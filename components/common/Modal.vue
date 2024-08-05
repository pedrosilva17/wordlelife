<script setup lang="ts">
let { title } = defineProps({
	title: {
		type: String,
		required: false
	},
	titleClasses: {
		type: String,
		required: false
	},
	imgPath: {
		type: String,
		required: false
	}
});
const isOpen = defineModel();
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
				<NuxtImg
					v-if="imgPath"
					preload
					:src="imgPath"
					alt="Wrestler cutting a promo"
					height="300px"
				/>
				<slot></slot>
			</div>
		</section>
		<CommonIconButton
			@click="isOpen = false"
			aria="Close"
			icon-name="i-mdi-close-thick"
			class="absolute top-5 right-5 text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
		/>
	</UModal>
</template>
