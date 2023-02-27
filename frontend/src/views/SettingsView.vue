<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>SETTINGS</h1>
			<ProfileSettingAvatar :profile_picture="me.avatar" />
			<div class="c_block c_form_group tac">
				<ChangeAvatar />
			</div>
			<form
				method="Post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="updateProfile(me.id, updateProfileForm)"
			>
				<InputField
					v-if="me.is_intra"
					label="intra name"
					v-model="me.intra_login"
					:is_disabled="true"
				/>
				<InputField
					label="display_name"
					:modelValue="me.name"
					@update:modelValue="updateProfileForm.name = $event"
				/>
				<InputField
					v-if="!me.is_intra"
					label="new password"
					v-model="updateProfileForm.new_password"
				/>
				<InputField
					v-if="!me.is_intra"
					label="new password confirm"
					v-model="updateProfileForm.new_password_confirm"
				/>
				<InputField
					v-if="!me.is_intra"
					label="current password"
					v-model="updateProfileForm.password"
				/>
				<div class="c_block c_split">
					<p>
						<RouterLink :to="{ name: 'turn-on-2fa' }">turn on 2fa</RouterLink>
					</p>
				</div>
				<div class="page_button pb_bottom">
					<input type="submit" value="save" />
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
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import type { UpdateProfileForm } from '@/types/User';
import ProfileList from '@/views/ProfilesView.vue';
import ProfileSettingAvatar from '@/components/user-info/ProfileSettingAvatar.vue';
import ChangeAvatar from '@/components/input-fields/ChangeAvatar.vue';
import { storeToRefs } from 'pinia';

export default defineComponent({
	name: 'SettingsView',
	components: {
		ChangeAvatar,
		ProfileSettingAvatar,
		ProfileList,
		InputField,
	},

	async created() {
		await useUserStore().refreshMe();
	},

	setup() {
		const userStore = useUserStore();
		useUserStore().refreshMe();
		const { me, errors } = storeToRefs(userStore);
		const { updateProfile, refreshData } = userStore;
		let updateProfileForm: UpdateProfileForm = reactive({
			name: me.value.name,
			new_password: '',
			new_password_confirm: '',
			password: '',
		});
		return {
			me,
			errors,
			updateProfile,
			updateProfileForm,
			userStore,
		};
	},
});
</script>

.avatar { vertical-align: middle; width: 50px; height: 50px; border-radius: 50%;
}

<style scoped></style>
