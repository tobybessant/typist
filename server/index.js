const dotenv = require("dotenv")
const express = require("express")

/* setup */
dotenv.config()
const PORT = process.env.PORT

const app = express()

app.get("/", (req, res) => {
	res.json({ message: "Index endpoint reached" })
})

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}. . .`)
})
