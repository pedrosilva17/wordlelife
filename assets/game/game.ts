import type { GameState } from '~/interfaces/gamestate';
import type { Wrestler } from '~/interfaces/wrestler';

export default class Game {
	idx: number;
	answer: Wrestler | null;
	guesses: Wrestler[];
	isOver: boolean;
	victory: boolean;
	constructor(state: GameState | undefined = undefined) {
		if (state) {
			this.idx = state.idx;
			this.answer = state.answer;
			this.guesses = state.guesses;
			this.isOver = state.isOver;
			this.victory = state.victory;
		} else {
			this.idx = 1;
			this.answer = null;
			this.guesses = [];
			this.isOver = false;
			this.victory = false;
		}
	}

	async start() {
		const answer = await $fetch<Wrestler>('/api/wrestlers?action=random');
		this.answer = answer;
		this.guesses = [];
		this.idx = 1;
		this.isOver = false;
		this.victory = false;
	}

	guess(input: Wrestler, isForfeit: boolean = false) {
		if (!this.answer) return input;
		this.guesses.push(toRaw(input));
		this.isOver = input.name === this.answer.name;
		if (!this.isOver) this.idx++;
		else this.victory = !isForfeit;
		return input;
	}

	save() {
		return {
			idx: this.idx,
			answer: this.answer,
			guesses: this.guesses,
			isOver: this.isOver,
			victory: this.victory
		};
	}
}
