<template>
	<div class="player" v-bind:style="playerStyle">
		<div class="username">
			<p>{{ position }} • {{ player.username }}</p>
		</div>
		<div class="player-stats">
			<div>{{ player.correctWordCount }}/{{ player.wordIndex }}</div>
			<div>{{ player.wordAccuracy }}</div>
			<div>{{ player.wpm }}</div>
			<div>{{ player.displayTime }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Player",
	props: {
		player: null,
		position: Number
	},
	data: function() {
		return {
			playerStyle: null
		}
	},
	mounted() {
		this.playerStyle = {
			background: `linear-gradient(297deg, #FFFFFF, ${this.player.colour})`
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
	width: 100%;
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

.username {
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
}

.player-stats {
	flex: 2;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text-align: center;
	align-items: flex-end;
}

.player-stats div {
	display: inline;
	width: 130px;
}
</style>
