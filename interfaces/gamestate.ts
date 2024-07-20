import type { Wrestler } from './wrestler';

export interface GameState {
	idx: number;
	answer: Wrestler;
	guesses: Wrestler[];
	isOver: boolean;
}
