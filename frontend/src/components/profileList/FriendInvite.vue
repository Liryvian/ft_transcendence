<template>
	<div v-if="!isFriend && !isBlocked">
		<a
			href="#"
			v-on:click.prevent="
				updateRelationship(userId, ValidRelationships.FRIEND)
			"
			>Add Friend</a
		>
	</div>
	<div v-else-if="isFriend && !isBlocked">
		<a
			href="#"
			v-on:click.prevent="
				updateRelationship(userId, ValidRelationships.NONE)
			"
			>Remove Friend</a
		>
	</div>
	<div v-else>
		<a href="#" class="grayedOut">Add Friend</a>
	</div>
</template>

<script lang="ts">
import { useRelationshipStore } from '@/stores/relationshipStore';
import { ValidRelationships } from '@/types/Relationship';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'FriendInvite',

	setup() {
		const { updateRelationship } = useRelationshipStore();

		return {
			updateRelationship,
			ValidRelationships,
		};
	},

	props: {
		userId: {
			type: Number,
			required: true,
		},
		isBlocked: {
			type: Boolean,
			required: true,
		},
		isFriend: {
			type: Boolean,
			required: true,
		},
	},
});
</script>
