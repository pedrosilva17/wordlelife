<script setup lang="ts">
import type { Wrestler } from '~/interfaces/wrestler';
import Game from '~/assets/game/game';
import LabelButton from '~/components/common/LabelButton.vue';
const { data: options } = await useFetch('/api/wrestlers');
let nameList = options.value
	?.map((wrestler: Wrestler) => wrestler.name)
	.sort((a: string, b: string) => {
		return a.replaceAll(/[^a-zA-Z]/g, '') > b.replaceAll(/[^a-zA-Z]/g, '');
	});
const game = new Game();
await game.start();
const state = reactive({
	input: undefined
});

const disable = ref(false);
const endGameModal = ref(false);
const guesses: Ref<Wrestler[]> = ref([]);

function giveUp() {
	if (!game.answer) return;
	disable.value = true;
	state.input = undefined;
	guesses.value.push(game.guess(game.answer, true));
	console.log(game.save());
	setTimeout(() => {
		if (game.isOver) endGameModal.value = true;
	}, 2500);
}

async function newGame() {
	guesses.value = [];
	disable.value = false;
	nameList = options.value
		?.map((wrestler: Wrestler) => wrestler.name)
		.sort((a: string, b: string) => {
			return a.replaceAll(/[^a-zA-Z]/g, '') > b.replaceAll(/[^a-zA-Z]/g, '');
		});
	await game.start();
}

function onSubmit() {
	const guess = options.value?.find((wrestler: Wrestler) => wrestler.name === state.input);
	if (!game.answer) return;
	state.input = undefined;
	guesses.value.push(game.guess(guess));
	nameList = nameList.filter((name: string) => name !== guess.name);
	disable.value = game.isOver;
	console.log(game.save());
	setTimeout(() => {
		if (game.isOver) endGameModal.value = true;
	}, 2500);
}
</script>

<template>
	<Layout>
		<UForm
			ref="form"
			:state="state"
			@submit="onSubmit"
			class="flex flex-col space-y-4 w-full h-full items-center justify-center"
		>
			<GameGuessTable v-if="game.answer" :guesses="guesses" :answer="game.answer" />
			<!--Passing single and double quotes as a prop is a nightmare. I hate this.-->
			<CommonModal
				v-model="endGameModal"
				:title="game.victory ? '&quot Yeah!&quot'.replace(' ', '') : '&quot...Really?&quot'"
				title-classes="italic"
			>
				<p>
					Game over, you {{ game.victory ? 'won' : 'lost' }}! Try again by exiting this
					modal and clicking the "New Game" button.
				</p>
			</CommonModal>
			<div class="flex flex-col w-64 gap-3 justify-center">
				<GameInput
					v-model="state.input"
					:options="nameList"
					:disabled="disable"
					class="w-full mx-auto"
				/>
				<LabelButton
					type="submit"
					size="xl"
					:disable-cond="disable"
					class="bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
				>
					Submit
				</LabelButton>
				<LabelButton
					size="xl"
					default-color="gray"
					@click="giveUp"
					:disable-cond="disable"
					:class="`${sizeMap['xl']} bg-gray-400 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:ring-gray-600 dark:focus-visible:ring-gray-300`"
				>
					Give up
				</LabelButton>
				<LabelButton
					v-if="disable"
					size="xl"
					@click="newGame"
					:class="`${sizeMap['xl']} bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300`"
				>
					New Game
				</LabelButton>
			</div>
		</UForm>
	</Layout>
</template>
