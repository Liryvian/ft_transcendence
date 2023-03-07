<template>
	<form
		method="Post"
		action=""
		class="c_block c_form_group"
		@submit.prevent="updateProfile(me.id, updateProfileForm)"
	>
	<div class="input-group">
		<input
			class="form-control form-control-lg"
			type="file"
			accept="image/*"
			@change="handleFileUpload($event)"
		/>
		<button
			type="button"
			class="btn btn-success"
			@click="submitFile"
			:disabled="canUploadFile"
		>
			Save
		</button>
	</div></form>

<!--	<form class="button">-->
<!--		<label for="actual-btn">change avatar</label>-->
<!--		<input type="file" id="actual-btn" hidden/>-->
<!--		<input type="submit" value="submit" />-->
<!--	</form>-->
<!--	</form>-->
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import type { UpdateProfileForm } from '@/types/User';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from "pinia";

export default defineComponent({
	name: 'ChangeAvatar',
	props: {
		profile_picture: String,
	},
	setup (){
		const userStore = useUserStore();
		useUserStore().refreshMe();
		const { me, errors } = storeToRefs(userStore);
		const { updateProfile, refreshData } = userStore;
		let updateProfileForm: UpdateProfileForm = reactive({
			name: me.value.name,
			avatar: '',
		});
		return {
			me,
			errors,
			updateProfile,
			updateProfileForm,
			userStore,
		};
	},
});
</script >

<style scoped>

.button {
	margin-left: auto;
	margin-right: auto;
	margin-top: 1.2em;
}
label {
	color: black;
	padding: 0.5rem;
	cursor: pointer;
	margin-top: 1rem;
}

</style>
