import { ValidRelationships, type Relationship } from '@/types/Relationship';
import type { User } from '@/types/User';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { io, type Socket } from 'socket.io-client';
import { useUserStore } from './userStore';

export const useRelationshipStore = defineStore('relationship', {
	//  actions == data definitions
	state: () => ({
		relationships: <Relationship[]>[],
		// me: {} as User,
		isInitialized: false,
		socket: {} as Socket,
	}),
	// getters == computed values
	getters: {
		myId: () => {
			return useUserStore().me.id;
		},
	},
	// actions == methods
	actions: {
		async initialize() {
			if (this.isInitialized) {
				return;
			}

			this.socket = io('http://localhost:8080/user/relationship', {
				withCredentials: true,
			});
			this.isInitialized = true;
			// await this.refreshMe();
			await this.refreshRelationships();
		},

		async refreshRelationships() {
			this.relationships = await (
				await getRequest('me/relationships')
			).data;
		},

		isMatchingRelationship(userId: number, rel: Relationship): boolean {
			// const myId: number = useUserStore().me.id;
			const sourceId: number = rel.source;
			const targetId: number = rel.target;

			return (
				(targetId === this.myId || sourceId === this.myId) &&
				(sourceId === userId || targetId === userId)
			);
		},

		// If a user doesn't yet have an existing relationship with
		// a a specified user, return a placeHolderRelationship
		getSingleRelationship(userId: number) {
			const placeHolderRelationship: Relationship = {
				id: -1,
				source: this.myId,
				target: userId,
				type: 'none',
				specifier_id: this.myId,
			};

			// check if the relationship already exists
			for (let i = 0; i < this.relationships.length; i++) {
				const rel: Relationship = this.relationships[i];
				if (this.isMatchingRelationship(userId, rel)) {
					return rel;
				}
			}
			return placeHolderRelationship;
		},

		async initializeRelationship(
			source: number,
			target: number,
			type: string,
		) {
			const createRelationship = {
				source,
				target,
				type,
				specifier_id: source,
			};
			return await postRequest('user-relationships/', createRelationship);
		},

		async updateExistingRelationship(
			relationshipId: number,
			sourceId: number,
			type: string,
		) {
			const updateRelationshipDto = {
				type,
				specifier_id: sourceId,
			};
			console.log('setting specifierId to me: ', sourceId === this.myId);
			await patchRequest(
				`user-relationships/${relationshipId}`,
				updateRelationshipDto,
			);
		},

		// check if relationship already exists
		// else initialize it with specific type required
		async updateRelationship(targetId: number, type: string) {
			const sourceId: number = this.myId;
			const existingRelationship: Relationship = await (
				await getRequest(`user-relationships/${sourceId}/${targetId}`)
			).data;
			let updatedRelId: number = 0;

			if (existingRelationship) {
				this.updateExistingRelationship(
					existingRelationship.id,
					sourceId,
					type,
				);
				updatedRelId = existingRelationship.id;
			} else {
				updatedRelId = await (
					await this.initializeRelationship(sourceId, targetId, type)
				).data.id;
			}
			const relation = {
				source: sourceId,
				target: targetId,
				id: updatedRelId,
			};
			this.socket.emit('updateRelationship', relation);
		},

		isFriend(type: string): boolean {
			return type === ValidRelationships.FRIEND;
		},

		isBlocked(type?: string): boolean {
			return type === ValidRelationships.BLOCKED;
		},

		joinRoomOnConnect(relationship: Relationship) {
			const relation = {
				source: relationship.source,
				target: relationship.target,
				id: relationship.id,
			};
			this.socket.emit('joinRoom', relation);
			this.socket.on('updateHasHappened', () => {
				this.refreshRelationships();
			});
		},
	},
});
