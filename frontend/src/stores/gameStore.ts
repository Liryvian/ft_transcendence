import type { CreateGameForm, Game, gameStates } from '@/types/game.fe';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import router from '@/router';

export const useGameStore = defineStore('games', {
	//  actions == data definitions
	state: () => ({
		allGames: <Game[]>[],
		errors: [] as String[],
	}),
	// getters == computed values
	getters: {
		// getMyGames: () => useUserStore().getMe.games,
		getAllGames: (state) => state.allGames,
	},
	// actions == methods
	actions: {
		handleFormError(responseData: any) {
			if (typeof responseData.message === 'string') {
				this.errors.length = 0;
				this.errors.push(responseData.message);
			} else {
				this.errors = responseData.message.map((msg: String) =>
					msg.replace('(o) => o.', ''),
				);
			}
		},

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

		async createGame(createdGameForm: CreateGameForm) {
			try {
				createdGameForm.player_one = useUserStore().me.id;
				this.errors.length = 0;
				const newGame = await postRequest('games', createdGameForm);
				// await router.push('/games'); //the router push is for later, I can imagine you want to return to your current chat @vvissche?
				router.push({
					name: 'game',
					params: { profile_id: newGame.data.id },
				});
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
