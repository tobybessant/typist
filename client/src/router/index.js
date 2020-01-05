import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import NewGame from "../views/NewGame.vue"
import JoinGame from "../views/JoinGame.vue"
import Lobby from "../views/Lobby.vue"
import Game from "../views/Game.vue"
import Highscores from "../views/Highscores.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "home",
		component: Home
	},
	{
		path: "/newgame",
		name: "newgame",
		component: NewGame
	},
	{
		path: "/joingame",
		name: "joingame",
		component: JoinGame
	},
	{
		path: "/lobby",
		name: "lobby",
		component: Lobby,
		props: true
	},
	{
		path: "/game",
		name: "game",
		component: Game,
		props: true
	},
	{
		path: "/highscores",
		name: "highscores",
		component: Highscores
	}
]

const router = new VueRouter({
	routes
})

export default router
