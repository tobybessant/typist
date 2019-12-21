/* eslint-disable no-unused-expressions */

import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import PlayerGame from "@/components/PlayerGame.vue"

describe("Player (lobby) component", () => {
	let wrapper, player

	beforeEach(() => {
		player = {
			username: "Test",
			isReady: false,
			colour: "#FFFFFF"
		}

		wrapper = shallowMount(PlayerGame, {
			propsData: { player }
		})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Has a player prop", () => {
		expect(wrapper.props().player).to.exist
	})

	it("Makes use of the player's colour in its playerStyle css", () => {
		expect(JSON.stringify(wrapper.vm.$data)).to.include(player.colour)
	})
})
