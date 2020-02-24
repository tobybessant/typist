const mongoose = require("mongoose")
const options = { useNewUrlParser: true, useUnifiedTopology: true }

const TABLE_NAMES = {
	HIGHSCORES: "highscores"
}

// data base object to encapsulate database interactions and uri handling
module.exports = {
	TABLE_NAMES,
	database: null,
	async connect (uri) {
		console.log("DB CONNECTING TO: ", uri)
		if (uri === undefined) {
			// if no uri is specified, start a mongo memory server
			const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
			const mongoMemoryServer = new MongoMemoryServer()
			uri = await mongoMemoryServer.getConnectionString()
		}
		console.log("Mongo connection: ", uri)

		// connect to database
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
