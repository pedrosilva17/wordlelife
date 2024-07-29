<script setup lang="ts">
const isHelpOpen = ref(false);
const isSettingsOpen = ref(false);
const modes = ['system', 'light', 'dark'];
const colorMode = useColorMode();
const colorIndexCookie = useCookie<number>('colorIndexCookie');
colorIndexCookie.value = colorIndexCookie.value || 0;

function changeUnits() {
	return (imperialUnits.value = !imperialUnits.value);
}
function cycleColorMode() {
	colorIndexCookie.value = (colorIndexCookie.value + 1) % 3;
	colorMode.preference = modes[colorIndexCookie.value];
	console.log(colorMode.preference);
}
</script>

<template>
	<nav class="flex flex-row w-full justify-center py-3 px-3 md:px-10 gap-20 text-4xl">
		<CommonLogo />
		<div class="flex gap-2">
			<CommonIconButton
				@click="isHelpOpen = true"
				aria="Help"
				icon-name="i-mdi-help-circle"
				size="md"
				class="text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
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
				@click="isSettingsOpen = true"
				aria="Settings"
				icon-name="i-mdi-cog"
				size="md"
				class="text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
			/>
			<CommonModal title="Settings" v-model="isSettingsOpen">
				<section class="flex flex-row justify-between gap-10">
					<h2 class="flex text-xl font-bold py-1">Unit system</h2>
					<span class="flex flex-row justify-end">
						<CommonLabelButton
							@click="changeUnits"
							size="md"
							class="bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
						>
							{{ imperialUnits ? 'Imperial' : 'Metric' }}
						</CommonLabelButton>
					</span>
				</section>
				<section class="flex flex-row justify-between gap-10">
					<h2 class="flex text-xl font-bold py-1">Dark mode</h2>
					<span class="relative flex flex-1 flex-row justify-end">
						<Transition name="fade">
							<CommonIconButton
								v-if="colorIndexCookie === 0"
								aria="Toggle Color Mode - System"
								title="System"
								icon-name="i-mdi-laptop"
								@click="cycleColorMode"
								size="md"
								class="absolute right-0 text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
							/>
							<CommonIconButton
								v-else-if="colorIndexCookie === 1"
								aria="Toggle Color Mode - Light"
								title="Light"
								icon-name="i-mdi-white-balance-sunny"
								@click="cycleColorMode"
								size="md"
								class="absolute right-0 text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
							/>
							<CommonIconButton
								v-else="colorIndexCookie === 2"
								aria="Toggle Color Mode - Dark"
								title="Dark"
								icon-name="i-mdi-moon-waning-crescent"
								@click="cycleColorMode"
								size="md"
								class="absolute right-0 text-primary-500 dark:text-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
							/>
						</Transition>
					</span>
				</section>
			</CommonModal>
		</div>
	</nav>
</template>
