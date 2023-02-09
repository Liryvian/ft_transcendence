<template>
    <div v-if="isBlocked(userId) === true">
       <a href="#" v-on:click.prevent="updateRelationship(userId, ValidRelationships.NONE)" >Unblock</a>
   </div>
   <div v-else>
       <a href="#" v-on:click.prevent="updateRelationship(userId, ValidRelationships.BLOCKED)" >Block</a>
   </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ValidRelationships } from '@/types/Relationship';
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'BlockUser',
   setup (){
       const { isBlocked, updateRelationship} = useUserStore();
       
       return {
           isBlocked,
           updateRelationship,
           ValidRelationships
       }
   },

   props: {
       userId: {
           type: Number,
           required: true
       },            
   },
});
</script>

<style>
.grayedOut {
   color: grey;
}
</style>