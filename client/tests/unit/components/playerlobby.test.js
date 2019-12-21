/* eslint-disable no-unused-expressions */

import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import PlayerLobby from "@/components/PlayerLobby.vue"

describe("Player (lobby) component", () => {
	let wrapper, player

	beforeEach(() => {
		player = {
			username: "Test",
			isReady: false,
			colour: "#FFFFFF"
		}

		wrapper = shallowMount(PlayerLobby, {
			propsData: { player }
		})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Has a player prop", () => {
		expect(wrapper.props().player).to.exist
	})

	it("Has a getReadyDisplay property  which returns a 'ready status' as a display string ", () => {
		expect(wrapper.vm.readyDisplay).to.be.a("string")
	})

	it("Makes use of the player's colour in its playerStyle css", () => {
		expect(JSON.stringify(wrapper.vm.$data)).to.include(player.colour)
	})
})
