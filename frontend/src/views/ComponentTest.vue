<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<div class="c_field_group c_field_group--radio">
				<RadioButton v-model="inputData2" :value="true" name="radio1" label="on" id="r1"/>
				<RadioButton v-model="inputData2" :value="false" name="radio1" label="off" id="r2"/>
			</div>
			<corner-button link_text="save" link_target="/" position="pb_bottom"/>
			<InputField label="hallo" v-model="inputData"/>
			<OverviewWithMidline :dataArray="dataArray"/>
			<HorizontalAvatarAndUserName profile_picture="/test-profile.png" profile_name='Georgio'/>
			<VerticalAvatarAndUserName profile_picture="/test-profile.png" profile_name='Jenny'/>
			<PlayerNames/>
		</div>
	</div>
</template>


<script lang="ts">
import RadioButton from '@/components/input-fields/RadioButton.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';
import InputField from '@/components/input-fields/InputField.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import HorizontalAvatarAndUserName from '@/components/user-info/HorizontalAvatarAndUserName.vue';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import PlayerNames from '@/components/game-info/PlayerNames.vue';
import type { OverviewArray } from '../types/OverviewArray';


export default{
	name: 'ComponentTest',
	data() {
		return {
			inputData: '',
			inputData2: '',
			dataArray: [
				{ left: 'intra name', right: 'x' },
				{ left: 'member since', right: 'a' },
				{ left: 'wins', right: 'a' },
				{ left: 'losses', right: 'a' },
				{ left: 'achievements', right: 'a' },
			] as OverviewArray[]
		}
	},
	components: { PlayerNames, VerticalAvatarAndUserName, HorizontalAvatarAndUserName, OverviewWithMidline, InputField, CornerButton, RadioButton},
};

</script>


<!-- <style scoped>-->

<!-- </style>-->