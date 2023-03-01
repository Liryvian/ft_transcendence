<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>2 factor authentication settings</h1>
			<h2 v-if="successMessage.length">
				<template v-for="(line, index) in messageLines">
					{{ line }}
					<br v-if="index != messageLines.length" />
				</template>
			</h2>
			<template v-if="view_state">
				<form
					v-if="me.two_factor_required"
					action=""
					@submit.prevent="requestTwoFaDisable($event)"
					class="c_block c_form_group"
				>
					<p>
						You're about ot turn off 2fa<br />
						To verify please input one valid token
					</p>
					<InputField
						label="6 digit code"
						type="number"
						v-model="turnOffCode"
					/>
					<div v-if="errors.length">
						<p v-for="error in errors" class="c_form--error">
							!! {{ error }}
						</p>
					</div>
					<input type="submit" value="Turn off 2fa" />
				</form>
				<form
					v-else
					action=""
					@submit.prevent="submitForm($event)"
					class="c_block c_form_group"
				>
					<p>
						You're about to turn on 2fa.<br />
						Scan the QR with your TOTP app to continue.
					</p>
					<p>
						<img v-if="qr_loaded" :src="qr" />
						<img v-else src="/loading.gif" />
					</p>
					<InputField
						label="Input 6 digit code from app"
						type="number"
						v-model="turnOnCode"
					/>
					<div v-if="errors.length">
						<p v-for="error in errors" class="c_form--error">
							!! {{ error }}
						</p>
					</div>
					<input type="submit" value="Turn on 2fa" />
				</form>
			</template>
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
		if (this.me.two_factor_required === false) {
			this.loadQR();
		}
	},
	data() {
		return {
			qr: '/loading.gif',
			qr_loaded: false,
			secret: '',
			turnOnCode: '',
			turnOffCode: '',
			successMessage: '',
			errors: [] as string[],
		};
	},
	watch: {
		'me.two_factor_required'(newValue: boolean, oldValue: boolean) {
			if (
				oldValue !== newValue &&
				newValue === false &&
				this.qr_loaded === false
			) {
				this.loadQR();
			}
		},
	},
	computed: {
		messageLines() {
			return this.successMessage.split('\n');
		},
		view_state() {
			if (
				this.me &&
				this.me.hasOwnProperty('name') &&
				this.me.name.length > 0
			) {
				return true;
			}
			return;
		},
	},
	methods: {
		loadQR() {
			try {
				getRequest('auth/2fa_qr').then((data) => {
					if (this.qr.length > 1) {
						this.qr = data.data.qr;
						this.secret = data.data.secret;
						this.qr_loaded = true;
					}
				});
			} catch (e) {
				console.log('something went wrong on loading QR');
			}
		},
		validateCode(string: string) {
			return string.length === 6 && /^\d+$/.test(string) === true;
		},
		async requestTwoFaDisable(event: Event) {
			this.errors.length = 0;
			this.successMessage = '';
			if (this.validateCode(this.turnOffCode) === false) {
				this.errors.length = 0;
				this.errors.push(
					'Entered verification code is an invalid 6 digit code',
				);
				return false;
			}
			try {
				const result = (
					await postRequest('auth/deactivate_2fa', {
						secret: '',
						token: this.turnOffCode,
					})
				).data;
				this.turnOffCode = '';
				if (result === true) {
					this.successMessage = 'Okay\nYou have deactivated 2fa!';
					useUserStore().refreshMe();
				} else {
					this.errors.length = 0;
					this.errors.push('Invalid code, please try again');
				}
			} catch (e) {
				console.log(e);
				this.errors.length = 0;
				this.errors.push(
					'Something went wrong, please refresh and try again',
				);
			}
		},
		async submitForm(event: Event) {
			this.errors.length = 0;
			this.successMessage = '';
			if (this.validateCode(this.turnOnCode) === false) {
				this.errors.length = 0;
				this.errors.push(
					'Entered verification code is an invalid 6 digit code',
				);
				return false;
			}
			try {
				this.qr_loaded = false;
				const result = (
					await postRequest('auth/activate_2fa', {
						secret: this.secret,
						token: this.turnOnCode,
					})
				).data;
				this.turnOnCode = '';
				if (result === true) {
					this.successMessage = 'Great job!\nYou have turned on 2fa!';
					useUserStore().isLoggedIn = true;
					useUserStore().refreshMe();
				} else {
					this.loadQR();
					this.errors.length = 0;
					this.errors.push(
						'Something went wrong with the code, generating new QR, please try again',
					);
				}
			} catch (e) {
				console.log(e);
				this.errors.length = 0;
				this.errors.push(
					'Something went wrong, please refresh and try again',
				);
			}
		},
	},
});
</script>

<style scoped>
.page_box {
	text-align: center;
}

h2 {
	color: green;
}
</style>
