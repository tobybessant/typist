import Vue from "vue"
import App from "./App.vue"
import router from "./router"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faClipboard } from "@fortawesome/free-regular-svg-icons"

library.add(faClipboard)

Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount("#app")
