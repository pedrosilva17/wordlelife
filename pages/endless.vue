<script setup lang="ts">
import type { Wrestler } from '~/interfaces/wrestler';
import Game from '~/assets/game/game'
const { data: options } = await useFetch('/api/wrestlers');
const name_list = options.value?.map((wrestler: Wrestler) => wrestler.name);

const game = new Game();
game.start();
let lastChosen = ref();
const state = reactive({
    input: ref()
})

const shown = ref(false);
const result = ref(false);

function onSubmit() {
    lastChosen.value = state.input;
    state.input = undefined;
    result.value = game.guess(lastChosen.value);
    console.log(game.save());
}

</script>

<template>
    <Layout>
        <UForm ref="form" :state="state" class="flex flex-col space-y-4 h-full items-center justify-center" @submit="onSubmit">
            <div>{{ `Try number: ${game.idx}` }}</div>
            <div>{{ `Guesses: ${game.guesses.join(", ")}` }}</div>
            <div v-if="shown">{{ game.answer }}</div>
            <div v-if="lastChosen && options">{{ result ? "Correct!" : "Wrong." }}</div>
            <GameInput v-model="state.input" :options="name_list" :disabled="game.isOver" class="w-fit mx-auto" />
            <UButton type="submit" :disabled="game.isOver">
                Submit
            </UButton>
            <UButton @click="shown = !shown">
                {{ (shown ? "Hide" : "Show") + " Answer" }}
            </UButton>
        </UForm>
    </Layout>
</template>