<script setup lang="ts">
import type { GameOption } from '@/interfaces/gameoption';
import type { Reactive } from 'vue';
import { useGame } from '@/assets/game/useGame';

const { game, endGameModal, getOptionsList, submitGuess, newGame, loadGameState } = useGame();
let optionList: GameOption[] = getOptionsList();

const inputKey = ref(0);
const guessTable = ref<{ scrollToBottom: () => void } | null>(null);

const state: Reactive<{ input: GameOption }> = reactive({
	input: { name: '', icon: '' }
});

function search(q: string) {
	if (!optionList) return [];
	q = q.toLowerCase();
	return optionList.filter(
		(opt: GameOption) => opt.name.toLowerCase().includes(q) || opt.icon.includes(q)
	);
}

function onGuess() {
	inputKey.value = 1 - inputKey.value;
	nextTick(() => {
		guessTable.value?.scrollToBottom();
	});
}

const onSubmit = async () => {
	optionList = await submitGuess(false, state, optionList, onGuess);
};

const giveUp = async () => {
	optionList = await submitGuess(true, state, optionList, onGuess);
};

async function handleNewGame() {
	inputKey.value = 1 - inputKey.value;
	optionList = await newGame(optionList);
}

onMounted(() => {
	loadGameState();
});
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
					Game over, you {{ game.victory ? 'won' : 'lost' }}! Try again by clicking the
					"New Game" button.
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
					@click="handleNewGame"
					:class="`${sizeMap['xl']} bg-primary-400 dark:bg-primary-500 hover:bg-primary-300 dark:hover:bg-primary-700 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-300`"
				>
					New Game
				</CommonLabelButton>
			</div>
		</UForm>
	</Layout>
</template>
