<template>
	<div class="container">
		<div v-if="client && !gameStarted" class="lobby">
			<h2>Lobby</h2>
			<div class="lobbyDetails">
				<h4>Host: {{ client.lobby.host }}</h4>
				<h4>Code: {{ client.lobby.code }}</h4>
				<h4>YOU: {{ client.details.username }}</h4>
			</div>
			<div class="playerlist" v-for="player in client.lobby.players"
									v-bind:key="player.id">
				<p>{{ player.username }} | {{ player.isReady }} | {{ player.id }}</p>
			</div>
			<button @click="toggleReady">READY</button>
		</div>
		<RouterButton label="Start" routeName="Game" :data="{ client }" />
	</div>
</template>

<script>
import io from "socket.io-client"
import RouterButton from "../components/RouterButton"
import Client from "../services/Client"

export default {
	name: "Lobby",
	components: {
		RouterButton
	},
	props: {
		username: String,
		lobbyId: String
	},
	data: () => {
		return {
			gameStarted: false,
			client: null
		}
	},
	async mounted() {
		const socket = await io.connect(":9000")
		this.client = new Client(socket, this.username, this.lobbyId)
	},
	methods: {
		toggleReady() {
			this.client.toggleReady()
		},
		startGame() {
			this.gameStarted = true
		}
	},
	computed: {
		canStartGame: function() {
			return this.client.lobby.players.filter(player => player.isReady).length === this.client.lobby.players.length
		}
	}
}
</script>

<style>
.container {
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

.lobby {
	width: 100%;
	margin: 40px;
}

.lobbyDetails {
	height: 90px;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
	max-width: 700px;
}
</style>
