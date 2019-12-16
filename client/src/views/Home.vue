<template>
	<div class="container">
		<AppHeading />
		<div class="buttons">
			<RouterButton label="New Game" routeName="newgame" />
			<RouterButton label="Join Game" routeName="joingame" />
		</div>
	</div>
</template>

<script>
import AppHeading from "@/components/AppHeading.vue"
import RouterButton from "@/components/RouterButton.vue"

export default {
	name: "home",
	components: {
		AppHeading,
		RouterButton
	}
}
</script>

<style scoped>
.container {
	width: 100vw;
	height: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

.buttons {
	width: 40%;
	height: 100%;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
