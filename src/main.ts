import './assets/css/main.css'
import '@bq-t/giphy-clips-ui/styles'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createUI from '@bq-t/giphy-clips-ui'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createUI)

app.mount('#app')
