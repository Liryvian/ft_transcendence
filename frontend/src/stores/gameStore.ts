import type { Game, gameStates } from '@/types/game.fe';
import GameStatusEnum from '@/types/game.fe';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';

export interface MovementKeys {
	ArrowUp: boolean;
	ArrowDown: boolean;
	w: boolean;
	s: boolean;
}

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		// socket: {} as Socket,
		isInitialized: false,
		isPressed: {
			ArrowUp: false,
			ArrowDown: false,
			w: false,
			s: false,
		} as MovementKeys,
		gameLoopInterval: 0,
		timeStampStart: 0,
		previousTimeStamp: 0,
		score_player_two: 0,
		score_player_one: 0,
		playerOneIsInGame: false,
		playerTwoIsInGame: false,
		gameStatus: GameStatusEnum.PLAYING,
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async initialize() {
			if (this.isInitialized) {
				return;
			}
			this.isInitialized = true;
			await this.refreshAllGames();
		},

		async refreshAllGames() {
			try {
				this.allGames = await (await getRequest('games')).data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},
	},
});
