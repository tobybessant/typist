<template>
	<div class="container">
		<h1>Join Game</h1>
		<input v-model="lobbyId" type="text" id="lobbyId" placeholder="Enter Lobby Code" autocomplete="off">
		<input v-model="username" type="text" id="username" placeholder="Enter Username" autocomplete="off">
		<Button label="Join" @buttonClick="joinGame" />
		<Button label="Cancel" @buttonClick="home" />
	</div>
</template>

<script>
import Button from "../components/Button.vue"

export default {
	name: "JoinGame",
	components: {
		Button
	},
	data: () => {
		return {
			username: "",
			lobbyId: ""
		}
	},
	methods: {
		joinGame: function() {
			this.$router.push({ name: "lobby", params: { username: this.username, lobbyId: this.lobbyId } })
		},
		home: function() {
			this.$router.push({ name: "home" })
		}
	}
}
</script>

<style scoped>
.container {
	padding: 0;
	margin:0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

input {
	width: 40%;
	height: 50px;
	margin: 20px 0 60px 0;
	padding: 0px 6px;
	font-size: 1.6rem;
	text-align: center;
	border: none;
	border-bottom: 1px solid lightgrey;
	font-family: "EB Garamond", serif;
	outline: none;
}

input:hover {
	border-bottom: 1px solid black;
}

input:focus {
	outline: none;
	border-bottom: 1px solid black;
}
</style>
