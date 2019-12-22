const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

const LobbyManager = require("./api/controllers/LobbyManager")

const dotenv = require("dotenv")

const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const apiRouter = require("./api/routes")
const database = require("./database")

// environment config
dotenv.config()

// search npm args for test db string (azure pipeline env var)
process.argv.forEach(function (arg) {
	if (arg.includes("DB_STRING_test")) {
		const valueDelim = arg.indexOf("=")
		process.env.DB_STRING_test = arg.substring(valueDelim + 1)
	}
})

// set port and fetch appropriate db string
const PORT = process.env.PORT || 3000
const DB_STRING = process.env["DB_STRING_" + process.env.NODE_ENV]

// app config
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
if (process.env.NODE_ENV === "development") {
	app.use(cors())
	app.use(morgan("dev"))
}

// setup lobby manager
// eslint-disable-next-line no-unused-vars
const lobbyManager = new LobbyManager(io)

// fetch environment-specific database from .env
database.connect(DB_STRING)

// api routes
app.use("/api", apiRouter)

// start server
http.listen(PORT, () => {
	if (process.env.NODE_ENV !== "test") {
		console.log(`Server listening on ${PORT}. . .`)
	}
})

module.exports = app
