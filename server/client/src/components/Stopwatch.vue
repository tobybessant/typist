<template>
	<div class="stopwatch">
		<div class="minutes">{{ displayMinutes }}</div>
		<div class="separator">:</div>
		<div class="seconds">{{ displaySeconds }}</div>
		<div class="separator">:</div>
		<div class="seconds">{{ displayMilliseconds }}</div>
	</div>
</template>

<script>
export default {
	name: "Stopwatch",
	data: () => {
		return {
			timeout: null,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		}
	},
	methods: {
		update: function() {
			this.timeout = setTimeout(this.tick, 1)
		},
		tick: function() {
			this.milliseconds += 5
			if (this.milliseconds >= 1000) {
				this.milliseconds = 0
				this.seconds++
				if (this.seconds >= 60) {
					this.seconds = 0
					this.minutes++
				}
			}

			this.update()
		},
		start() {
			this.update()
		},
		stop() {
			clearTimeout(this.timeout)
		},
		getDisplayValue() {
			return `${this.displayMinutes} : ${this.displaySeconds} : ${this.displayMilliseconds}`
		},
		getScoreValue() {
			const totalSeconds = (this.minutes * 60) + this.seconds + (this.milliseconds * 0.001)
			return totalSeconds
		}
	},
	computed: {
		displayMilliseconds: function() {
			return this.milliseconds > 9 ? (this.milliseconds > 99 ? this.milliseconds : "0" + this.milliseconds) : "00" + this.milliseconds
		},
		displaySeconds: function() {
			return this.seconds > 9 ? this.seconds : "0" + this.seconds
		},
		displayMinutes: function() {
			return this.minutes > 9 ? this.minutes : "0" + this.minutes
		}
	}
}
</script>

<style scoped>
.stopwatch {
	min-width: 100px;
	font-size: 20pt;
	display: flex;
	flex-direction: row;
}

.separator {
	margin: 0 5px;
}
</style>
