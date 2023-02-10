<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profile page</h1>
			<h1>{{user}}</h1>
		</div>
	</div>
</template>

<script lang="ts">
import { getRequest } from '@/utils/apiRequests';
import { defineComponent } from 'vue';
import type { User }  from '@/types/User';

export default defineComponent({	
	name: 'ProfileView',

	data() {
		return {
			user: {} as User
		}
	},

	computed: {
		getId: function () {
			return { id: this.$route.params.id };
		}
	},
	async created() {
		this.user = (await getRequest(`users/${this.$route.params.id}`)).data
		console.log("Params: ", this.user);
	}


})
</script>