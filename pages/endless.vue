<script setup lang="ts">
import type { Wrestler } from '~/interfaces/wrestler';
import Game from '~/assets/game/game';
const { data: options } = await useFetch('/api/wrestlers');
let nameList = options.value
	?.map((wrestler: Wrestler) => wrestler.name)
	.sort((a: string, b: string) => {
		return a.replaceAll(/[^a-zA-Z]/g, '') > b.replaceAll(/[^a-zA-Z]/g, '');
	});
const game = new Game();
await game.start();
let lastChosen = ref();
const state = reactive({
	input: undefined
});

const disable = ref(game.isOver);
const guesses: Ref<Wrestler[]> = ref([]);

function giveUp() {
	if (!game.answer) return;
	disable.value = true;
	state.input = undefined;
	guesses.value.push(game.guess(game.answer));
	console.log(game.save());
}

async function newGame() {
	guesses.value = [];
	disable.value = false;
	await game.start();
}

function onSubmit() {
	lastChosen.value = options.value?.find((wrestler: Wrestler) => wrestler.name === state.input);
	state.input = undefined;
	guesses.value.push(game.guess(lastChosen.value));
	nameList = nameList.filter((name: string) => name !== lastChosen.value.name);
	console.log(game.save());
}
</script>

<template>
	<Layout>
		<UForm
			ref="form"
			:state="state"
			@submit="onSubmit"
			class="flex flex-col space-y-4 h-full items-center justify-center"
		>
			<GameGuessTable v-if="game.answer" :guesses="guesses" :answer="game.answer" />
			<div class="flex flex-col w-64 gap-3 justify-center">
				<GameInput
					v-model="state.input"
					:options="nameList"
					:disabled="disable"
					class="w-full mx-auto"
				/>
				<UButton
					type="submit"
					:disabled="disable"
					block
					class="justify-center bg-primary-500 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-600 text-gray-700 dark:text-gray-50 focus-visible:ring-2 focus-visible:outline-0 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-400"
				>
					Submit
				</UButton>
				<UButton
					color="gray"
					@click="giveUp"
					:disabled="disable"
					block
					class="justify-center focus-visible:ring-gray-50 dark:focus-visible:ring-gray-500"
				>
					Give up
				</UButton>
				<UButton
					v-if="disable"
					@click="newGame"
					block
					class="justify-center bg-primary-500 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-600 text-gray-700 dark:text-gray-50 focus-visible:ring-2 focus-visible:outline-0 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-400"
				>
					New Game
				</UButton>
			</div>
		</UForm>
	</Layout>
</template>
