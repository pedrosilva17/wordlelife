import { useFetch } from 'nuxt/app';
import type { GameState } from '~/interfaces/gamestate';
import type { Wrestler } from '~/interfaces/wrestler';

export default class Game {
	idx: number;
	answer: Wrestler | null;
	guesses: Wrestler[];
	isOver: boolean;
	constructor(state: GameState | undefined = undefined) {
		if (state) {
			this.idx = state.idx;
			this.answer = state.answer;
			this.guesses = state.guesses;
			this.isOver = state.isOver;
		} else {
			this.idx = 1;
			this.answer = null;
			this.guesses = [];
			this.isOver = false;
		}
	}

	async start() {
		await $fetch('/api/wrestlers?action=random').then(
			(data) => (this.answer = JSON.parse(JSON.stringify(data)))
		);
		this.guesses = [];
		this.idx = 1;
		this.isOver = false;
	}

	guess(input: Wrestler) {
		if (!this.answer) return input;
		console.log('Guess: ', input.name, this.answer.name);
		this.guesses.unshift(toRaw(input));
		this.isOver = input.name === this.answer.name;
		if (!this.isOver) this.idx++;
		return input;
	}

	save() {
		return {
			idx: this.idx,
			answer: this.answer,
			guesses: this.guesses,
			isOver: this.isOver
		};
	}
}
