import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import Loading from 'vue3-loading-overlay'
import VueGoogleMaps from '@fawmi/vue-google-maps'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import '../node_modules/aos/dist/aos.css'
import 'animate.css'
import { axiosHelper } from './utils/helpers'

const app = createApp(App)
app.use(VueAxios, { $axiosHelper: axiosHelper })
app.use(store)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: process.env.MIX_API_KEY
  },
  autobindAllEvents: false
})
app.component('loading-icon', Loading)
app.mount('#app')
