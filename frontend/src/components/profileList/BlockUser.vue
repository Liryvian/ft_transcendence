<template>
	<div v-if="isBlocked && relationship.specifier_id === me.id">
		<a href="#" class="grayedOut"> Unblock </a>
	</div>
	<div v-else-if="isBlocked">
		<a
			href="#"
			v-on:click.prevent="
				updateRelationship(userId, ValidRelationships.NONE)
			"
		>
			Unblock
		</a>
	</div>
	<div v-else>
		<a
			href="#"
			v-on:click.prevent="
				updateRelationship(userId, ValidRelationships.BLOCKED)
			"
		>
			Block
		</a>
	</div>
</template>

<script lang="ts">
import { useRelationshipStore } from '@/stores/relationshipStore';
import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { storeToRefs } from 'pinia';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
	name: 'BlockUser',
	setup() {
		const relationshipStore = useRelationshipStore();
		const { updateRelationship } = relationshipStore;
		const { me } = storeToRefs(relationshipStore);

		return {
			updateRelationship,
			ValidRelationships,
			me,
		};
	},

	props: {
		isBlocked: {
			type: Boolean,
			required: true,
		},
		userId: {
			type: Number,
			required: true,
		},
		relationship: {
			type: Object as PropType<Relationship>,
			required: true,
		},
	},
});
</script>

