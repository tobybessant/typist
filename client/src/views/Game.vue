<template>
	<div class="game-container">
		<div v-if="client" class="game-view">

			<div v-if="countdown !== 0" class="countdown">
				<div>{{ countdown }}</div>
			</div>

			<div class="interface">
				<div v-if="paragraph && !client.lobby.gameOver" class="paragraph">
					<div class="stopwatch">
						<h2><Stopwatch ref="stopwatch"/></h2>
					</div>
					<div class="word" v-for="(word, index) in paragraph"
										v-bind:key="index"
										v-bind:class="[word.class]"
										v-bind:style="isOpponentPosition(index)">
										{{ word.text }}
					</div>
				</div>
				<input ref="inputField" v-if="!client.details.finished" type="text"
				v-model="currentWord"
				v-on:keyup.space="submitTypedWord" autocomplete="off"/>

				<div v-if="client.details.finished && !client.lobby.gameOver">
					<h3>Waiting for other players.</h3>
					<PlayerGame :player="client.details"/>
				</div>

				<div v-if="client.lobby.gameOver" class="leaderboard">
					<div class="table-title">
						<h2>Results</h2>
					</div>
					<div class="scoreboard-headings">
						<div class="player-names">
							<div>Player</div>
						</div>
						<div class="player-stats">
							<div>Correct Words</div>
							<div>Accuracy</div>
							<div>WPM</div>
							<div>Time</div>
						</div>
					</div>
					<PlayerGame v-for="(player, index) in client.lobby.players"
										v-bind:key="player.id"
										:player="player"
										:position="index + 1" />
				</div>
				<div v-if="client.lobby.gameOver" class="end-buttons">
					<Button label="Return to Lobby" @buttonClick="returnToLobby" :css="{ width: '300px' }"/>
					<Button v-if="!savedHighscore" label="Save Highscore" @buttonClick="postHighscore" :css="{ width: '300px' }"/>
					<div v-if="highscoreResultMessage">
						<h2>{{ highscoreResultMessage }}</h2>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!client" class="error">
			<h1>Error connecting to game</h1>
		</div>
	</div>
</template>

<script>
import axios from "axios"
import HighscoreService from "../services/HighscoreService"
import wordWorkerSourceCode from "../services/WordWorker"
import Stopwatch from "../components/Stopwatch"
import Button from "../components/Button"
import PlayerGame from "../components/PlayerGame"

export default {
	name: "Game",
	props: {
		client: null,
		paragraphWords: Array
	},
	components: {
		Stopwatch,
		Button,
		PlayerGame
	},
	data: () => {
		return {
			wordWorker: null,
			countdown: 3,
			currentWordIndex: 0,
			currentWord: "",
			correctWordCount: 0,
			paragraph: [],
			opponentPositions: [],
			highscoreService: null,
			savedHighscore: false,
			highscoreResultMessage: ""
		}
	},
	async mounted() {
		this.wordWorker = new Worker(wordWorkerSourceCode)
		this.wordWorker.onmessage = (m) => this.handleWordServiceWorker(m)

		this.buildParahgraphView()
		this.startCountdown()
		this.focusInput()
	},
	methods: {
		buildParahgraphView: function() {
			for (let i = 0; i < this.paragraphWords.length; i++) {
				if (i === 0) {
					this.paragraph.push({
						text: this.paragraphWords[i],
						class: "current"
					})
					continue
				}

				this.paragraph.push({
					text: this.paragraphWords[i],
					class: "next"
				})
			}
		},
		startCountdown: function() {
			if (this.countdown > 0) {
				setTimeout(() => {
					this.countdown -= 1
					this.startCountdown()
				}, 1000)
			} else {
				this.$refs.inputField.disabled = false
				this.$refs.inputField.focus()
				this.$refs.stopwatch.start()
			}
		},
		focusInput: function() {
			this.$refs.inputField.disabled = true
		},
		submitTypedWord: function() {
			this.wordWorker.postMessage({
				operation: "PROCESS_WORD",
				typedValue: this.currentWord.trim(),
				correctValue: this.paragraph[this.currentWordIndex].text,
				correctValueIndex: this.currentWordIndex
			})

			this.currentWord = ""

			if (this.currentWordIndex + 1 < this.paragraph.length) {
				this.paragraph[++this.currentWordIndex].class = "current"
			} else {
				this.currentWordIndex++
				this.client.details.correctWordCount = this.correctWordCount
				this.client.details.time = this.$refs.stopwatch.getScoreValue()
				this.client.details.displayTime = this.$refs.stopwatch.getDisplayValue()
				this.client.details.wordAccuracy = this.wordAccuracy
				this.client.details.wpm = this.wpm
				this.client.finish()
			}
		},
		handleWordServiceWorker: function(message) {
			if (!message.data.error) {
				switch (message.data.operation) {
				case "PROCESS_WORD":
					this.updateWordView(message.data.result)
					this.client.details.wordIndex = (message.data.result.index + 1)
					this.client.stateChange()
				}
			} else {
				console.error(message.data.error)
			}
		},
		updateWordView: function(state) {
			this.paragraph[state.index].class = state.class
			this.paragraph[state.index].typed = state.typed
			if (state.class === "correct") {
				this.client.details.correctWordCount = ++this.correctWordCount
			}
		},
		isOpponentPosition: function(index) {
			for (let i = 0; i < this.client.lobby.players.length; i++) {
				if (this.client.lobby.players[i].wordIndex === index && this.client.lobby.players[i].id !== this.client.details.id) {
					return {
						background: this.client.lobby.players[i].colour
					}
				}
			}
			return ""
		},
		returnToLobby: function() {
			this.client.returnToLobby()
		},
		postHighscore: async function() {
			if (!this.highscoreService) { this.highscoreService = new HighscoreService(axios) }
			const score = {
				username: this.client.details.username,
				displayTime: this.client.details.displayTime,
				wpm: this.client.details.wpm,
				accuracy: this.client.details.wordAccuracy
			}
			const result = await this.highscoreService.save(score)
			if (result.error) {
				this.highscoreResultMessage = result.error
			} else {
				this.savedHighscore = true
				this.highscoreResultMessage = result.message
			}
		}
	},
	computed: {
		wordAccuracy: function () {
			return (this.correctWordCount ? Math.floor((this.correctWordCount / this.currentWordIndex * 100)) : 0) + "%"
		},
		wpm: function() {
			const decimalMinutes = Math.round((this.$refs.stopwatch.getScoreValue() / 60) * 10) / 10
			return Math.floor(this.correctWordCount / decimalMinutes)
		}
	}
}
</script>

<style scoped>
.game-container {
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}

.game-view {
	width: 100%;
	max-width: 1000px;
	padding: 0;
	margin: 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.interface {
	width: 100%;
}

.countdown {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100vh;
	width: 100vw;
	background: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 5rem;
	z-index: 99;
}

.stopwatch {
	width: 100%;
	font-size: 30pt;
	display: flex;
	align-items: center;
	justify-content: center;
}

.paragraph {
	margin-bottom: 40px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	font-size: 25pt;
}

.word {
	margin: 0 1px;
	padding: 3px 5px;
	border-radius: 5px;
}

input {
	width: 40%;
	height: 50px;
	margin: 20px 0 60px 0;
	padding: 0px 6px;
	font-size: 1.6rem;
	text-align: center;
	border: none;
	border-bottom: 1px solid black;
	outline: none;
}

.next {
	color: grey;
}

.correct {
	color: black;
}

.incorrect {
	color: grey;
	text-decoration: line-through;
}

.current {
	color: white;
	background: black !important;
}

.table-title {
	font-size: 24pt;
	width: 100%;
	text-align: left;
	padding: 0 20px;
	margin: 60px 0 0 0;
}

.table-title h2 {
	margin: 0;
	padding: 0;
}

.scoreboard-headings {
	box-sizing: border-box;
	width: 100%;
	padding: 0 20px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: #909090;
	border-bottom: 1px solid #909090;
	text-align: left;
	font-size: 18pt;
}

.scoreboard-headings * {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.player-names {
	flex: 1;
	display:flex;
	align-items: flex-end;
}
.player-stats {
	flex: 2;
	justify-content: space-between;
	text-align: center;
	align-items: flex-end;
}

.player-stats div {
	display: inline;
	width: 130px;
}

.leaderboard {
	margin-bottom: 80px;
}

.end-buttons {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
