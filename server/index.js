const dotenv = require("dotenv")
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const apiRouter = require("./api/routes")
const database = require("./database")

// environment config
dotenv.config()
const PORT = process.env.PORT || 3000
const DB_STRING = process.env["DB_STRING_" + process.env.NODE_ENV]

// app config
const app = express()
app.use(bodyParser.json())
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"))
}

// fetch environment-specific database from .env
database.connect(DB_STRING)

// api routes
app.use("/api", apiRouter)

// start server
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}. . .`)
})

module.exports = app
