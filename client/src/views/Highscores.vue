<template>
	<div class="container">
		<div class="title">
			<h1>Highscores</h1>
		</div>
		<div class="buttons">
			<Button label="Back" @buttonClick="goHome"/>
			<Button label="Refresh" @buttonClick="refreshList"/>
		</div>
		<div class="highscore-headings">
			<div class="position-h">#</div>
			<div class="highscore-details-h">
				<div class="username">Username</div>
				<div class="time">Time</div>
				<div class="accuracy">Accuracy</div>
				<div class="wpm">WPM</div>
			</div>
		</div>
		<Highscore class="highscore-list" v-for="(score, index) in sortedHighscores" :key="score._id" :highscore="score" :position="(index + 1)"/>
	</div>
</template>

<script>
import axios from "axios"
import HighscoreService from "../services/HighscoreService"
import Highscore from "../components/Highscore"
import Button from "../components/Button"
export default {
	name: "Highscores",
	components: {
		Button,
		Highscore
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
	},
	computed: {
		sortedHighscores: function() {
			let scores = this.scores
			return scores.sort((playerA, playerB) => {
				return playerB.wpm - playerA.wpm
			})
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

.highscore-headings {
	margin: 10px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	box-sizing: border-box;
	width: 100%;
	padding: 0 20px;
	display: flex;
	justify-content: flex-start;
	color: #909090;
	border-bottom: 1px solid #909090;
	font-size: 18pt;
}

.position-h {
	width: 40px;
	margin-right: 10px;
	text-align: right;
}

.highscore-details-h {
	width: 100%;
	height: 100%;
	padding: 5px 15px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	border-radius: 5px;
}
.highscore-details-h div {
	flex: 1;
};
</style>
