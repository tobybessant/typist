<template>
	<div class="container">
		<div v-if="!loading" class="content">
			<div v-if="client && !gameStarted" class="lobby">
			<div class="lobby-details">
				<div class="detail">
					<div class="label">Lobby</div>
					<div class="value">
						<div class="copy-code-container">
							<div class="lobby-code-container" @click="copyCodeToClipboard">
								<input id="lobby-code" ref="lobbyCode" type="text" :value="client.lobby.code" readonly>
								<font-awesome-icon id="clipboard-icon" :icon="['far', 'clipboard']" />
							</div>
							<div class="fade-in" v-bind:style="copied">
								<p class="copied-status">Copied to clipboard!</p>
							</div>
						</div>
					</div>
				</div>
				<div class="detail">
					<div class="label">Host</div>
					<div class="value">{{ client.lobby.host.username }}</div>
				</div>
			</div>

			<div class="lobby-buttons">
				<div class="left-buttons">
					<Button label="Leave Lobby" @buttonClick="exitLobby" />
					<Button :label="readyButtonText" @buttonClick="toggleReady" />
				</div>
				<Button v-if="canStartGame && isHost" label="Start" @buttonClick="startGame" :css="{ background: '#2bc341', color: 'black' }" />
			</div>
			<div class="players-heading">
				<div class="list-title">
					Connected Players
				</div>
				<div  v-if="!canStartGame" class="ready-status">
					Waiting for players to ready up...
				</div>
			</div>
			<div class="player-list">

			</div>
			<PlayerLobby v-for="player in client.lobby.players"
									v-bind:key="player.id"
									:player="player"/>

			</div>
			<div v-if="!client" class="lobby">
				<h1>Error connecting to lobby</h1>
			</div>
		</div>
		<div v-if="loading" class="loading">
			<Loading text="Connecting..." />
		</div>
	</div>

</template>

<script>
import io from "socket.io-client"
import Client from "../services/Client"
import Button from "../components/Button"
import PlayerLobby from "../components/PlayerLobby"
import Loading from "../components/Loading"

export default {
	name: "Lobby",
	components: {
		Button,
		PlayerLobby,
		Loading
	},
	props: {
		username: String,
		lobbyId: String,
		existingClientData: null
	},
	data: () => {
		return {
			client: null,
			gameStarted: false,
			loading: true,
			copied: { display: "none" }
		}
	},
	async mounted() {
		if (!this.existingClientData) {
			const socket = await io.connect(":9000")
			if (this.username) {
				this.client = new Client(socket, this.$router, this.username, this.lobbyId)
			} else {
				this.loading = false
			}
		} else {
			this.client = this.existingClientData
		}
		setTimeout(() => { this.loading = false }, 2000)
	},
	methods: {
		toggleReady() {
			this.client.toggleReady()
		},
		startGame() {
			this.client.startGame()
		},
		exitLobby: function() {
			this.client.leaveLobby()
		},
		copyCodeToClipboard: function() {
			this.$refs.lobbyCode.select()
			document.execCommand("copy")
			this.displayCopiedMessage()
			this.$refs.lobbyCode.blur()
		},
		displayCopiedMessage: function() {
			this.copied = { display: "inherit", color: "green" }
			setTimeout(() => { this.copied = { display: "none" } }, 3000)
		}
	},
	computed: {
		canStartGame: function() {
			return this.client.lobby.players.filter(player => player.isReady).length === this.client.lobby.players.length
		},
		readyButtonText: function() {
			return this.client.details.isReady ? "Unready" : "Ready"
		},
		isHost: function() {
			return this.client.details.id === this.client.lobby.host.id
		}
	}
}
</script>

<style scoped>
.container {
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
}

.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

.lobby {
	width: 100%;
	max-width: 1000px;
	margin: 40px;
}

.lobby-details {
	height: auto;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.lobby-details .detail {
	text-align: left;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.lobby-details .detail .label {
	color: #909090;
	font-size: 20pt;
}

.lobby-details .detail .value {
	color: black;
	font-size: 35pt;
}

.lobby-code-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: none;
	max-width: 160px;
	padding: 2px 10px;
	font-family: 'EB Garamond', serif;
	font-size: 25pt;
	border: 1px solid #909090;
	border-radius: 5px;
	color: grey;
	margin-top: 10px;
}

#lobby-code {
	width: 130px;
	font-family: 'EB Garamond', serif;
	font-size: 25pt;
	color: black;
	border: none;
	outline: none;
	z-index: -10;
}

#lobby-code:focus {
	outline: none;
}

.lobby-code-container:hover {
	color: black;
	border: 1px solid black;
	cursor: pointer;
}

#lobby-code:disabled {
	outline: none;
	background: none;
}

#clipboard-icon {
	color: inherit;
	height: 0.75em;
	margin-top: 10px;
}

#clipboard-icon:hover {
	height: 0.75em;
	margin-top: 10px;
}

.copy-code-container {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.copied-status {
	height: 10px;
	font-size: 18pt;
	margin-left: 20px;
}

.copied-status p {
	margin: 0;
	padding: 0;
}

.lobby-buttons {
	height: auto;
	margin: 35px auto 35px auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.left-buttons {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.players-heading {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: #909090;
	border-bottom: 1px solid #909090;
	text-align: left;
	font-size: 24pt;
}

.loading {
	height: 100%;
	width:100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 4rem;
}

.fade-in {
  animation: fadeIn ease 1s;
  -webkit-animation: fadeIn ease 1s;
  -moz-animation: fadeIn ease 1s;
  -o-animation: fadeIn ease 1s;
  -ms-animation: fadeIn ease 1s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
	}
}
</style>
