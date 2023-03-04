<template>
    <Avatar
			:avatar="avatarString"
			:is-online="userStore.getOnlineStatus(userId)"
			v-on:click="routeToProfile(Number(userId))"
		/>
    <div>
        {{ userName }}
    </div>
    <div>
        Kick
    </div>
    <div>
        Mute
    </div>
    <div>
        Ban
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import Avatar from "@/components/profileList/Avatar.vue"
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

export default defineComponent({
    name:  "ChannelMemberRow",
    props: {
        userId: {
            type: String,
            required: true
        },
        userName: String,
        avatarString: String,
    },
    components: {
        Avatar,
    },
    setup(){
        const userStore = useUserStore();
        userStore.refreshData();
        return {
            userStore
        }
    },
    methods: {
        async routeToProfile(userId: number) {
			await router.push({
				name: 'profile',
				params: { profile_id: userId },
			});
		},
    }
    

})
</script>