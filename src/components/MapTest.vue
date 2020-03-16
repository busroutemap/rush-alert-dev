<template>
    <l-map 
    ref="map"
    id="mapcontainer"
    v-bind:zoom="zoom"
    v-bind:center="center"
    >
        <l-tile-layer 
        v-bind:url="url"
        v-bind:attribution="attribution"/>
        <l-marker v-bind:lat-lng="marker01">
            <l-popup>
                <p>{{text}}</p>
            </l-popup>
        </l-marker>
    </l-map>
</template>

<script>
import L from 'leaflet';
import { 
    LMap,
    LTileLayer,
    LMarker,
    LPopup
    } from 'vue2-leaflet';
import { 
    latLng,
    Icon 
    } from 'leaflet';

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
        LMarker,
        LPopup
    },
    async mounted() {
        // this.$nextTick(() => {
        //     // this.$refs.myMap.mapObject.setView(this.center);
        // });
        // ひとまずgithubにある自分のjsonで
        const loadjson = (addURL)=>{
            const baseURL = "https://busroutemap.github.io/ttrmap/";
            return fetch(baseURL+addURL)
            .then(response=> {
                if (response.ok){
                    // httpレスポンスからjsonを抽出
                    return response.json();
                } else{
                    Promise.reject(new Error("error"))
                }
            })
            .catch(e=>{
                console.log(e.message);
            });
        };
        let pAll = [];
        pAll.push(loadjson("stopinfo/data_11.json"));
        this.text = await Promise.all(pAll)
        .catch(e=>{
            console.log(e);
        })
        .then(r=>{
            return r[0][0]["バス停名"];
        });
    },
    data(){
        return{
            text:"hello",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            zoom: 11,
            center: [35.678367, 139.763465],
            marker01: latLng(35.678367, 139.763465)
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