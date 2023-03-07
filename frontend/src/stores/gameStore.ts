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

	// getters == computed values
	getters: {
		// getMyGames: () => useUserStore().getMe.games,
		getAllGames: (state) => state.allGames,
	},

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

		async refreshData() {
			await this.refreshAllGames();
		},

		async updateGame(updateGameState: UpdateGameState) {
			try {
				await patchRequest('games', updateGameState);
				// await router.push('/chat'); //the router push is for later, I can imagine you want to return to your current chat @vvissche?
				// await router.push({
				// 	name: 'chat',
				// 	params: { profile_id: createdGameForm.player_two},
				// });
				// this.errors.length = 0;
			} catch (e: any) {
				console.log('ERROR');
				// this.handleFormError(e.response.data);
			}
		},
	},
});
