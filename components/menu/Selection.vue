<script setup lang="ts">
const { route, imgPath } = defineProps({
	route: {
		type: String,
		required: true
	},
	imgPath: {
		type: String,
		required: true
	}
});
</script>

<template>
	<ULink
		:to="route"
		class="group relative flex rounded-md w-64 h-64 md:w-2/6 gap-5 justify-center transition ease-in-out hover:scale-105 focus:scale-105 bg-primary-500 hover:bg-primary-400 dark:hover:bg-primary-600 rounded-md"
	>
		<NuxtImg
			preload
			:src="imgPath"
			alt="Wrestling action shot"
			sizes="300px md:500px"
			class="opacity-30 object-cover object-top blur-[2px] group-hover:blur-none group-hover:animate-pulse group-focus:blur-none group-focus:animate-pulse absolute m-auto w-full h-full right-0 left-0 justify-center rounded-md"
		/>
		<div class="absolute flex top-0 w-full h-full p-5 items-center">
			<section class="flex flex-col flex-1 gap-3">
				<h2 class="text-4xl font-bold font-oswald">
					<slot name="header" />
				</h2>
				<p class="flex w-full my-auto text-xl justify-center items-center">
					<slot name="body" />
				</p>
			</section>
		</div>
	</ULink>
</template>
