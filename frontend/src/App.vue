<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

import { useGameStore } from './stores/gameStore';
import { useRelationshipStore } from './stores/relationshipStore';
import { useUserStore } from './stores/userStore';
import { useSocketStore } from './stores/socketStore';

if (useUserStore().isLoggedIn) {
	useUserStore().refreshMe();
	useSocketStore().initializeOnline();
	useUserStore().refreshData();
	useGameStore().refreshAllGames();
	useRelationshipStore().initialize();
}
</script>

<template>
	<header>
		<nav v-if="useUserStore().isLoggedIn === false">
			<RouterLink :to="{ name: 'login' }">
				<div class="nav_ball"></div>
				login
			</RouterLink>
			<RouterLink :to="{ name: 'register' }">
				<div class="nav_ball"></div>
				register
			</RouterLink>
		</nav>
		<nav v-else id="mainnav">
			<!--
					// NOTE / TODO

					Look into `transitionGroup`
					Make this a v-for list and move the ball element around

					OR

					Look into 'class based animations'
					https://vuejs.org/guide/extras/animation.html#class-based-animations

					This might help for any of those two:
					```js
					watch: {
						$route(to, from) {
							this.activeLink = to.name;
						},
					},
					```
			-->
			<RouterLink :to="{ name: 'settings' }">
				<div class="nav_ball"></div>
				Settings
			</RouterLink>
			<RouterLink :to="{ name: 'activeGames' }">
				<div class="nav_ball"></div>
				Game
			</RouterLink>
			<RouterLink :to="{ name: 'chat' }">
				<div class="nav_ball"></div>
				Chat
			</RouterLink>
			<RouterLink :to="{ name: 'profiles' }">
				<div class="nav_ball"></div>
				Profiles
			</RouterLink>
			<RouterLink :to="{ name: 'logout' }">
				<div class="nav_ball"></div>
				Logout
			</RouterLink>
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
	font-size: 0.9em;
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
	border: var(--ball-line) solid var(--color-border);
	border-radius: 50%;
	top: 50%;
	transform: translateY(-45%);
	opacity: 0;
	left: 0.6em;
	transition: all 0.1s linear;
}

nav a.router-link-active .nav_ball {
	opacity: 1;
}

nav a {
	display: inline-block;
	padding: 1em 1.6em;
	text-transform: uppercase;
	font-style: normal;
	position: relative;
}

@media (min-width: 1024px) {
	nav a {
		padding: 1em 2em;
	}
}
</style>
