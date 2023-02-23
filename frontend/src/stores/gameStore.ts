import type { Game, RequestGameForm } from '@/types/game.fe';
import type { User } from '@/types/User';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import router from '@/router';

export const useGameStore = defineStore("games", {
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

		// async createGame(id: number, requestGameForm: RequestGameForm) {
		// 	try {
		// 		// if (updateProfileForm.new_password === '') {
		// 		// 	delete updateProfileForm.new_password;
		// 		// 	delete updateProfileForm.new_password_confirm;
		// 		// 	delete updateProfileForm.password;
		// 		// }
		// 		// await patchRequest(`users/${id}`, gameRequestForm);
		// 		// await this.refreshData();
		// 		this.errors.length = 0;
		// 		// await router.push({name: 'profile', params: {profile_id: id}});
		// 	} catch (e: any) {
		// 		this.handleFormError(e);
		// 		return [];
		// 	}
		// },
	}

})
