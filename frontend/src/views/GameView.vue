<template>
	<div>
		<div class="page_box_wrapper">
			<div class="page_box">
				<h1>This is the list of games view</h1>
				<router-link to="/pong/60">Go to /pong/3</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GameView',
});
</script>

<style>
.gameBlock {
	height: 80%;
	width: 90%;
	display: block;
	margin: auto;
	transform: translateY(5%);
}

.gameHeader {
	font-weight: bolder;
	display: flex;
	/* font size changes on window HEIGHT! */
	font-size: 2.5vh;
	padding-left: 2.5%;
	padding-right: 5%;
	padding-top: 2.4%;
}

.gameHeader.space-between {
	justify-content: space-between;
}
</style>
