<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a chat page</h1>
			<table class="table table-striped table-sm">
				All Chats:
				<tbody>
					<tr v-for="chat in chatStore.allChats" :key="chat.id">
						<td>Game id: {{ chat.id }}</td>
						<td> Chat name: {{ chat.name }}</td>
						<td>Visibility: {{ chat.visibility }}</td>
					</tr>
					
				</tbody>
			</table>
			<table class="table table-striped table-sm">
				My Chats:
				<tbody>
					<tr v-for="chat in chatStore.getMyChats" :key="chat.id">
						<td>Game id: {{ chat.id }}</td>
						<td> Chat name: {{ chat.name }}</td>
						<td>Visibility: {{ chat.visibility }}</td>
					</tr>
					
				</tbody>
				
			</table>
		</div>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING CHAT STORE SETUP-->
<script lang="ts">
import { useChatStore } from '@/stores/chatStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: "ChatView",

	setup(){
		const chatStore = useChatStore();
		
		chatStore.refreshData();
		return {
			chatStore,
		}
	}
})
</script>