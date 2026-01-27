import { createRouter, createWebHistory } from 'vue-router'
import ListingPage from '../views/ListingPage.vue'
import DetailPage from '../views/DetailPage.vue'

const routes = [
    { path: '/', name: 'listing', component: ListingPage },
    { path: '/advert/:id', name: 'detail', component: DetailPage },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})