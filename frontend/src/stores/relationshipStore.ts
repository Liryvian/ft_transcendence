import { ValidRelationships, type Relationship } from '@/types/Relationship';
import type { User } from '@/types/User';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { io, type Socket } from 'socket.io-client';

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
				// for when sockets are setup
				this.isInitialized = false;
				this.socket = io('http://localhost:8080/user/relationship');
				await this.refreshRelationships();
				await this.refreshMe();
			}
		},

		async refreshRelationships() {
			this.relationships = await (
				await getRequest('me/relationships')
			).data;
		},

		async refreshMe() {
			try {
				this.me = await (await getRequest(`me`)).data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		isMatchingRelationship(userId: number, rel: Relationship): boolean {
			const myId: number = this.me.id;
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
				source: this.me.id,
				target: userId,
				type: 'none',
				specifier_id: this.me.id,
			};

			// check if the relationship already exists
			for (let i = 0; i < this.relationships.length; i++) {
				const rel: Relationship = this.relationships[i];
				console.log()
				if (this.isMatchingRelationship(userId, rel)) {
					return rel;
				}
			}
			return placeHolderRelationship;
		},

		async initializeRelationship(source: number, target: number, type: string) {
			const createRelationship = {
				source,
				target,
				type,
				specifier_id: source,
			};
			await postRequest('user-relationships/', createRelationship);
		},

		async updateExistingRelationship(relationshipId: number, sourceId: number,  type: string,) {
			const updateRelationshipDto = {
				type,
				specifier_id: sourceId,
			};
			console.log("setting specifierId to me: ", sourceId === this.me.id);
			await patchRequest(
					`user-relationships/${relationshipId}`,
					updateRelationshipDto,
				);
		},
		// check if relationship already exists
		// else initialize it with specific type required
		async updateRelationship(targetId: number, type: string) {
			const sourceId: number = this.me.id;
			const existingRelationship: Relationship = await (
				await getRequest(`user-relationships/${sourceId}/${targetId}`)
			).data;

			if (existingRelationship) {
				this.updateExistingRelationship(existingRelationship.id, sourceId, type)
			}
			else {
				await this.initializeRelationship(sourceId, targetId, type);
			}
			this.socket.emit("updateRelationship");
			// await this.refreshRelationships();
		},

		isFriend(type: string): boolean {
			return type === ValidRelationships.FRIEND;
		},

		isBlocked(type?: string): boolean {
			return type === ValidRelationships.BLOCKED;
		},

		

		joinRoomOnConnect(relationshipId: number) {
			this.socket.connect()
			this.socket.on("connect", async () => {
				if (relationshipId > 0) {
					console.log("Connecting booooy")
					this.socket.emit("joinRoom", relationshipId)
				}
			})
			this.socket.on("updateHasHappened", () => {
				console.log("refreshing relationships");
				this.refreshRelationships();
			})
		},

		disconnectSocket() {
			this.socket.disconnect();
		}
	},
});
