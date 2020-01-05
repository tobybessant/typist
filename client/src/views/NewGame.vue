<template>
	<div class="container">
		<h1>New Game</h1>
		<input v-model="username" type="text" id="gameName" placeholder="Enter Username" autocomplete="off">
		<div class="buttons">
			<Button label="Continue" @buttonClick="createGame" />
			<Button label="Cancel" @buttonClick="goHome" />
		</div>
	</div>
</template>

<script>
import Button from "../components/Button.vue"

export default {
	name: "NewGame",
	components: {
		Button
	},
	data: () => {
		return {
			username: ""
		}
	},
	methods: {
		createGame: function() {
			this.$router.push({ name: "lobby", params: { username: this.username } })
		},
		goHome: function() {
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
	outline: none;
	font-family: "EB Garamond", serif;
}

input:hover {
	border-bottom: 1px solid black;
}

input:focus {
	outline: none;
	border-bottom: 1px solid black;
}

</style>
