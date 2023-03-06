<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW CHANNEL</h1>
			<form
				method="Post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="createNewChannel(createNewChannelForm)"
			>
				<InputField
					label="channel owner"
					:modelValue="me.name"
					:is_disabled="true"
				/>
				<InputField
					label="group name"
					v-model="createNewChannelForm.name"
				/>
				<div class="">
					<label for="example_field">add member:</label>
					<template v-for="user in usersWithoutMe">
						<div class="checkbox_overview">
							<input
								v-model="createNewChannelForm.users"
								type="checkbox"
								:id="user.id.toString()"
								name="users"
								:value="user.id"
							/>
							<label :for="user.id.toString()">{{
								user.name
							}}</label>
						</div>
					</template>
				</div>
				<InputField
					label="set password"
					inputType="password"
					v-model="createNewChannelForm.password"
				/>
				<div class="c_field_group c_field_group--radio">
					<RadioButton
						v-model="createNewChannelForm.visibility"
						value="private"
						name="visibility"
						label="private"
						id="r1"
					/>
					<RadioButton
						v-model="createNewChannelForm.visibility"
						value="public"
						name="visibility"
						label="public"
						:checked="true"
						id="r2"
					/>
				</div>
				<div class="page_button pb_bottom">
					<input type="submit" value="request" />
				</div>
				<div v-if="errors.length">
					<p v-for="error in errors" class="c_form--error">
						!! {{ error }}
					</p>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import InputField from '@/components/input-fields/InputField.vue';
import {
	permissionsEnum,
	type Chat_List_Item,
	type CreateNewChannelForm,
} from '@/types/Chat';
import RadioButton from '@/components/input-fields/RadioButton.vue';
import { getRequest, postRequest } from '@/utils/apiRequests';
import router from '@/router';

export default defineComponent({
	name: 'newChannel',
	components: {
		InputField,
		RadioButton,
	},
	setup() {
		const userStore = useUserStore();
		userStore.refreshAllUsers();
		const { allUsers, me } = storeToRefs(userStore);
		const createNewChannelForm: CreateNewChannelForm = reactive({
			name: '',
			visibility: 'public',
			password: '',
			type: 'channel',
			users: [],
		});

		const errors = ref([] as string[]);

		return {
			userStore,
			allUsers,
			me,
			errors,
			createNewChannelForm,
		};
	},
	computed: {
		usersWithoutMe() {
			return this.allUsers.filter((user) => user.id !== this.me.id);
		},
	},
	methods: {
		handleFormError(responseData: any) {
			if (typeof responseData.message === 'string') {
				this.errors.length = 0;
				this.errors.push(responseData.message);
			} else {
				this.errors = responseData.message.map((msg: String) =>
					msg.replace('(o) => o.', ''),
				);
			}
		},
		async createNewChannel(createNewChannelForm: CreateNewChannelForm) {
			try {
				this.errors.length = 0;
				const all = (await getRequest('chats')).data;
				const found = all.find(
					(chat: Chat_List_Item) =>
						chat.name === createNewChannelForm.name,
				);
				if (found !== undefined) {
					this.errors.push('channel name already exists');
					return;
				}
				if (createNewChannelForm.name.trim().length === 0) {
					this.errors.push('Not a valid channel name');
					return;
				}
				if (!createNewChannelForm.users[0]) {
					this.errors.push(
						'Please assign one or more users to this channel',
					);
					return;
				}
				const usersToSend = createNewChannelForm.users.map(
					(userId) => ({
						id: userId,
						permissions: [
							permissionsEnum.READ,
							permissionsEnum.POST,
						],
					}),
				);
				usersToSend.push({
					id: useUserStore().me.id,
					permissions: [
						permissionsEnum.READ,
						permissionsEnum.POST,
						permissionsEnum.OWNER,
					],
				});
				if (createNewChannelForm.password?.trim().length === 0) {
					delete createNewChannelForm.password;
				}
				const newChannel = await postRequest('chats', {
					...createNewChannelForm,
					users: usersToSend,
				});
				return router.push({
					name: 'channel',
					params: { channelId: newChannel.data.id },
				});
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
</script>

<style scoped>
.checkbox_overview {
	display: flex;
}
.checkbox_overview label {
	padding-left: 0.7em;
}
.checkbox_overview input {
	margin-left: 0.7em;
}
</style>
