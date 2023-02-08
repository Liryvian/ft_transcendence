<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>REGISTER</h1>
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				v-on:click@submit.prevent="userStore.register(registerForm)"
			>
			<InputField label="username" v-model="username"/>
			<InputField label="password" v-model="password"/>
			<InputField label="confirm password" v-model="password_confirm"/>
				<div class="c_block c_split">
					<p><a href="/login">back</a> </p>
					<p><input class="link_button" type="submit" value="register" /></p>
				</div>
			</form>
		</div>
	</div>

</template>

<script lang="ts">
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import type { RegisterForm } from "@/types/User";

export default defineComponent({
	name: "RegisterView",
	components: {
		InputField
	},

	setup() {
		const userStore = useUserStore();
		const registerForm: RegisterForm = reactive({
			username: '',
			password: '',
			password_confirm: '',
		})

		return {
			userStore,
			registerForm
		}
	}
});
</script>

<style scoped>

</style>




