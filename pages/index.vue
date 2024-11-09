<script setup lang="ts"></script>

<template>
	<Layout>
		<CommonLogo class="text-6xl md:text-8xl" />
		<div class="flex flex-col gap-3 my-10 items-center w-full">
			<MenuSelection route="/endless" img-path="/images/gts.png">
				<template #header> Endless Mode </template>
				<template #body>
					Infinite lives, infinite games. Play as much as you want!
				</template>
			</MenuSelection>
		</div>
	</Layout>
</template>
