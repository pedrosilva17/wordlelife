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

const shown = ref(false);
const guesses: Ref<Wrestler[]> = ref([]);

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
			<div v-if="shown">{{ game.answer?.name }}</div>
			<GameGuessTable v-if="game.answer" :guesses="guesses" :answer="game.answer" />
			<GameInput
				v-model="state.input"
				:options="nameList"
				:disabled="game.isOver"
				class="w-fit mx-auto"
			/>
			<UButton type="submit" :disabled="game.isOver"> Submit </UButton>
			<UButton @click="shown = !shown">
				{{ (shown ? 'Hide' : 'Show') + ' Answer' }}
			</UButton>
		</UForm>
	</Layout>
</template>
