<script setup lang="ts">
import type { Wrestler } from '~/interfaces/wrestler';
import type { GameOption } from '@/interfaces/gameoption';
import { isGameStarted } from '@/utils/utils';
import Game from '~/assets/game/game';
import type { Reactive } from 'vue';
const { data: options } = await useFetch('/api/wrestlers');

let optionList: GameOption[] = getOptionsList();

// we need to use a unique key to force the input menu to re-render. This is a workaround for the fact that after submitting a guess and opening the
// dropdown (without typing), options shown do not reflect the post-submition removal of the guess.
const inputKey = ref(0);
const guessTable = ref<{ scrollToBottom: () => void } | null>(null);
const modalTimeout = ref<NodeJS.Timeout | null>(null);

function clearModalTimeout() {
	if (modalTimeout.value) {
		clearTimeout(modalTimeout.value);
		modalTimeout.value = null;
	}
}

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

function search(q: string) {
	q = q.toLowerCase();
	return optionList.filter(
		(opt: GameOption) => opt.name.toLowerCase().includes(q) || opt.icon.includes(q)
	);
}

function giveUp() {
	inputKey.value = 1 - inputKey.value;
	if (!game.answer) return;
	state.input = { name: '', icon: '' };
	game.guess(game.answer, true);
	nextTick(() => {
		guessTable.value?.scrollToBottom();
	});

	clearModalTimeout();
	modalTimeout.value = setTimeout(() => {
		endGameModal.value = true;
	}, 2500);
}

async function newGame() {
	clearModalTimeout();
	inputKey.value = 1 - inputKey.value;
	optionList = getOptionsList();
	await game.start();
	isGameStarted.value = false;
}

function onSubmit() {
	const guess = options.value?.find((wrestler: Wrestler) => wrestler.name === state.input.name);
	if (!game.answer) return;

	if (!isGameStarted.value) {
		isGameStarted.value = true;
	}

	optionList = optionList.filter((option: GameOption) => option.name !== state.input.name);
	state.input = { name: '', icon: '' };
	game.guess(guess);
	inputKey.value = 1 - inputKey.value;
	nextTick(() => {
		guessTable.value?.scrollToBottom();
	});

	clearModalTimeout();
	modalTimeout.value = setTimeout(() => {
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
			<GameGuessTable
				v-if="game.answer"
				ref="guessTable"
				:guesses="game.guesses"
				:answer="game.answer"
			/>
			<CommonModal
				v-model="endGameModal"
				:title="game.victory ? 'Yeah!' : '...really?'"
				title-classes="italic"
				:img-path="game.victory ? '/images/laknight.png' : '/images/miz.png'"
			>
				<p>
					Game over, you {{ game.victory ? 'won' : 'lost' }}! Try again by exiting this
					modal and clicking the "New Game" button.
				</p>
			</CommonModal>
			<div class="flex flex-col w-64 gap-3 justify-center">
				<UInputMenu
					:key="inputKey"
					v-model="state.input"
					color="primary"
					variant="outline"
					placeholder="Choose a wrestler!"
					:options="optionList"
					option-attribute="name"
					:search="search"
					:search-attributes="['name', 'icon']"
					:debounce="200"
					:disabled="game.isOver"
					trailing
					required
					class="w-full mx-auto"
				>
					<template #option="{ option: wrestler }">
						<span class="flex flex-row gap-2">
							<UIcon
								v-if="wrestler.icon === 'indy'"
								aria="Indy wrestler"
								name="i-mdi-briefcase"
								class="text-black-50 dark:text-white-50 w-8 h-5"
							/>
							<NuxtImg
								v-else
								:src="`/images/${wrestler.icon}.png`"
								:alt="`${wrestler.icon} company logo`"
								class="object-cover w-8 h-5"
							/>
							<p class="flex my-auto items-center">
								{{ wrestler.name }}
							</p>
						</span>
					</template>
				</UInputMenu>
				<CommonLabelButton
					type="submit"
					size="xl"
					:disable-cond="game.isOver"
					class="bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300"
				>
					Submit
				</CommonLabelButton>
				<CommonLabelButton
					size="xl"
					default-color="gray"
					@click="giveUp"
					:disable-cond="game.isOver"
					:class="`${sizeMap['xl']} bg-gray-400 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:ring-gray-600 dark:focus-visible:ring-gray-300`"
				>
					Give up
				</CommonLabelButton>
				<CommonLabelButton
					v-if="game.isOver"
					size="xl"
					@click="newGame"
					:class="`${sizeMap['xl']} bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300`"
				>
					New Game
				</CommonLabelButton>
			</div>
		</UForm>
	</Layout>
</template>
