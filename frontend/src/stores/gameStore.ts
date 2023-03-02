import type { Game } from '@/types/game.fe';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { io, type Socket } from 'socket.io-client';
import { useUserStore } from './userStore';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		socket: {} as Socket,
		isInitialized: false,
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async initialize() {
			await this.refreshAllGames().then(() => {
				this.isInitialized = true;
				this.socket = io('http://localhost:8080/pong', {
					withCredentials: true,
				});
			});
			console.log('Game are initialized: ', this.isInitialized);
			// if (this.isInitialized) {
			// 	return ;
			// }
		},

		async refreshAllGames() {
			try {
				this.allGames = await (await getRequest('games')).data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		// turnOnSocketListeners() {
		// 	this.socket.on('elementPositions', this.render);
		// 	this.socket.on(
		// 		'pointOver',
		// 		(scores: { scorePlayerOne: number; scorePlayerTwo: number }) => {
		// 			this.gameStatus = GameStatusEnum.POINT_OVER;
		// 			score_player_one.value = scores.scorePlayerOne;
		// 			score_player_two.value = scores.scorePlayerTwo;
		// 		},
		// 	);
		// 	this.socket.on('gameOver', () => {
		// 		router.push({ name: 'activeGames' });
		// 	});
		// }
	},
});
