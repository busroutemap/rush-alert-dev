import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';
import NotFound from '../components/NotFound';
// import Map from '../components/Map';
import Main from '../components/Main';
import 'leaflet/dist/leaflet.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/map/:poi',
  //   name: 'MapTestFullURL',
  //   component: Main
  // },
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/help',
    name: 'Help',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/Help.vue')
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
