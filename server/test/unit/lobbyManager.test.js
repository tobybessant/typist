const chai = require("chai")
const assert = chai.assert
const Spy = require("../utilities/spy")
const LobbyManager = require("../../api/controllers/LobbyManager")

suite("Unit Tests :: Lobby Manager", () => {
	let io, socket, socketB, lobbyManager, lobbyId

	teardown(() => {
		socket = null
		io = null
		lobbyManager = null
	})

	suite("Accepts a new connection", () => {
		setup(() => {
			io = Spy().onMethod("on")
			lobbyManager = new LobbyManager(io)
		})

		test("io.handle() is called once", () => {
			assert(io.on.calls.length === 1)
		})

		test("io.handle() is called with 'connection' to handle a new connnection event", () => {
			assert(io.on.calls[0][0] === "connection")
		})

		test("io.handle() is called with a callback", () => {
			assert(typeof io.on.calls[0][1] === "function")
		})

		test("io.handle() is called with a callback called 'handleConnection'", () => {
			assert(io.on.calls[0][1].toString().includes("handleConnection"))
		})
	})

	suite("Handle connection registers the correct events", () => {
		setup(() => {
			io = Spy().onMethod("on")
			socket = Spy().onMethod("on")
			lobbyManager = new LobbyManager(io)
			lobbyManager.handleConnection(socket)
		})

		test("'Socket.on()' is called at least once", () => {
			assert(socket.on.calls.length >= 1)
		})

		test("'Socket.on()' is called to register a 'CREATE_LOBBY' handler", () => {
			let calledWithCreateLobby = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("CREATE_LOBBY")) {
					calledWithCreateLobby = true
					return
				}
				return
			}
			assert(calledWithCreateLobby)
		})

		test("'Socket.on()' is called to register a 'CREATE_LOBBY' handler with a callback function", () => {
			let createLobbyHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("CREATE_LOBBY")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							createLobbyHasCallback = true
							return
						}
					}
				}
				return
			}
			assert(createLobbyHasCallback)
		})

		test("'Socket.on()' is called to register a 'JOIN_LOBBY' handler", () => {
			let calledWithCreateLobby = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("JOIN_LOBBY")) {
					calledWithCreateLobby = true
					return
				}
				return
			}
			assert(calledWithCreateLobby)
		})

		test("'Socket.on()' is called to register a 'JOIN_LOBBY' handler with a callback function", () => {
			let joinLobbyHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("JOIN_LOBBY")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							joinLobbyHasCallback = true
							return
						}
					}
				}
				return
			}
			assert(joinLobbyHasCallback)
		})

		test("'Socket.on()' is called to register a 'REQUEST_SELF' handler", () => {
			let calledWithCreateLobby = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("REQUEST_SELF")) {
					calledWithCreateLobby = true
					return
				}
				return
			}
			assert(calledWithCreateLobby)
		})

		test("'Socket.on()' is called to register a 'REQUEST_SELF' handler with a callback function", () => {
			let requestSelfHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("REQUEST_SELF")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							requestSelfHasCallback = true
							return
						}
					}
				}
				return
			}
			assert(requestSelfHasCallback)
		})

		test("'Socket.on()' is called to register a 'disconnect' handler", () => {
			let calledWithCreateLobby = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("disconnect")) {
					calledWithCreateLobby = true
					return
				}
				return
			}
			assert(calledWithCreateLobby)
		})

		test("'Socket.on()' is called to register a 'disconnect' handler with a callback function", () => {
			let disconnectHasCallback = false
			for (let i = 0; i < socket.on.calls.length; i++) {
				const call = socket.on.calls[i]
				if (call.includes("disconnect")) {
					for (let j = 0; j < call[i].length; j++) {
						const arg = call[i][j]
						if (typeof arg === "function") {
							disconnectHasCallback = true
							return
						}
					}
				}
				return
			}
			assert(disconnectHasCallback)
		})
	})

	suite("Create lobby joins the  socket into a new room and sends the player their details", () => {
		setup(() => {
			io = Spy()
				.onMethod("emit")
				.onMethod("on")
			io
				.onMethod("in", null, io)
				.onMethod("to", null, io)

			socket = Spy().onMethod("join")

			lobbyManager = new LobbyManager(io)
			lobbyManager.createLobby(socket, { username: "Toby" })
		})

		test("socket.join() is called once", () => {
			assert(socket.join.calls.length === 1)
		})

		test("io.in([room]).emit() is called twice", () => {
			assert(io.emit.calls.length === 2)
		})

		test("io.in([room]).emit() is called sending the event 'SELF'", () => {
			assert(io.emit.calls[0][0] === "SELF")
		})

		test("io.in([room]).emit() is called sending the event 'STATE_UPDATE'", () => {
			assert(io.emit.calls[1][0] === "STATE_UPDATE")
		})
	})

	suite("Join lobby joins the socket into a room and sends the player their details", () => {
		setup(() => {
			io = Spy()
				.onMethod("emit")
				.onMethod("on")

			io
				.onMethod("in", null, io)
				.onMethod("to", null, io)

			socket = Spy()
				.onMethod("join")

			lobbyManager = new LobbyManager(io)
			lobbyManager.createLobby(socket, { username: "Toby" })

			lobbyId = socket.join.calls[0][0]
			const username = "John"

			// reset call values
			io.reset()
			socket.reset()

			lobbyManager.joinLobby(socket, { lobbyId, username })
		})

		test("socket.join() is called once", () => {
			assert(socket.join.calls.length === 1)
		})

		test("socket.join() is called with the room id", () => {
			assert(socket.join.calls[0][0] === lobbyId)
		})

		test("io.in([room]).emit() is called twice", () => {
			assert(io.emit.calls.length === 2)
		})

		test("io.in([room]).emit() is called sending the event 'SELF'", () => {
			assert(io.emit.calls[0][0] === "SELF")
		})

		test("io.in([room]).emit() is called sending the event 'STATE_UPDATE'", () => {
			assert(io.emit.calls[1][0] === "STATE_UPDATE")
		})
	})

	suite("Leave lobby removes the socket from a room and updates the rest of the room with the new state", () => {
		setup(() => {
			io = Spy()
				.onMethod("emit")
				.onMethod("on")

			io
				.onMethod("in", null, io)
				.onMethod("to", null, io)

			const socket = Spy()
				.onMethod("join")
				.onMethod("disconnect")
			socket.id = "socket_a"

			socketB = Spy()
				.onMethod("join")
				.onMethod("disconnect")
			socketB.id = "socket_b"

			lobbyManager = new LobbyManager(io)
			lobbyManager.createLobby(socket, { username: "Toby" })

			lobbyId = socket.join.calls[0][0]
			const username = "John"

			lobbyManager.joinLobby(socketB, { lobbyId, username })

			// reset call values
			io.reset()
			socket.reset()

			lobbyManager.leaveLobby(socketB)
		})

		test("socket.disconnect() was called once", () => {
			assert(socketB.disconnect.calls.length === 1)
		})

		test("io.emit() was called once", () => {
			assert(io.emit.calls.length === 1)
		})

		test("io.emit() was called sending the event 'STATE_UPDATE'", () => {
			assert(io.emit.calls[0][0] === "STATE_UPDATE")
		})
	})
})
