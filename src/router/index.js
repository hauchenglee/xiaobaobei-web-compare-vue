import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WebDetailView from '../views/WebDetailView.vue'
import ContentDetailView from '../views/ContentDetailView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/website/:id',
        name: 'WebDetail',
        component: WebDetailView
    },
    {
        path: '/page/:id',
        name: 'ContentDetail',
        component: ContentDetailView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router