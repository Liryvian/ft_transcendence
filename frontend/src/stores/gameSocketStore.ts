import type { Game } from '@/types/game.fe';
import { defineStore } from 'pinia';
import { io, type Socket } from 'socket.io-client';

export const useGameSocketStore = defineStore('gameSocket', {
	//  actions == data definitions
	state: () => ({
		isInitialized: false,
		socket: {} as Socket,
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
			(this.socket = io('http://localhost:8080/pong', {
				withCredentials: true,
			})),
				console.log('Game Socket is Initialized:', this.isInitialized);
		},
	},
});
