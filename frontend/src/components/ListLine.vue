<template>
<div>
        <div class="c_media">
	    	<a href="#" class="c_media__asset" :class="{ 'c_asset--online': true, 'c_asset--offline': false, }">
	    		<div class="c_asset__circle">
	    			<img src="profile_picture" alt="" />
	    		</div>
	    	</a>
	    </div>
	    <a href="#">username</a>
	    <a href="#">Chat</a>
	    <a href="#">Add Friend</a>
	    <a href="#">Block</a>
</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import HorizontalAvatarAndUserName from "@/components/user-info/HorizontalAvatarAndUserName.vue"
import type { User } from '@/types/User';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
    name: "ListLine",

    setup() {
        const userStore = useUserStore()
        userStore.refreshData();

        return {
            userStore,
        }
    },
  
    components: {
		HorizontalAvatarAndUserName
    },

    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        },
        online: Boolean
    },
    methods: {
        createChat(user: User | undefined) {
            if (user) {
                console.log(`Starting chat with ${user.name}`);
            }
            else {
                console.log("No User")
            }
        }
    }
})
</script>