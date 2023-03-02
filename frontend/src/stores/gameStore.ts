import { gameStates, type Game } from '@/types/game.fe';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async refreshAllGames() {
			try {
				this.allGames = await (await getRequest('games')).data;
				console.log(this.allGames);
				await useUserStore().refreshAllUsers();
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshData() {
			await this.refreshAllGames();
		},
	},
});
