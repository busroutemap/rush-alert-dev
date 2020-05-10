<template>
    <div>
        <l-tile-layer 
        :url="url"
        :attribution="attribution"/>
    </div>
</template>
<script>
import Vue from 'vue';
import L from 'leaflet';
import { 
    LTileLayer,
    } from 'vue2-leaflet';
// import { 
//     latLng,
//     } from 'leaflet';
export default{
    name:"BaseMap",
    components:{
        LTileLayer,
    },
    data(){
        return{
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
        }
    }
}
</script>
<style lang="scss" scoped>

</style>