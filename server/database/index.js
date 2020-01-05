const mongoose = require("mongoose")
const options = { useNewUrlParser: true, useUnifiedTopology: true }

const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer

const TABLE_NAMES = {
	GAMES: "games",
	HIGHSCORES: "highscores"
}

module.exports = {
	TABLE_NAMES,
	database: null,
	async connect (uri) {
		if (uri === undefined) {
			const mongoMemoryServer = new MongoMemoryServer()
			uri = await mongoMemoryServer.getConnectionString()
		}
		console.log(uri)
		await mongoose.connect(uri, options).then(() => {
			this.database = mongoose.connection
		}).catch((err) => {
			console.error(err)
		})
	},
	async close() {
		mongoose.connection.close()
	}
}
