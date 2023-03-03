<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<!-- Content should be here -->
			<h1>HI WANNA PLAY PONG?</h1>

			<div class="c_block c_form_group">
				<LoginFormComponent
					@tryLogin="tryLogin"
					v-if="loginStage === 'login'"
				/>
				<Login2faComponent
					@toggleTwoFa="toggleTwoFa"
					v-if="loginStage === '2fa'"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, ref } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import LoginFormComponent from '@/components/login/login.vue';
import Login2faComponent from '@/components/login/twofa.vue';
import type { LoginForm } from '@/types/User';

export default defineComponent({
	name: 'Login',
	components: {
		InputField,
		LoginFormComponent,
		Login2faComponent,
	},
	methods: {
		async tryLogin(loginForm: LoginForm) {
			const loginResult: string = await this.userStore.login(loginForm);
			if (loginResult === '2fa') {
				this.toggleTwoFa();
			}
		},
		toggleTwoFa() {
			if (this.loginStage === 'login') {
				this.loginStage = '2fa';
			} else {
				this.loginStage = 'login';
			}
		},
	},
	setup() {
		const userStore = useUserStore();
		const loginStage = ref('login');

		return {
			userStore,
			loginStage,
		};
	},
});
</script>
