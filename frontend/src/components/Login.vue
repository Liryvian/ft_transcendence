<template>
	<div class="page_box_wrapper">
        <h1> HI WANNA PLAY PONG? </h1>
			<h1>Login with Intra</h1>

            <h2>Login with Username</h2>

            <div class="c_block c_form_group">
                <div class="c_field_group">
                    <label for="name">Username:</label>
                    <input v-model="loginForm.name" id="name" type="text" placeholder="username">
                </div>
                <div class="c_field_group">
                    <label for="password"> Password:</label>
                    <input v-model="loginForm.password" id="password" type="text" placeholder="password">
                </div>
                <p>
                    <!-- <button class="w-100 btn btn-lg btn-primary" type="submit" v-on:click="submit">Login</button> -->
                    <a href="#" v-on:click.prevent="submit">Login</a>
                    /
                    <a href="/register">Register</a>
                </p>
            </div>
	</div>
</template>

<script lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { postRequest } from '@/utils/apiRequests';
import { defineComponent, reactive } from 'vue';

interface LoginForm {
	name: string;
    password: string
}

export default defineComponent({
    name: "Login",

	setup(){
        const userStore = useUserStore();
        const loginForm: LoginForm = reactive({
            name: '',
            password: ''
        })
        userStore.refreshData();

        const submit = async () => {
            console.log("Submitting: ", loginForm);
            try {
                postRequest("login", loginForm)
                useUserStore().refreshMe();
                await router.push("/game")
            }
            catch (e) {
                console.log(e);
            }            
        }
		return {
            userStore,
            submit,
            loginForm
		}
	}
})
</script>   

<style>
button {
    all:unset;
    cursor: pointer;
}

button:focus {
    outline: blue 5px auto;
}

</style>