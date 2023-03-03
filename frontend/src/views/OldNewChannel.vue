<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1 NEW CHANNEL>
				<div class="c_block c_form_group">

				</div>
			</h1>
		</div>
	</div>
</template>




<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW CHANNEL</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<label for="disabled_field">channel owner:</label>
					<input
						:id="me.id"
						type="text"
						:value="me.name"
						disabled
					/>
				</div>
				<div class="c_field_group">
					<label for="example_field">group name:</label>
					<input
						id="example_field"
						type="text"
					/>
				</div>

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

<!--					<input-->
<!--						id="example_field"-->
<!--						type="text"-->
<!--					/>-->
				</div>

				<div class="c_field_group">
					<label for="example_field">set password:</label>
					<input
						id="example_field"
						type="text"
					/>
				</div>

				<div class="c_field_group">
					<label for="example_field">confirm password:</label>
					<input
						id="example_field"
						type="text"
					/>
				</div>


				<div class="c_field_group c_field_group--radio">
					<div class="c_radio_group">
						<label for="example_radio2">public</label>
						<input
							name="same"
							id="example_radio2"
							type="radio"
							value="on"
							checked
						/>
					</div>
					<div class="c_radio_group">
						<label for="example_radio1">private</label>
						<input
							name="same"
							id="example_radio1"
							type="radio"
							value="on"
						/>
					</div>
					<div class="page_button pb_bottom">
						<a href="#">create</a>
					</div>
				</div>
			</div>
<!--			<div v-if="chatStore.errors.length">-->
<!--				<p v-for="error in userStore.errors" class="c_form&#45;&#45;error">-->
<!--					!! {{ error }}-->
<!--				</p>-->
<!--			</div>-->
<!--			</form>-->
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import InputField from '@/components/input-fields/InputField.vue';
import type { Chat_List_Item, Chat_Member, Chat_Type, CreateNewChannel } from '@/types/Chat';
import { permissionsEnum } from '@/types/Chat';
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
	},

	setup() {
		const userStore = useUserStore();
		userStore.refreshData();
		const {allUsers, me, errors} = storeToRefs(userStore);
		const createNewChannel : CreateNewChannel = reactive({
			name: '',
			visibility: '',//  ChatVisibility,
			password: '',
			type: 'channel',
			users: '', //Chat_Member[],
		});


		return {
			userStore,
			allUsers,
			me,
			errors,
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





