<template>
	<div class="game-container">
		<div v-if="client" class="game-view">

			<div v-if="countdown !== 0" class="countdown">
				<div>{{ countdown }}</div>
			</div>

			<div class="interface">
				<h1>T Y P E! {{ client.details.username }}</h1>
				<h2>Accuracy: {{ wordAccuracy }}</h2>
				<div v-if="paragraph" class="paragraph">
					<div class="word" v-for="(word, index) in paragraph"
										v-bind:key="index"
										v-bind:class="[word.class, isOpponentPosition(index)]">
										{{ word.text }}
										</div>
				</div>
				<input ref="inputField" type="text"
				v-model="currentWord"
				v-on:keyup.space="submitTypedWord" />
			</div>
		</div>
		<div v-if="!client" class="error">
			<h1>Error connecting to game</h1>
		</div>
	</div>
</template>

<script>
import wordWorkerSourceCode from "../services/WordServiceWorker"

export default {
	name: "Game",
	props: {
		client: null,
		paragraphWords: Array
	},
	data: () => {
		return {
			wordWorker: null,
			countdown: 3,
			currentWordIndex: 0,
			currentWord: "",
			correctWordCount: 0,
			paragraph: [],
			opponentPositions: []
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
				console.log("You win!")
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
			if (state.class === "correct") ++this.correctWordCount
		},
		isOpponentPosition: function(index) {
			for (let i = 0; i < this.client.lobby.players.length; i++) {
				if (this.client.lobby.players[i].wordIndex === index && this.client.lobby.players[i].id !== this.client.details.id) return "opponent"
			}
			return ""
		}
	},
	computed: {
		wordAccuracy: function () {
			return (this.correctWordCount ? Math.floor((this.correctWordCount / this.currentWordIndex * 100)) : 0) + "%"
		}
	}
}
</script>

<style scoped>
.game-container {
	width: 100%;
	padding: 0;
	margin: 0;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
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

.paragraph {
	margin-bottom: 40px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	font-size: 25pt;
	max-width: 700px;
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

.opponent {
	background: #FFDAC1
}
</style>
