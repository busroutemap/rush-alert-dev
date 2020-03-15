import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import MapApp from '@/components/MapApp'
import MapTest from '@/components/MapTest'
import NotFound from '@/components/NotFound'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path:'*',
      name:'notFound',
      component:NotFound
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/map/',
      name: 'MapApp',
      component: MapApp
    },
    {
      path: '/test/',
      name: 'MapTest',
      component: MapApp
    }
  ]
})
