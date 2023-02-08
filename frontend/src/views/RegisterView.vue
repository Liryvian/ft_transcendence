<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>REGISTER</h1>
			<form
				method="post" action="" class="c_block c_form_group" @submit.prevent="userStore.register(registerForm)" >
			<InputField label="username" v-model="hallo"/>
			<InputField label="password" v-model="hallo"/>
			<InputField label="confirm password" v-model="hallo"/>
				<div class="c_block c_split">
					<p><a href="#">back</a> </p>
					<p><input class="link_button" type="submit" value="register" /></p>
				</div>
			</form>
		</div>
	</div>

</template>

<script>
import InputField from '@/components/input-fields/InputField.vue';

export default {
	name: 'RegisterView',
	components: {InputField},
};
</script>

<style scoped>

</style>




