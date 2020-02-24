<template>
	<div class="highscore">
		<div class="position">{{ positionDisplay }}</div>
		<div class="highscore-details">
			<div class="username">{{ highscore.username }}</div>
			<div class="time">{{ highscore.time }}</div>
			<div class="accuracy">{{ highscore.accuracy }}</div>
			<div class="wpm">{{ highscore.wpm }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Highscore",
	props: {
		position: Number,
		highscore: null
	},
	computed: {
		positionDisplay: function() {
			return this.position + "."
		}
	}
}
</script>

<style>
.position {
	width: 70px;
	margin-right: 10px;
	text-align: right;
}

.highscore {
	width: 100%;
	height: 40px;
	margin: 10px 0;
	font-size: 1.5rem;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.highscore-details {
	width: 100%;
	height: 100%;
	padding: 5px 15px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	border: 1px solid black;
	border-radius: 5px;
}

.highscore-details div {
	flex: 1;
};

.username {
	font-weight: 700;
}
</style>
