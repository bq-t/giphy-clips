import './assets/css/main.css'
import '@bq-t/giphy-clips-ui/styles'

import App from './App.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createRouter from './router'
import createUI from '@bq-t/giphy-clips-ui'

const app = createApp(App)

app.use(createPinia())
app.use(createRouter)
app.use(createUI)

app.mount('#app')
