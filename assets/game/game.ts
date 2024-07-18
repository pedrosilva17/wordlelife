import { useFetch } from "nuxt/app";
import type { GameState } from "~/interfaces/gamestate";

export default class Game {
    idx: number;
    answer: string | undefined;
    guesses: string[];
    isOver: boolean;
    constructor(state: GameState | undefined = undefined) {
        if (state) {
            this.idx = state.idx;
            this.answer = state.answer;
            this.guesses = state.guesses;
            this.isOver = state.isOver;
        }
        else {
            this.idx = 1;
            this.answer = "";
            this.guesses = [];
            this.isOver = false;
        }
    }

    async start() {
        await useFetch('/api/wrestlers?action=random').then((response) => this.answer = response.data.value.name)
        this.guesses = [];
        this.idx = 1;
        this.isOver = false;
    }

    guess(input: string) {
        console.log("Guess: ", input, this.answer);
        this.guesses.push(input);
        this.isOver = input === this.answer;
        if (!this.isOver) this.idx++;
        return this.isOver;
    }

    save() {
		return {
            idx: this.idx,
            answer: this.answer,
            guesses: this.guesses,
            isOver: this.isOver
        }
	}
}
