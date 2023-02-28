import type { Game } from '@/types/game.fe';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		isInitialized: false,
	}),
	// getters == computed values
	getters: {
	},
	// actions == methods
	actions: {
		async refreshAllGames() {
			if (this.isInitialized === false){
				try {
					this.isInitialized = true;
					const data = await getRequest('games');
					this.allGames = data.data;
					await useUserStore().refreshAllUsers();
				} catch (e) {
					this.isInitialized = false;
					console.error(e);
					return [];
				}
			}

		},
		async initialize() {
			if (this.isInitialized === true){
				try {
					this.isInitialized = true;
					await this.refreshAllGames();
				} catch (e) {
					this.isInitialized = false;
				}
			}
		},
	},
});
