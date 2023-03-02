import { gameStates, type Game, updateGameState, UpdateGameState } from '@/types/game.fe';
import type { User } from '@/types/User';
import { getRequest, patchRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
	}),
	// getters == computed values
	getters: {
		// getMyGames: () => useUserStore().getMe.games,
		getAllGames: (state) => state.allGames,
	},
	// actions == methods
	actions: {
		async refreshAllGames() {
			try {
				const data = await getRequest('games');
				this.allGames = data.data;
				await useUserStore().refreshAllUsers();
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshMyGames() {
			await useUserStore().refreshMe();
		},

		async refreshData() {
			await this.refreshMyGames();
			await this.refreshAllGames();
		},

		async updateGame(updateGameState: UpdateGameState){
			try {
				await patchRequest('games', updateGameState);
				// await router.push('/chat'); //the router push is for later, I can imagine you want to return to your current chat @vvissche?
				// await router.push({
				// 	name: 'chat',
				// 	params: { profile_id: createdGameForm.player_two},
				// });
				// this.errors.length = 0;
			} catch (e: any) {
				console.log("ERROR");
				// this.handleFormError(e.response.data);
			}
		},

	},
});
