import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify' // Vuetify'ı import et

import App from './App.vue'
import router from './router/index'
// DevTools'u tamamen kapat

const app = createApp(App)
//app.config.devtools = false
app.use(vuetify) // Vuetify'ı Vue içinde kullan
app.use(createPinia())
app.use(router)

app.mount('#app')
