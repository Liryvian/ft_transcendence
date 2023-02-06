<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<ball-button/>
			<buttons-on-the-edge-of-fields/>
			<corner-button/>
			<DisabledField/>
			<InputField/>
			<OverviewWithMidline/>
			<HorizontalAvatarAndUserName/>
			<VerticalAvatarAndUserName/>
			<PlayerLeft/>
			<PlayerRight/>
		</div>
	</div>
</template>


<script lang="ts">
import BallButton from '@/components/buttons/BallButton.vue';
import ButtonsOnTheEdgeOfFields from '@/components/buttons/ButtonsOnTheEdgeOfInputFields.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';
import DisabledField from '@/components/input-fields/DisabledInputField.vue';
import InputField from '@/components/input-fields/InputField.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import HorizontalAvatarAndUserName from '@/components/user-info/HorizontalAvatarAndUserName.vue';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import PlayerLeft from '@/components/game-info/PlayerLeft.vue';
import PlayerRight from '@/components/game-info/PlayerRight.vue';
export default {
	name: 'ComponentTest',
	components: { PlayerRight, PlayerLeft, VerticalAvatarAndUserName, HorizontalAvatarAndUserName, OverviewWithMidline, InputField, DisabledField, CornerButton, ButtonsOnTheEdgeOfFields, BallButton },
};

</script>


<!-- <style scoped>-->

<!-- </style>-->