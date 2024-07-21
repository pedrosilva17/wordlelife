<script setup lang="ts"></script>

<template>
	<Layout>
		<h1 class="text-md md:text-4xl">Welcome to Word(le) Life!</h1>
		<div class="flex flex-col gap-3 my-10 justify-center w-64">
			<UButton
				to="/endless"
				block
				class="justify-center bg-primary-500 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-600 text-gray-700 dark:text-gray-50 focus-visible:ring-2 focus-visible:outline-0 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-400"
				>Endless Mode</UButton
			>
		</div>
	</Layout>
</template>
