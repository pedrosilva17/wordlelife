import { ref, reactive } from 'vue';
import type { Wrestler } from '~/interfaces/wrestler';
import type { GameOption } from '@/interfaces/gameoption';
import { isGameStarted } from '@/utils/utils';
import Game from '@/assets/game/game';

export function useGame() {
	const { data: options } = useFetch('/api/wrestlers');
	const game = reactive(new Game());
	const endGameModal = ref(false);
	const modalTimeout = ref<NodeJS.Timeout | null>(null);

	const loadGameState = async () => {
		await game.start();
		if (import.meta.client) {
			const savedState = localStorage.getItem('gameState');
			if (savedState) {
				const { guesses, answer, isOver, victory } = JSON.parse(savedState);
				game.guesses = guesses;
				game.answer = answer;
				game.isOver = isOver;
				game.victory = victory;
				if (game.isOver) {
					endGameModal.value = true;
				}
			}
		}
	};

	const saveGameState = () => {
		if (import.meta.client) {
			const gameState = {
				guesses: game.guesses,
				answer: game.answer,
				isOver: game.isOver,
				victory: game.victory
			};
			localStorage.setItem('gameState', JSON.stringify(gameState));
		}
	};

	function clearModalTimeout() {
		if (modalTimeout.value) {
			clearTimeout(modalTimeout.value);
			modalTimeout.value = null;
		}
	}

	function getOptionsList() {
		return options.value
			?.map((wrestler: Wrestler) => {
				return { name: wrestler.name, icon: wrestler.promotion.toLowerCase() };
			})
			.sort((a: GameOption, b: GameOption) => {
				return a.name.replaceAll(/[^a-zA-Z]/g, '') > b.name.replaceAll(/[^a-zA-Z]/g, '');
			});
	}

	async function submitGuess(
		isGiveUp: boolean,
		state: { input: GameOption },
		optionList: GameOption[],
		onGuess: () => void
	) {
		if (!game.answer) return optionList;

		clearModalTimeout();
		const wrestlerToGuess = isGiveUp
			? game.answer
			: options.value?.find((wrestler: Wrestler) => wrestler.name === state.input.name);

		isGameStarted.value = true;

		if (!isGiveUp) {
			optionList = optionList.filter(
				(option: GameOption) => option.name !== state.input.name
			);
		}

		state.input = { name: '', icon: '' };
		game.guess(wrestlerToGuess, isGiveUp);
		onGuess();

		saveGameState();

		modalTimeout.value = setTimeout(() => {
			if (isGiveUp || game.isOver) endGameModal.value = true;
		}, 2500);

		return optionList;
	}

	async function newGame(optionList: GameOption[]) {
		clearModalTimeout();
		optionList = getOptionsList();
		await game.start();
		isGameStarted.value = false;

		if (import.meta.client) {
			localStorage.removeItem('gameState');
		}
		return optionList;
	}

	return {
		game,
		endGameModal,
		modalTimeout,
		getOptionsList,
		submitGuess,
		newGame,
		clearModalTimeout,
		loadGameState
	};
}
