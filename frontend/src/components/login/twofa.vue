<template>
	<form
		method="post"
		action=""
		class="c_block c_form_group"
		@submit.prevent="userStore.twoFaVerify(twoFaToken)"
	>
		<InputField
			tabindex="1"
			label="Please enter a 2fa token"
			placeholder="000000"
			v-model="twoFaToken.token"
		/>
		<div class="c_block c_split">
			<p>
				<input
					tabindex="3"
					class="link_button"
					type="submit"
					value="validate 2fa code"
				/>
			</p>
			<p>
				<a href="#" @click.prevent="$emit('toggleTwoFa')">go back</a>
			</p>
		</div>

		<div v-if="userStore.errors.length">
			<p v-for="error in userStore.errors" class="c_form--error">
				!! {{ error }}
			</p>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'Login2faComponent',
	components: {
		InputField,
	},
	setup() {
		const userStore = useUserStore();
		const twoFaToken = reactive({
			token: '',
		});

		return {
			userStore,
			twoFaToken,
		};
	},
});
</script>
