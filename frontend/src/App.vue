<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<header>
		<nav>
			<div class="nav_ball"></div>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/about">About</RouterLink>
			<RouterLink to="/about">About</RouterLink>
			<RouterLink to="/about">About</RouterLink>
		</nav>
	</header>

	<RouterView />
</template>

<style scoped>
header {
	width: 100vw;
	border-bottom: var(--border-width) solid var(--color-border);
	padding: 0.2em;
}

nav {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	position: relative;
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
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 1em 2em;
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
