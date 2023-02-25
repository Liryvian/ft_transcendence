import type { CreateGameForm, Game, RequestGameForm } from '@/types/game.fe';
import type { User } from '@/types/User';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import router from '@/router';

export const useGameStore = defineStore("games", {
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
				const data = await getRequest("games");
				this.allGames = data.data;
				await useUserStore().refreshAllUsers();
			}
			catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshMyGames() {
			await useUserStore().refreshMe()
		},

		async refreshData() {
			await this.refreshMyGames();
			await this.refreshAllGames();
		},

		isAvailable(): boolean {
			const me: User = useUserStore().getMe;
			// if (!me.isOnline)
				// retunr false;
			me.games.forEach((game: Game) => {
				if (game.is_active === true)
					return false;
			})

			return true;
		},

		async createGame(createdGameForm: CreateGameForm){
			try{
				console.log(createdGameForm)
				await postRequest('games', createdGameForm);
				await router.push({
					name: 'chat',
					// params: { profile_id: createdGameForm.player_two},
				});
				console.log("GEEN ERROR HIER! 1")
				// this.errors.length = 0;
				} catch (e: any) {
				console.log("ERROR", e)
					// this.handleFormError(e);
					return [];
				}
		}
	}

});
