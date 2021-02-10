import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/bibliographie/:section?',
    name: 'bibliographie',
    component: () => import('@/pages/Bibliography')
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/pages/Contact')
  },
  {
    path: '/actualites/:date?',
    name: 'actualites',
    component: () => import('@/pages/Blog')
  },
  {
    path: '/liens',
    name: 'liens',
    component: () => import('@/pages/Links')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound')
  },
  {
    path: '/portfolio/:category?',
    name: 'portfolio',
    component: () => import('@/pages/Portfolio')
  }
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})