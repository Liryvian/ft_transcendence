<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>Profiles</h1>
			<div class="c_profileslist__table">
				<template v-for="user in allUsers">
					<ListRow
						v-if="user.id !== me.id"
						:user="user"
						:relationship="getSingleRelationship(user.id)"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useRelationshipStore } from '@/stores/relationshipStore';
import { defineComponent } from 'vue';
import ListRow from '@/components/profileList/ListRow.vue';
import { storeToRefs } from 'pinia';

export default defineComponent({
	name: 'ProfilesView',
	components: {
		ListRow,
	},
	setup() {
		const relationshipStore = useRelationshipStore();
		const { getSingleRelationship } = relationshipStore;
		relationshipStore.initialize();

		const userStore = useUserStore();
		const { me, allUsers } = storeToRefs(userStore);
		userStore.initialize();

		return {
			getSingleRelationship,
			userStore,
			allUsers,
			me,
		};
	},
});
</script>
