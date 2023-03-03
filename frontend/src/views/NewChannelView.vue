<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1> NEW CHANNEL </h1>
				<div class="c_block c_form_group">
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
							<template v-for="user in allUsers">
								<ListRow
									v-if="user.id !== me.id"
									:user="user"
								/>
								<div class="checkiesboxies">
									<input type="checkbox" :id="user.id" name="users" :value="user.id" checked />
									<label :for="user.id">{{user.name}}</label>
								</div>
							</template>
						</div>
						<InputField
							label="set password"
							v-model="createNewChannelForm.password"
						/>
						<InputField
							label="confirm password"
							v-model="createNewChannelForm.confirm_password"
						/>
						<div class="c_field_group c_field_group--radio">
							<RadioButton v-model="inputData2" :value="true" name="radio1" label="private" id="r1"/>
							<RadioButton v-model="inputData2" :value="false" name="radio1" label="public" id="r2"/>
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
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import InputField from '@/components/input-fields/InputField.vue';
import type { CreateNewChannelForm } from '@/types/Chat';
import { permissionsEnum } from '@/types/Chat';
import { useChatStore } from '@/stores/chatStore';
import RadioButton from '@/components/input-fields/RadioButton.vue';

export type Chat_Type = 'dm' | 'channel';

export interface Chat_Member {
	id: number;
	name: string;
	avatar?: string;
	permissions: permissionsEnum[];
}

export default defineComponent({
	name: 'newChannel',
	components: {
		InputField,
		RadioButton,
	},

	setup() {
		const userStore = useUserStore();
		userStore.refreshAllUsers();
		const {allUsers, me, errors} = storeToRefs(userStore);
		const chatStore = useChatStore();
		const { createNewChannel } = chatStore;
		const createNewChannelForm : CreateNewChannelForm = reactive({
			name: '',
			visibility: '',//  ChatVisibility,
			password: '',
			password_confirm: '',
			type: 'channel',
			users: '', //Chat_Member[],
		});

		return {
			userStore,
			allUsers,
			me,
			errors,
			createNewChannelForm,
			createNewChannel,
			chatStore,
		};
	},
});
</script>

<style scoped>
.checkiesboxies {
	display: flex;
}
.checkiesboxies label {
	padding-left: 0.7em;
}
.checkiesboxies input {
	margin-left: 0.7em;
}
</style>





