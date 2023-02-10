<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profile page</h1>
			<h1>{{getId.id}}</h1>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({	
	name: 'ProfileView',
	computed: {
		getId: function () {
			return { id: this.$route.params.id };
		}
	},


})
</script>