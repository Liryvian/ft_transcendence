<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>Profiles</h1>
			<div class="c_profileslist__table">
				<template v-for="user in allUsers">
					<ListRow
						v-if="user.id !== me.id"
						:user="user"
						:relationship="getCurRel(user.id)"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, onMounted, ref } from 'vue';
import ListRow from '@/components/profileList/ListRow.vue';
import type { User } from '@/types/User';
import router from '@/router';
import { storeToRefs } from 'pinia';
import type { Relationship } from '@/types/Relationship';

let curRel = ref({} as Relationship)
export default defineComponent({
	name: 'ProfileList',
	components: {
		ListRow,
	},
	setup() {
		const userStore = useUserStore();
		const { refreshData, isBlocked, getCurrentRel, initializeRelationship } = userStore;
		const { me, allUsers } = storeToRefs(userStore);
		onMounted(async () => {
			await refreshData();
		});

		return {
			userStore,
			refreshData,
			allUsers,
			isBlocked,
			getCurrentRel,
			me,
			curRel,
			initializeRelationship
		};
	},

	methods: {
		routeToProfile(id: number) {
			router.push(`/ProfileView/${id}`);
		},
		createChat(user: User) {
			console.log(`Starting chat with ${user.name}`);
		},

		async getCurRel(userId: number) {
			console.log("curRel: ", this.getCurrentRel(userId))
			const existingRel = this.getCurrentRel(userId);
			if (existingRel === undefined)
				return await this.initializeRelationship(useUserStore().me.id, userId);
			return existingRel;
			
		},
	},
});
</script>

<style>
.avatar {
	vertical-align: middle;
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.grayedOut {
	color: grey;
}
</style>
