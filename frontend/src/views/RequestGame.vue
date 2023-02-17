<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
			<form
				method="Post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="updateProfile(me.id, requestGameForm)"
			>
<!--				<InputField-->
<!--					v-if="me.is_intra"-->
<!--					label="intra name"-->
<!--					v-model="me.intra_login"-->
<!--					:is_disabled="true"-->
<!--				/>-->
<!--				<InputField-->
<!--					label="display_name"-->
<!--					:modelValue="me.name"-->
<!--&lt;!&ndash;					v-model="updateProfileForm.name"&ndash;&gt;-->
<!--				/>-->
<!--				<InputField-->
<!--					v-if="!me.is_intra"-->
<!--					label="new password"-->
<!--&lt;!&ndash;					v-model="updateProfileForm.new_password"&ndash;&gt;-->
<!--				/>-->
<!--				<InputField-->
<!--					v-if="!me.is_intra"-->
<!--					label="new password confirm"-->
<!--&lt;!&ndash;					v-model="updateProfileForm.new_password_confirm"&ndash;&gt;-->
<!--				/>-->
<!--				<InputField-->
<!--					v-if="!me.is_intra"-->
<!--					label="current password"-->
<!--&lt;!&ndash;					v-model="updateProfileForm.password"&ndash;&gt;-->
<!--				/>-->
<!--				<div class="c_block c_split">-->
<!--					<p><a href="/turnon2fa">turn on 2fa</a></p>-->
<!--				</div>-->
<!--				<div class="page_button pb_bottom">-->
<!--					<input type="submit" value="save" />-->
<!--				</div>-->
<!--				<div v-if="errors.length">-->
<!--					<p v-for="error in errors" class="c_form&#45;&#45;error">-->
<!--						!! {{ error }}-->
<!--					</p>-->
<!--				</div>-->
			</form>
		</div>
	</div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
	name: 'RequestGame',
	components: {
		InputField,
	},

	async created() {
		await useUserStore().refreshMe();
	},
	setup() {
		const userStore = useUserStore();
		useUserStore().refreshMe();
		const { me, errors } = storeToRefs(userStore);
		let requestGameForm: RequestGameForm = reactive({
			player_one: '',
			player_two: '',
		});
		return {
			userStore,
		};
	},
});
</script>

<style scoped></style>
