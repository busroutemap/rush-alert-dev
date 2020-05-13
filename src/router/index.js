import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../components/NotFound'
import MapTest from '../components/MapTest'
import 'leaflet/dist/leaflet.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(VueRouter)

// const homeZ = 11;
// const homeLat = 36;
// const homeLng = 140;

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path:'/map/:z/:lat/:lon',
  //   name:'MapTestFullURL',
  //   component:MapTest
  // },
  {
    path:'/map/:poi',
    name:'MapTestFullURL',
    component:MapTest
  },
  {
    path:'/map',
    name:'MapTest',
    component:MapTest
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  },
  {
    path:'*',
    name:'NotFound',
    component:NotFound
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
