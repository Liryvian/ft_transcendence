<template>
     <div v-if="!isFriend && !isBlocked">
        <a href="#" v-on:click.prevent="updateRelationship(userId, ValidRelationships.FRIEND)" >Add Friend</a>
    </div>
    <div v-else-if="isFriend && !isBlocked">
        <a href="#" v-on:click.prevent="updateRelationship(userId,  ValidRelationships.NONE)" >Remove Friend</a>
    </div>
    <div v-else>
        <a href="#" class="grayedOut" >Add Friend</a>
    </div>
</template>

<!-- localhost:8080/api/public/avatars -->

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ValidRelationships } from '@/types/Relationship';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'FriendInvite',
    setup (){
        const { updateRelationship} = useUserStore();
        
        return {
            updateRelationship,
            ValidRelationships
        }
    },

	props: {
        userId: {
            type: Number,
            required: true
        },            
        isBlocked: Boolean,
        isFriend: Boolean,
	},
});
</script>
