<script setup lang="ts">
useHead({
	title: 'WordleLife',
	meta: [
		{
			name: 'description',
			content:
				'A Wordle-like game about guessing wrestlers based on their personal information.'
		}
	]
});
</script>

<template>
	<div
		class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-950 dark:text-gray-50 font-inter"
	>
		<NuxtPage />
	</div>
</template>
