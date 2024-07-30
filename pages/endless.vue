<script setup lang="ts">
import type { Wrestler } from '~/interfaces/wrestler';
import type { GameOption } from '@/interfaces/gameoption';
import Game from '~/assets/game/game';
import LabelButton from '~/components/common/LabelButton.vue';
import type { Reactive } from 'vue';
const { data: options } = await useFetch('/api/wrestlers');

let optionList: GameOption[] = getOptionsList();

const { game } = reactive({
	game: new Game()
});

await game.start();
const state: Reactive<{ input: GameOption }> = reactive({
	input: { name: '', icon: '' }
});

const endGameModal = ref(false);

function getOptionsList() {
	return options.value
		?.map((wrestler: Wrestler) => {
			return { name: wrestler.name, icon: wrestler.promotion.toLowerCase() };
		})
		.sort((a: GameOption, b: GameOption) => {
			return a.name.replaceAll(/[^a-zA-Z]/g, '') > b.name.replaceAll(/[^a-zA-Z]/g, '');
		});
}

function giveUp() {
	if (!game.answer) return;
	state.input = { name: '', icon: '' };
	game.guess(game.answer, true);
	setTimeout(() => {
		endGameModal.value = true;
	}, 2500);
}

async function newGame() {
	optionList = getOptionsList();
	await game.start();
}

function onSubmit() {
	const guess = options.value?.find((wrestler: Wrestler) => wrestler.name === state.input.name);
	if (!game.answer) return;
	state.input = { name: '', icon: '' };
	game.guess(guess);
	optionList = optionList.filter((option: GameOption) => option.name !== guess.name);
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
			<GameGuessTable v-if="game.answer" :guesses="game.guesses" :answer="game.answer" />
			<CommonModal
				v-model="endGameModal"
				:title="game.victory ? 'Yeah!' : '...really?'"
				title-classes="italic"
				:img-path="game.victory ? '/images/laknight.webp' : '/images/miz.avif'"
			>
				<p>
					Game over, you {{ game.victory ? 'won' : 'lost' }}! Try again by exiting this
					modal and clicking the "New Game" button.
				</p>
			</CommonModal>
			<div class="flex flex-col w-64 gap-3 justify-center">
				<GameInput
					v-model="state.input"
					:options="optionList"
					:disabled="game.isOver"
					class="w-full mx-auto"
				/>
				<LabelButton
					type="submit"
					size="xl"
					:disable-cond="game.isOver"
					class="bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
				>
					Submit
				</LabelButton>
				<LabelButton
					size="xl"
					default-color="gray"
					@click="giveUp"
					:disable-cond="game.isOver"
					:class="`${sizeMap['xl']} bg-gray-400 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:ring-gray-600 dark:focus-visible:ring-gray-300`"
				>
					Give up
				</LabelButton>
				<LabelButton
					v-if="game.isOver"
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
