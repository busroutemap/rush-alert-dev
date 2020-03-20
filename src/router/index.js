import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import MapApp from '@/components/MapApp';
import MapTest from '@/components/MapTest';
import NotFound from '@/components/NotFound';
import 'leaflet/dist/leaflet.css';


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
    // {
    //   path: '/map/',
    //   name: 'MapApp',
    //   component: MapApp
    // },
    {
      path: `/map/:z/:lat/:lon/`,
      component: MapTest,
    },
    {
      path: `/map/`,
      component: MapTest,
    }
  ]
})
