<template>
	<div class="page_box_wrapper">
        <h1> HI WANNA PLAY PONG? </h1>

            <div class="c_block c_form_group">
                <InputField label="Username" placeholder="username" v-model="loginForm.name"/>
                <InputField label="Password" placeholder="password" v-model="loginForm.password"/>

                <div class="c_block c_split">
                    <p>
                        <a href="#" v-on:click.prevent="userStore.login(loginForm)">Login</a>
                        /
                        <a href="/register">Register</a>
                    </p>
                    <p>
                        <a :href="redirectUrl">Sign in with 42</a>
                    </p>
                </div>
            </div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import type { LoginForm } from "@/types/User"
import {apiUrl} from '@/types/Constants'

export default defineComponent({
    name: "Login",
    components: {
        InputField
    },

    setup() {
        const redirectUrl: string = `${apiUrl}/auth/authenticate`;
        const userStore = useUserStore();
        const loginForm: LoginForm = reactive({
            name: '',
            password: ''
        })

		return {
            userStore,
            loginForm,
            redirectUrl
		}
	}
})
</script>   
