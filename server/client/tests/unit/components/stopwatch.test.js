/* eslint-disable no-unused-expressions */

import { expect } from "chai"
import { shallowMount } from "@vue/test-utils"
import Stopwatch from "@/components/Stopwatch.vue"

describe("Stopwatch component", () => {
	let wrapper

	beforeEach(() => {
		wrapper = shallowMount(Stopwatch, {})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Starts from 0", () => {
		let data = wrapper.vm.$data
		expect(data.minutes).to.equal(0)
		expect(data.seconds).to.equal(0)
		expect(data.milliseconds).to.equal(0)
	})

	it("Has a 'start' method", () => {
		expect(wrapper.vm.start).to.exist
	})

	it("Has a 'stop' method", () => {
		expect(wrapper.vm.stop).to.exist
	})

	it("Has a 'tick' method", () => {
		expect(wrapper.vm.tick).to.exist
	})

	it("Has a display value method", () => {
		expect(wrapper.vm.getDisplayValue).to.exist
	})

	it("Display value returns the stopwatch current time with padded 0's", () => {
		wrapper.setData({
			minutes: 2,
			seconds: 9,
			milliseconds: 60
		})

		expect(wrapper.vm.getDisplayValue()).to.equal("02 : 09 : 060")
	})

	it("Has a score value method", () => {
		expect(wrapper.vm.getScoreValue).to.exist
	})

	it("Score value returns the stopwatch current time in seconds (2 D.P)", () => {
		wrapper.setData({
			minutes: 0,
			seconds: 34,
			milliseconds: 450
		})
		expect(wrapper.vm.getScoreValue()).to.equal(34.45)
	})
})
