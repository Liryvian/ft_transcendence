<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>REGISTER</h1>
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="userStore.register(registerForm)"
			>
				<InputField
					tabindex="1"
					label="username"
					v-model="registerForm.name"
				/>
				<InputField
					tabindex="2"
					inputType="password"
					label="password"
					v-model="registerForm.password"
				/>
				<InputField
					tabindex="3"
					inputType="password"
					label="confirm password"
					v-model="registerForm.password_confirm"
				/>
				<div class="c_block c_split">
					<p><a href="/login">back</a></p>
					<p>
						<input
							tabindex="4"
							class="link_button"
							type="submit"
							value="register"
						/>
					</p>
				</div>
				<div v-if="userStore.errors.length">
					<p v-for="error in userStore.errors" class="c_form--error">
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
import type { RegisterForm } from '@/types/User';

export default defineComponent({
	name: 'RegisterView',
	components: {
		InputField,
	},

	setup() {
		const userStore = useUserStore();
		const registerForm: RegisterForm = reactive({
			name: '',
			password: '',
			password_confirm: '',
		});
		return {
			userStore,
			registerForm,
		};
	},
});
</script>

<style scoped></style>
