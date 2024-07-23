<script setup lang="ts">
let { title } = defineProps({
	title: {
		type: String,
		required: false
	},
	titleClass: {
		type: String,
		required: false
	}
});
const isOpen = defineModel();
</script>
<template>
	<UModal v-model="isOpen">
		<section class="flex flex-col relative p-5">
			<h1
				v-if="title"
				:class="`flex w-full text-3xl font-bold justify-center mb-5 ${titleClass}`"
			>
				{{ title }}
			</h1>
			<div class="flex flex-col flex-1 w-full text-justify gap-5">
				<slot></slot>
			</div>
		</section>
		<CommonIconButton
			v-model="isOpen"
			aria="Close"
			icon-name="i-mdi-close-thick"
			class="absolute top-5 right-5"
		/>
	</UModal>
</template>
