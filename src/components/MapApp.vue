<template>
  <!-- cssの後にjsを読み込むが、今回はわけた、大丈夫か不安 -->
  <!-- サーバーサイドleafletでもできるはず、require？後で調べる -->
  <div>
    <p>{{hereText}}</p>
    <l-map ref="map" style="height: 600px;" :zoom="zoom" :center="center">
    <l-tile-layer :url="url"></l-tile-layer>
    </l-map>
  </div>
</template>
<script>
import { LMap, LTileLayer } from "vue2-leaflet";
export default {
  name:'MapApp',
  components:{ 
    LMap,
    LTileLayer
  },
  data(){
    return {
      hereText : "leafletテスト中！",
      url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
      zoom: 11,
      center: [35.40, 136]
    }
  }
}
</script>
<style scoped>
  #mapcontainer{
    width:400px;
    height:400px;
    border: 1px solid black;
  }
</style>