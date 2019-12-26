<template>
	<div class="container">
		<div class="title">
			<h1>Highscores</h1>
		</div>
		<div class="buttons">
			<Button label="Back" @buttonClick="goHome"/>
			<Button label="Refresh" @buttonClick="refreshList"/>
		</div>
		<div class="highscore-list" v-for="(score, index) in scores" v-bind:key="score._id">{{(index + 1) + ". "}} {{score}}</div>
	</div>
</template>

<script>
import axios from "axios"
import HighscoreService from "../services/HighscoreService"
import Button from "../components/Button"
export default {
	name: "Highscores",
	components: {
		Button
	},
	data: function() {
		return {
			scores: [],
			highscoreService: null
		}
	},
	async mounted() {
		this.highscoreService = new HighscoreService(axios)
		this.scores = await this.highscoreService.fetchAll()
	},
	methods: {
		goHome: function() {
			this.$router.push({ name: "home" })
		},
		refreshList: async function() {
			this.scores = await this.highscoreService.fetchAll()
		}
	}
}
</script>

<style scoped>
.container {
	padding: 0;
	margin:0 auto;
	max-width: 1000px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

.highscores h1 {
	margin: 0;
	padding: 0;
}
.buttons {
	width: 80%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 30px 0;
}
</style>
