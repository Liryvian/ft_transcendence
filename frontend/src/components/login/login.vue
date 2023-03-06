<template>
	<form
		method="post"
		action=""
		class="c_block c_form_group"
		@submit.prevent="$emit('tryLogin', loginForm)"
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
					tabindex="3"
					class="link_button"
					type="submit"
					value="Login"
				/>
				/
				<RouterLink tabindex="4" :to="{ name: 'register' }"
					>Register</RouterLink
				>
			</p>
			<p>
				<a tabindex="5" href="/api/auth/authenticate">
					Sign in with 42
				</a>
			</p>
		</div>
		<div v-if="userStore.errors.length">
			<p v-for="error in userStore.errors" class="c_form--error">
				!! {{ error }}
			</p>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import type { LoginForm } from '@/types/User';
import { useUserStore } from '@/stores/userStore';
import { RouterLink } from 'vue-router';

export default defineComponent({
	name: 'LoginFormComponent',
	components: {
		InputField,
		RouterLink,
	},
	setup() {
		const userStore = useUserStore();
		const loginForm: LoginForm = reactive({
			name: '',
			password: '',
		});

		return {
			userStore,
			loginForm,
		};
	},
	emits: ['tryLogin'],
});
</script>
