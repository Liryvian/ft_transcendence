<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<!-- Content should be here -->
			<h1>HI WANNA PLAY PONG?</h1>

			<div class="c_block c_form_group">
				<form
					method="post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="userStore.login(loginForm)"
				>
					<InputField
						tabindex="1"
						label="Username"
						placeholder="username"
						v-model="loginForm.name"
					/>

					<InputField
						tabindex="2"
						inputType="password"
						label="Password"
						placeholder="password"
						v-model="loginForm.password"
					/>

					<div class="c_block c_split">
						<p>
							<input
								class="link_button"
								type="submit"
								value="Login"
							/>
							/
							<a href="/register">Register</a>
						</p>
						<p>
							<!--

									MAKE SURE THIS WORKS

							-->
							<a href="/api/auth/authenticate">Sign in with 42</a>
						</p>
					</div>
					<div v-if="userStore.errors.length">
						<p
							v-for="error in userStore.errors"
							class="c_form--error"
						>
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
import InputField from '@/components/input-fields/InputField.vue';
import type { LoginForm } from '@/types/User';
import { apiUrl } from '@/types/Constants';

export default defineComponent({
	name: 'Login',
	components: {
		InputField,
	},

	setup() {
		const redirectUrl: string = `${apiUrl}/auth/authenticate`;
		const userStore = useUserStore();
		const loginForm: LoginForm = reactive({
			name: '',
			password: '',
		});

		return {
			userStore,
			loginForm,
			redirectUrl,
		};
	},
});
</script>
