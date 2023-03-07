import type { CreateGameForm, Game, UpdateGameState } from '@/types/game.fe';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import type { NewMessage } from '@/types/Chat';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import GameStatusEnum from '@/types/game.fe';

export interface MovementKeys {
	w: boolean;
	s: boolean;
}
export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		isInitialized: false,
		isPressed: {
			w: false,
			s: false,
		} as MovementKeys,
		gameLoopInterval: 0,
		timeStampStart: 0,
		previousTimeStamp: 0,
		score_player_two: 0,
		score_player_one: 0,
		gameStatus: GameStatusEnum.PLAYING,
	}),

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
