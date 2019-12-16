<template>
	<div class="container">
		<h1>Join Game</h1>
		<input v-model="username" type="text" id="username" placeholder="Enter Username">
		<input v-model="lobbyId" type="text" id="lobbyId" placeholder="Enter Lobby Code">
		<RouterButton label="Join" routeName="lobby" :data="{ username, lobbyId }"/>
		<RouterButton label="Cancel" routeName="home" />
	</div>
</template>

<script>
import RouterButton from "../components/RouterButton.vue"

export default {
	name: "JoinGame",
	components: {
		RouterButton
	},
	data: () => {
		return {
			username: "",
			lobbyId: ""
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
