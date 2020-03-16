<template>
    <l-map ref="map" id="mapcontainer" v-bind:zoom="zoom" v-bind:center="center">
        <l-tile-layer v-bind:url="url">
            <l-marker v-bind:lat-lng="center">
                <l-popup>{{text}}</l-popup>
            </l-marker>
        </l-tile-layer>
    </l-map>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker} from 'vue2-leaflet';
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name:'MapTest',
    components:{ 
        LMap,
        LTileLayer,
        LMarker
    },
    mounted() {
        // this.$nextTick(() => {
        //     // this.$refs.myMap.mapObject.setView(this.center);
        // });
    },
    data(){
        return{
            text:"hello",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            zoom: 11,
            center: [35.678367, 139.763465]
        }
    }
};
</script>
<style scoped>
#mapcontainer{
    margin:0px;
    border: 1px solid black;
    position: absolute;
    top:6vh;
    left:0px;
    right:0px;
    bottom:0px;
    width:99.9vw;
    height:93.5vh;
}
</style>