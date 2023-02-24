import { ValidRelationships, type Relationship } from '@/types/Relationship';
import type { User } from '@/types/User';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';

export const useRelationshipStore = defineStore('relationship', {
	//  actions == data definitions
	state: () => ({
		relationships: <Relationship[]>[],
		me: {} as User,
		isInitialized: false,
	}),
	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		async initialize() {
			if (this.isInitialized === false) {
				this.isInitialized = false;
				await this.refreshRelationships();
				await this.refreshMe();
			}
		},

		async refreshRelationships() {
			this.relationships = await (
				await getRequest('/me/relationships')
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
				if (this.isMatchingRelationship(userId, rel)) {
					return rel;
				}
			}
			return placeHolderRelationship;
		},

		async initializeRelationship(source: number, target: number) {
			const createRelationship = {
				source,
				target,
				type: 'none',
				specifier_id: source,
			};
			return await (
				await postRequest('user-relationships/', createRelationship)
			).data;
		},

		async getRelationship(source: number, target: number) {
			const existingRel: Relationship = await (
				await getRequest(`user-relationships/${source}/${target}`)
			).data;

			if (!existingRel) {
				return this.initializeRelationship(source, target);
			}
			return existingRel;
		},

		async updateRelationship(userId: number, type: string) {
			const rel: Relationship = await this.getRelationship(
				userId,
				this.me.id,
			);
			const updateRelationshipDto = {
				type,
				specifier_id: this.me.id,
			};

			await patchRequest(
				`user-relationships/${rel.id}`,
				updateRelationshipDto,
			);
			await this.refreshRelationships();
		},

		isFriend(type: string): boolean {
			return type === ValidRelationships.FRIEND;
		},

		isBlocked(type?: string): boolean {
			// console.log("type:" ,type);
			return type === ValidRelationships.BLOCKED;
		},
	},
});
