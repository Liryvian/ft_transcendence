import GameStatusEnum from '@/types/game.fe';
import type { CreateGameForm, Game, gameStates } from '@/types/game.fe';
import type { NewMessage } from '@/types/Chat';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { useUserStore } from './userStore';
import router from '@/router';
import { defineStore } from 'pinia';

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

		async createGame(
			createdGameForm: CreateGameForm,
			newMessage: NewMessage,
		) {
			try {
				this.errors.length = 0;
				if (
					/^#[a-fA-F0-9]{6}$/.test(
						createdGameForm.background_color,
					) === false
				) {
					this.errors.push('Not a valid color');
					return;
				}
				createdGameForm.player_one = useUserStore().me.id;
				const newGame = await postRequest('games', createdGameForm);
				newMessage.sender_id = useUserStore().me.id;
				newMessage.content =
					'<a href="/games/${newGame.id}">wanna play PONG?</a>';
				const message = await postRequest('messages', newMessage);
				await router.push('/game'); //the router push is for later, I can imagine you want to return to your current chat @vvissche?
				// });
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
