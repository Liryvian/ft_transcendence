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
		me: {} as User,
		isInitialized: false,
		socket: {} as Socket,
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async initialize() {
			if (this.isInitialized === false) {
				try {
						this.isInitialized = true;
						this.socket = io('http://localhost:8080/user/relationship');
						await this.refreshRelationships();
				} catch (e) {
					this.isInitialized = false;
				}

			}
		},

		async refreshRelationships() {
			this.relationships = await (
				await getRequest('me/relationships')
			).data;
			useUserStore().refreshMe();
		},

		isMatchingRelationship(userId: number, rel: Relationship): boolean {
			const myId: number = useUserStore().me.id;
			const sourceId: number = rel.source;
			const targetId: number = rel.target;

			return (
				(targetId === myId || sourceId === myId) &&
				(sourceId === userId || targetId === userId)
			);
		},

		// If a user doesn't yet have an existing relationship with
		// a a specified user, return a placeHolderRelationship
		getSingleRelationship(userId: number) {
			const placeHolderRelationship: Relationship = {
				id: -1,
				source: useUserStore().me.id,
				target: userId,
				type: 'none',
				specifier_id: useUserStore().me.id,
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
			await patchRequest(
				`user-relationships/${relationshipId}`,
				updateRelationshipDto,
			);
		},

		// check if relationship already exists
		// else initialize it with specific type required
		async updateRelationship(targetId: number, type: string) {
			const sourceId: number = useUserStore().me.id;
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
				const rel: Relationship = await (
					await this.initializeRelationship(sourceId, targetId, type)).data;
				updatedRelId = rel.id;
				this.joinRoomOnConnect(rel);
			}
			const relation = {
				source: sourceId,
				target: targetId,
				id: updatedRelId,
			};
			console.log("emitting rel; ", relation)
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

			console.log("Connection socket");
			this.socket.connect();
			this.socket.on('connect', async () => {
				if (relationship.id > 0) {
					console.log("Cennection socket");
					this.socket.emit('joinRoom', relation);
				}
			});
			this.socket.on('updateHasHappened', () => {
				this.refreshRelationships();
				console.log("Refreshing me");
				useUserStore().refreshMe()
			});
		},

		disconnectSocket() {
			this.socket.disconnect();
		},
	},
});
