import { expect } from "chai"
import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import RouterButton from "@/components/RouterButton.vue"

describe("RouterButton component", () => {
	let localVue, wrapper, label, routeName, data

	const routes = [
		{ name: "default", path: "/default" },
		{ name: "home", path: "/home" }
	]
	const router = new VueRouter({ routes })

	beforeEach(() => {
		localVue = createLocalVue()
		localVue.use(VueRouter)

		label = "Home"
		routeName = "/home"
		data = { test: "data" }

		wrapper = shallowMount(RouterButton, {
			localVue,
			router,
			name: "RouterButton",
			propsData: {
				label,
				routeName,
				data
			}
		})
	})

	afterEach(() => {
		wrapper = null
	})

	it("Should have a label value", () => {
		expect(wrapper.props().label).to.equal(label)
	})

	it("Should have a routeName value", () => {
		expect(wrapper.props().routeName).to.equal(routeName)
	})

	it("Should have data value", () => {
		expect(wrapper.props().data).to.equal(data)
	})

	it("Should have a 'button' class", () => {
		expect(wrapper.is(".button"))
	})

	it("Should have a 'button:hover' class", () => {
		expect(wrapper.is(".button:hover"))
	})
})
