<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>SETTINGS</h1>
			<ProfileSettingAvatar
				:profile_picture="this.user.avatar"
			/>
			<ChangeAvatar />
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="userStore.setProfile(setProfileForm)"
			>
				<InputField label="intra name" v-model="this.user.name" is_disabled='true'/>
				<InputField label="display_name" v-model="setProfileForm.name"  />
				<InputField label="new password" v-model="setProfileForm.password" />
				<InputField
					label="confirm password"
					v-model="setProfileForm.password_confirm"
				/>
<!--				<InputField label="old password" v-model="setProfileForm.old_password" />-->
				<div class="c_block c_split">
					<p><a href="/turnon2fa">turn on 2fa</a></p>
				</div>
				<div class="page_button pb_bottom">
					<a href="#">save</a>
				</div>
				<div v-if="userStore.errors.length">
					<p v-for="error in userStore.errors" class="c_form--error">!! {{ error }}</p>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import type { RegisterForm, SetProfileForm } from '@/types/User';
import { User } from '@/types/User';
import ProfileList from '@/views/ProfilesView.vue';
import ProfileSettingAvatar from '@/components/user-info/ProfileSettingAvatar.vue';
import ChangeAvatar from '@/components/input-fields/ChangeAvatar.vue';

export default defineComponent({
	name: 'RegisterView',
	components: {
		ChangeAvatar,
		ProfileSettingAvatar,
		ProfileList,
		InputField,
	},
	data() {
		return {
			user: {} as User,
		};
	},

	async created() {
		await useUserStore().refreshAllUsers();
		const filteredUsers = useUserStore().me;
		if (filteredUsers === undefined) {
			this.$router.push('/profiles')
		} else {
			this.user = filteredUsers
		}
	},


	setup() {
		const userStore = useUserStore();
		const filteredUsers = useUserStore().me;
		console.log(filteredUsers.name);
		const setProfileForm: SetProfileForm = reactive({
			name: '',
			password: '',
			password_confirm: '',
		});
		return {
			userStore,
			setProfileForm,
		};
	},
});
</script>

.avatar {
vertical-align: middle;
width: 50px;
height: 50px;
border-radius: 50%;
}

<style scoped></style>


// await useUserStore().refreshAllUsers();
// this.user = useUserStore().allUsers.filter((user: User) => (Number(user.id) === Number(this.profile_id)))[0];
<!--if (!this.profile_id) {-->