<template>
	<div class="game-container">
		<div v-if="client" class="game-view">

			<div v-if="countdown !== 0" class="countdown">
				<div>{{ countdown }}</div>
			</div>

			<div class="interface">
				<h1>T Y P E! {{ client.details.username }}</h1>
				<div class="paragraph">
					<div class="word" v-for="(word, index) in paragraph"
										v-bind:key="index"
										v-bind:class=[word.class]>
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
const WORDS = [
	"the",
	"of",
	"and",
	"to",
	"had",
	"list",
	"name",
	"just",
	"over",
	"state",
	"year",
	"day",
	"into",
	"games",
	"way",
	"days",
	"part",
	"could",
	"great",
	"united",
	"hotel",
	"real",
	"item",
	"center"
]

export default {
	name: "Game",
	props: {
		client: null
	},
	data: () => {
		return {
			wordWorker: null,
			countdown: 3,
			currentWordIndex: 0,
			currentWord: "",
			paragraph: []
		}
	},
	created() {
	},
	async mounted() {
		this.wordWorker = new Worker(wordWorkerSourceCode)
		this.wordWorker.onmessage = (m) => this.handleWordServiceWorker(m)

		this.start()
		this.focusInput()
	},
	methods: {
		start: function() {
			let wordsStore = WORDS.splice(0)
			for (let i = 0; i < 10; i++) {
				let randomWordIndex = Math.floor(
					Math.random() * (wordsStore.length - 1)
				)
				if (i === 0) {
					this.paragraph.push({
						text: wordsStore[randomWordIndex],
						class: "current"
					})
					wordsStore.splice(randomWordIndex, 1)
					continue
				}

				this.paragraph.push({
					text: wordsStore[randomWordIndex],
					class: "next"
				})
				wordsStore.splice(randomWordIndex, 1)
			}

			this.startCountdown()
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
				}
			} else {
				console.error(message.data.error)
			}
		},
		updateWordView: function(state) {
			console.log(JSON.stringify(state))
			this.paragraph[state.index].class = state.class
			this.paragraph[state.index].typed = state.typed
		}
	}
}
</script>

<style>
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 16pt;
}

.word {
  margin: 0 1px;
  padding: 3px 5px;
  border-radius: 5px;
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
  background: black;
}
</style>
