import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import { createHead } from '@vueuse/head'
import store from './store'
import router from './router'

// App
const app = createApp(App)
app.config.productionTip = false

// Store
app.use(store)

// Routing
app.use(router)

// I18n
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'
import nl from '@/i18n/nl.json'
import ru from '@/i18n/ru.json'

const i18n = createI18n({
    fallBackLocale: 'en',
    locale: localStorage['locale'] || window.navigator.language || 'en',
    messages: { en, fr, nl, ru }
})
app.use(i18n)

// Head management
const head = createHead()
app.use(head)

// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIcon from '@/lib/FontAwesome'

library.add(faChevronDown, faChevronUp)
app.component('font-awesome-icon', FontAwesomeIcon)

// Mount
app.mount('#app')