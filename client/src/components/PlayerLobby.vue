<template>
	<div class="player" v-bind:style="playerStyle">
		<div class="username">
			<p>{{ player.username }}</p>
		</div>
		<div class="ready-status" v-bind:style="readyStatusColour">
			<p>{{ readyDisplay }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "Player",
	props: {
		player: null
	},
	data: function() {
		return {
			playerStyle: null
		}
	},
	mounted() {
		this.playerStyle = {
			background: `linear-gradient(297deg, #FFFFFF, ${this.player.colour})`
			// borderLeft: `10px solid ${this.player.colour}`
		}
	},
	computed: {
		readyDisplay: function() {
			return this.player.isReady ? "READY" : "NOT READY"
		},
		readyStatusColour: function() {
			const color = this.player.isReady ? "#65FF24" : "#FF0000"
			const border = `1px solid ${color}`
			const background = this.player.isReady ? "#438038" : "#6C1414"

			return { color, background, border }
		}
	}
}
</script>

<style scoped>
p {
	margin: 0;
	padding: 0;
}
.player {
	min-width: 100%;
	height: 58px;
	margin: 17px 0;
	padding: 10px 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-radius: 5px;
	color: #434343;
	font-size: 20pt;
	border: 1px solid #434343;
}

.ready-status {
	border-radius: 5px;
	padding: 0px 10px;
}
</style>
