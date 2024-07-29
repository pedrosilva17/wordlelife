<template>
	<LayoutHeader v-if="$route.fullPath !== '/'" />
	<main class="flex flex-col flex-1 p-5 justify-center items-center text-center">
		<slot></slot>
	</main>
	<LayoutFooter />
</template>
