<template>
	<div class="container">
		<h1>New Game</h1>
		<input v-model="username" type="text" id="gameName" placeholder="Enter Username">
		<div class="buttons">
			<RouterButton label="Continue" routeName="lobby" :data="{ username }" />
			<RouterButton label="Cancel" routeName="home" />
		</div>
	</div>
</template>

<script>
import RouterButton from "../components/RouterButton.vue"

export default {
	name: "NewGame",
	components: {
		RouterButton
	},
	data: () => {
		return {
			username: ""
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
