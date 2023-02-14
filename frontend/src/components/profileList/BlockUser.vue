<template>
    <div v-if="isBlocked && relationshipSourceId !== userId">
       <a href="#" class="grayedOut" > Unblock </a>
   </div>
    <div v-else-if="isBlocked">
       <a
        href="#"
        v-on:click.prevent="updateRelationship(userId, ValidRelationships.NONE)"
        > Unblock </a>
   </div>
   <div v-else>
       <a 
       href="#"
       v-on:click.prevent="updateRelationship(userId, ValidRelationships.BLOCKED)"
       > Block </a>
   </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ValidRelationships } from '@/types/Relationship';
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'BlockUser',
   setup (){
       const {updateRelationship} = useUserStore();
       
       return {
           updateRelationship,
           ValidRelationships
       }
   },

   props: {
       isBlocked: {
           type: Boolean,
           required: true,
       },
       userId: {
           type: Number,
           required: true
       },
       relationshipSourceId: {
			type: Number,
			required: true
		}
   },
});
</script>

<style>
.grayedOut {
   color: grey;
}
</style>