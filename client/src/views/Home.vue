<template>
	<div class="container">
		<AppHeading />
		<div class="buttons">
			<Button label="New Game" @buttonClick="newGameClicked"/>
			<Button label="Join Game" @buttonClick="joinGameClicked" />
			<Button label="Highscores" @buttonClick="highscoresClicked" />
		</div>
	</div>
</template>

<script>
import AppHeading from "@/components/AppHeading.vue"
import Button from "@/components/Button.vue"

export default {
	name: "home",
	components: {
		AppHeading,
		Button
	},
	methods: {
		newGameClicked: function() {
			this.$router.push({ name: "newgame" })
		},
		joinGameClicked: function() {
			this.$router.push({ name: "joingame" })
		},
		highscoresClicked: function() {
			this.$router.push({ name: "highscores" })
		}
	}
}
</script>

<style scoped>
.container {
	width: 100%;
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
