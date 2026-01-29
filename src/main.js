import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

// TanStack Vue Query
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Global styles
import './style.css'


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

createApp(App)
    .use(router)
    .use(VueQueryPlugin, { queryClient }) // ✅ ÖNCE Query
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: 'system',
            },
        },
    })
    .mount('#app');