<template>
	<div class="page_box_wrapper">
        <h1> HI WANNA PLAY PONG? </h1>

            <div class="c_block c_form_group">
                <InputField label="Username" placeholder="username" v-model="loginForm.name"/>
                <InputField label="Password" placeholder="password" v-model="loginForm.password"/>

                <div class="c_block c_split">
                    <p>
                        <a href="#" v-on:click.prevent="submit">Login</a>
                        /
                        <a href="/register">Register</a>
                    </p>
                    <p>
                        <a href="http://localhost:8080/api/auth/authenticate">Sign in with 42</a>
                    </p>
                </div>
            </div>
	</div>
</template>

<script lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { postRequest } from '@/utils/apiRequests';
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';

interface LoginForm {
	name: string;
    password: string
}

export default defineComponent({
    name: "Login",
    components: {
        InputField
    },

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