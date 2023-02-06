<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<div class="c_field_group c_field_group--radio">
				<RadioButton label="hallo" id="r1"/>
				<RadioButton label="doei" id="r2"/>
			</div>
			<corner-button link_text='save' link_target='/'/>
			<InputField name="hallo" />
			<OverviewWithMidline/>
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
export default {
	name: 'ComponentTest',
	components: { PlayerNames, VerticalAvatarAndUserName, HorizontalAvatarAndUserName, OverviewWithMidline, InputField, CornerButton, RadioButton},
};

</script>


<!-- <style scoped>-->

<!-- </style>-->