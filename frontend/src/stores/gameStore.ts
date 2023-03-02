import type { Game } from '@/types/game.fe';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
// import { io, type Socket } from 'socket.io-client';
import { useUserStore } from './userStore';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		// socket: {} as Socket,
		isInitialized: false,
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async initialize() {
			if (this.isInitialized) {
				return;
			}
			// useUserStore().refreshData();
			await this.refreshAllGames().then(() => {
				this.isInitialized = true;
				// this.socket = io('http://localhost:8080/pong', {
				// 	withCredentials: true,
				// });
			});
			console.log('Game are initialized: ', this.isInitialized);
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
	},
});
