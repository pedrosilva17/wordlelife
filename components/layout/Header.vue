<script setup lang="ts">
const isHelpOpen = ref(false);
const isSettingsOpen = ref(false);
function changeUnits() {
	return (imperialUnits.value = !imperialUnits.value);
}
</script>

<template>
	<nav class="flex flex-row w-full justify-center py-3 px-3 md:px-10 gap-20 font-oswald text-4xl">
		<a href="/" class="flex">
			<span class="text-primary-500">Word</span>le<span class="text-primary-500">Life</span>
		</a>
		<div class="flex gap-2">
			<CommonIconButton
				v-model="isHelpOpen"
				aria="Help"
				icon-name="i-mdi-help-circle"
				size="md"
			/>
			<CommonModal title="Help" v-model="isHelpOpen">
				<p>
					This is a Wordle-like game similar to many others out there, but now you're
					trying to guess wrestlers. The database is not very big, so if you're a seasoned
					fan you might figure out the answers quickly.
				</p>
				<p>
					Every time you choose a wrestler, you get some hints about how close your guess
					is from the target. There are 8 different categories:
				</p>
				<div class="grid grid-cols-4 gap-y-3 font-bold text-center text-sm">
					<p>Name</p>
					<p>Gender</p>
					<p>Age</p>
					<p>Birthplace</p>
					<p>Billed from</p>
					<p>Height</p>
					<p>Weight</p>
					<p>Promotion</p>
				</div>
				<p>
					Each category gives you information about how close you are to the answer's
					corresponding category.<br />
					A red cell means you're far from the answer, a yellow cell indicates you're
					close and a green cell shows that the category matches the answer. I you
					hover/tap on each cell, you can get more clues about how close/far you are from
					the answer.
				</p>
				<p>
					Pay attention to the arrows on the top-right of each cell: Each one tells you
					how the answer's value is different from your guess in that category.<br />
					For example, an arrow pointing down in the name category means the answer is
					further down the alphabet compared to your guess, while an arrow pointing to the
					top-right in the birthplace category means that the answer's hometown is
					geographically situated above and to the right of your guess.
				</p>
			</CommonModal>
			<CommonIconButton
				@func="changeUnits"
				aria="Settings"
				icon-name="i-mdi-cog"
				size="md"
				type="function"
			/>
		</div>
	</nav>
</template>
