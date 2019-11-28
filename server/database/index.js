const mongoose = require("mongoose")
const options = { useNewUrlParser: true, useUnifiedTopology: true }

const TABLE_NAMES = {
	GAMES: "games"
}

module.exports = {
	TABLE_NAMES,
	database: null,
	async connect (uri) {
		await mongoose.connect(uri, options).then(() => {
			console.log("Connected to database")
			this.database = mongoose.connection
		}).catch((err) => {
			console.error(err)
		})
	},
	async close() {
		mongoose.connection.close()
	}
}
