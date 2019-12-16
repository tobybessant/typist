<template>
	<div>
		<button>
			{{ label }}
		</button>
	</div>
</template>

<script>
export default {
	name: "RouterButton",
	props: {
		label: String,
		route: String
	}
}
</script>

<style scoped>
	button {
		display: inline-block;
		padding: 0.35em 1.2em;
		height: 50px;
		width: 200px;
		background: #FFFFFF;
		border: 0.1em solid #000000;
		margin: 0 0.3em 0.3em 0;
		border-radius: 0.12em;
		box-sizing: border-box;
		text-decoration: none;
		font-family: 'Roboto', sans-serif;
		font-size: 1.2rem;
		font-weight: 300;
		color: #000000;
		text-align: center;
		transition: all 0.2s;
	}

	button:hover {
		color: #FFFFFF;
		background-color: #000000;
		cursor: pointer;
	}
</style>
