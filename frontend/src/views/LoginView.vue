<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<!-- Content should be here -->
			<h1>HI WANNA PLAY PONG?</h1>

			<div class="c_block c_form_group">
				<div class="tac" v-if="loginStage === 'loading'">
					<img src="/loading.gif" alt="" />
				</div>
				<LoginFormComponent
					@tryLogin="tryLogin"
					:errors="errors"
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
import type { LoginForm, User } from '@/types/User';
import { getRequest, postRequest } from '@/utils/apiRequests';
import router from '@/router';

export default defineComponent({
	name: 'Login',
	components: {
		InputField,
		LoginFormComponent,
		Login2faComponent,
	},
	data() {
		return {
			errors: [] as string[],
		};
	},
	methods: {
		handleFormError(responseData: any) {
			if (responseData.hasOwnProperty('message')) {
				if (typeof responseData.message === 'string') {
					this.errors.length = 0;
					this.errors.push(responseData.message);
				} else {
					this.errors = responseData.message.map((msg: String) =>
						msg.replace('(o) => o.', ''),
					);
				}
			} else {
				this.errors.length = 0;
			}
		},
		async tryLogin(loginForm: LoginForm) {
			this.errors.length = 0;
			try {
				this.loginStage = 'loading';
				const user: User = (await postRequest('login', loginForm)).data;
				console.log({ user });
				if (user.two_factor_required === true) {
					this.toggleTwoFa();
					return;
				}
				useUserStore().finalizeLogin();
			} catch (e) {
				console.log('something went wrong', e.response.data);
				this.handleFormError(e.response.data);
				this.loginStage = 'login';
				return;
			}

			setTimeout(() => {
				router.push({ name: 'settings' });
			}, 1500);
		},
		toggleTwoFa() {
			if (this.loginStage !== '2fa') {
				this.loginStage = '2fa';
			} else {
				this.loginStage = 'login';
			}
		},
	},
	async created() {
		try {
			const isLoggedIn = await getRequest('auth/is_authenticated');
			if (isLoggedIn) {
				useUserStore().isLoggedIn = true;
				useUserStore().finalizeLogin();
				return router.push({ name: 'settings' });
			}
		} catch (e) {
			const needs_2fa = (await getRequest('auth/needs_2fa')).data;
			if (needs_2fa === true) {
				this.toggleTwoFa();
			}
		}
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
