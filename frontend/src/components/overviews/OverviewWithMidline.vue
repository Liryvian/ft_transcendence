<template>
	<div class="table">
		<div class="line"></div>
		<div v-for="el in dataArray" class="table_row">
			<div class="table_cell table_left">{{ el.left }}:</div>
			<div class="table_cell table_right"><i>{{ el.right }}</i></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OverviewWithMidline',
	props: {
		dataArray: Array,
	},
};
</script>

// vincent you probably dont want this style below, but I'm not sure where to put this :)
<style scoped>
.line {
	margin-left: auto;
	margin-right: auto;
	width: var(--game-border-width);
	/*height: 30em;*/
	background-color: var(--color-border);
	/*margin-top: 0em;*/
	position: absolute;
	left: 50%;
	top: 0.55em;
	bottom: 0;
}

.table {
	margin-left: auto;
	margin-right: auto;
	width: 30em;
	height: 10.5em;
	/*background-color: brown;*/
	/*overflow: hidden;*/
	margin-top: 1em;
	position: relative;
	/*outline: 1px solid cyan;*/
}

.table_row {
	display: flex;
}

.table_cell {
	flex-basis: 50%;
	padding: 0.2em 1em;
	/*outline: 2px solid cyan;*/
}

.table_right {
	text-align: left;
}

.table_left {
	text-align: right;
}

text {
	margin-right: 0em;
	margin-left: 18.5em;
}
</style>
