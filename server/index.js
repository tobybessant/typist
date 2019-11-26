const dotenv = require("dotenv")
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")

// environment config
dotenv.config()
const PORT = process.env.PORT

// app config
const app = express()
app.use(bodyParser.json())
app.use(morgan("dev"))

// app routes
app.get("/", (req, res) => {
	res.json({ message: "Index endpoint reached" })
})

// app start
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}. . .`)
})

module.exports = app
