<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl
});


export default {
    name:"PetitMap",
    props:{
        poiLatLng:{
            type:Array,
            default:()=>{
                return [35.55,139.8]
            }
        }
    },
    mounted(){
        let map = L.map('map').setView(this.center, 16);
        L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
            attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            maxZoom: 18
        }).addTo(map);
    },
    data(){
        return{
            center:[35.678367, 139.763465]
        }
    }
}
</script>

<style lang="scss" scoped>
#map {
    width: 500px;
    height: 500px;
}
</style>