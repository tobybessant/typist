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

		<div v-if="gameStarted" class="gameView">
			<h2>T Y P E !</h2>
		</div>
	</div>
</template>

<script>
import io from "socket.io-client"
import Client from "../services/Client"

export default {
	name: "Lobby",
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
