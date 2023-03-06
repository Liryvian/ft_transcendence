<template>
	<div class="table c_block">
		<div class="line"></div>
		<div v-for="el in dataArray" class="table_row">
			<div class="table_cell table_left">{{ el.left }}:</div>
			<div class="table_cell table_right">
				<i>{{ el.right }}</i>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { OverviewArray } from '../../types/OverviewArray';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'OverviewWithMidline',
	props: {
		dataArray: Array<OverviewArray>,
	},
});
</script>
