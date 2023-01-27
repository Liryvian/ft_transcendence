<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<script lang="ts">
export default {
	watch: {
		$route(to, from) {
			console.log(to, from);
		},
	},
};
</script>

<template>
	<header>
		<nav @click="$event.target.classList.toggle('bla')">
			<div class="nav_balk"></div>
			<div class="nav_ball"></div>
			<RouterLink v-bind="$props" class="test" to="/settings"
				>Settings</RouterLink
			>
			<RouterLink to="/game">Game</RouterLink>
			<RouterLink to="/chat">Chat</RouterLink>
			<RouterLink to="/profiles">Profiles</RouterLink>
			<RouterLink to="/logout">Logout</RouterLink>
		</nav>
	</header>

	<RouterView />
</template>

<style scoped>
header {
	width: 100vw;
	border-bottom: var(--border-width) solid var(--color-border);
	padding: 0.2em;
	background-color: var(--color-background-soft);
}

nav {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	position: relative;
	color: var(--color-text);
}

.nav_ball {
	display: block;
	position: absolute;
	width: var(--ball-size);
	height: var(--ball-size);
	border: var(--border-width) solid var(--color-border);
	border-radius: 50%;
	top: 50%;
	transform: translateY(-50%);
	left: 38.2%;
	transition: all 0.1s linear;
}

.nav_balk {
	display: block;
	position: absolute;
	width: 4px;
	height: 35px;
	background-color: black;
	left: 37.8%;
	top: 7px;
	transition: all 0.1s linear;
}

nav a.router-link-exact-active {
	/* color: var(--color-text); */
}

nav a.router-link-exact-active:hover {
	/* background-color: transparent; */
}

nav a {
	display: inline-block;
	padding: 1em 2em;
	text-transform: uppercase;
	font-style: normal;
}

/* nav a:first-of-type {
	border: 0;
} */

@media (min-width: 1024px) {
	header {
		/* display: flex; */
		/* place-items: center; */
		/* padding-right: calc(var(--section-gap) / 2); */
	}

	header .wrapper {
		/* display: flex; */
		/* place-items: flex-start; */
		/* flex-wrap: wrap; */
	}

	nav {
		/* text-align: left; */
		/* margin-left: -1rem; */
		/* font-size: 1rem; */

		/* padding: 1rem 0; */
		/* margin-top: 1rem; */
	}
}
</style>
