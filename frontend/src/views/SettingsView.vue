<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>SETTINGS</h1>
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="userStore.register(settingForm)"
			>
				<InputField label="intra name" v-model="settingForm.name" is_disabled='true'/>
				<InputField label="display_name" v-model="settingForm.name"  />
				<InputField label="new password" v-model="settingForm.password" />
				<InputField
					label="confirm password"
					v-model="settingForm.password_confirm"
				/>
				<InputField label="old password" v-model="settingForm.old_password" />
				<div class="c_block c_split">
					<p><a href="/turn on 2fa">back</a></p>
					<p>
						<input
							class="link_button"
							type="submit"
							value="setting"
						/>
					</p>
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
import type { RegisterForm } from '@/types/User';

export default defineComponent({
	name: 'RegisterView',
	components: {
		InputField,
	},

	setup() {
		const userStore = useUserStore();
		const settingForm: RegisterForm = reactive({
			name: '',
			password: '',
			password_confirm: '',
			old_password: '',
		});
		return {
			userStore,
			settingForm,
		};
	},
});
</script>

<style scoped></style>
