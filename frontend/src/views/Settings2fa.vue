<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>2 factor authentication settings</h1>
			<template v-if="me.has_2fa"> turn of 2fa </template>
			<form
				action=""
				@submit.prevent="submitForm($event)"
				class="c_block c_form_group"
				v-else
			>
				<p>
					You're about to turn on 2fa.<br />
					Scan the QR with your TOTP app to continue.
				</p>
				<p>
					<img :src="qr" />
				</p>
				<InputField
					label="Input 6 digit code from app"
					type="number"
					v-model="verify"
				/>
				<div v-if="errors.length">
					<p v-for="error in errors" class="c_form--error">
						!! {{ error }}
					</p>
				</div>
				<input type="submit" value="Turn on 2fa" />
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';

export default defineComponent({
	name: '2fasettings',
	components: {
		InputField,
	},
	setup() {
		const userStore = useUserStore();
		const { me } = storeToRefs(userStore);

		return {
			me,
		};
	},
	mounted() {
		getRequest('auth/2fa_qr').then((data) => {
			this.qr = data.data.qr;
			this.secret = data.data.secret;
		});
	},
	data() {
		return {
			qr: '/loading.gif',
			secret: '',
			verify: '',
			errors: [] as string[],
		};
	},
	methods: {
		async submitForm(event: Event) {
			if (
				this.verify.length !== 6 ||
				/^\d+$/.test(this.verify) !== true
			) {
				this.errors.length = 0;
				this.errors.push(
					'Entered verification code is an invalid 6 digit code',
				);
				return false;
			}
			try {
				const result = (
					await postRequest('auth/activate_2fa', {
						secret: this.secret,
						token: this.verify,
					})
				).data;
			} catch (e) {
				console.log(e);
			}
		},
	},
});
</script>

<style scoped>
.page_box {
	text-align: center;
}
</style>
