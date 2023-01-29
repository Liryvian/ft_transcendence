<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import router from './router';
</script>

<template>
	<header>
		<nav id="mainnav">
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
			<RouterLink to="/settings">
				<div class="nav_ball"></div>
				Settings
			</RouterLink>
			<RouterLink to="/game">
				<div class="nav_ball"></div>
				Game
			</RouterLink>
			<RouterLink to="/chat">
				<div class="nav_ball"></div>
				Chat
			</RouterLink>
			<RouterLink to="/profiles">
				<div class="nav_ball"></div>
				Profiles
			</RouterLink>
			<RouterLink to="/logout">
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
	font-size: 0.9em
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
	opacity: 0;
	left: 0.60em;
	transition: all 0.1s linear;
}

nav a.router-link-exact-active .nav_ball {
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
