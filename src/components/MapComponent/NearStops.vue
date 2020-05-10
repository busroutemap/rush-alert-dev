<template>
    <div>
        <l-marker
        v-for="(stop,i) in nearStops"
        :key="stop['@id']"
        :lat-lng="[stop['geo:lat'],stop['geo:long']]"
        :id="stop['@id']"
        :i="i"
        @click="selectIndex(i)"
        >
        <!-- @clickのiはNearStops定義時に未定義なので好ましくない、というエラー -->
            <l-popup
            >
                <h2>{{stop['dc:title']}}</h2>
                <h3>{{stop['odpt:kana']}}</h3>
                <p
                v-for="operator in stop['odpt:operator']"
                :key="operator"
                >{{operator}}</p>
                <p class="distance">現在地から{{nearStopsDistances[i]}}m</p>
            </l-popup>
        </l-marker>
    </div>
</template>

<script>
// まだ完全なts化は出来ていない
import Vue from 'vue'
import L from 'leaflet';
import { 
    LMarker,
    LPopup,
    LIcon,
    } from 'vue2-leaflet';
import { 
    latLng,
    Icon 
    } from 'leaflet';
// https://github.com/vUdav/vue2-leaflet-locatecontrol/issues/3 を参照
// import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol'

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default {
    name:"MarkerNearStops",
    components:{
        LMarker,
        LPopup,
        LIcon,
        latLng,
        Icon 
    },
    props:{
        // nearStopはarrayタイプのjson
        // 大掛かりなts化を行う際に変更が必要
        "nearStops":{
            type:Array,
            default:[]
        },
        "nearStopsDistances":{
            type:Array,
            default:[]
        }
    },
    computed:{
    },
    methods:{
        selectIndex(i){
            console.log("index:" + i);
            this.$emit("clickMarker",i);
        },
    },
    data(){
        return {
            // nearStops:[]
        }
    }
}
</script>

<style lang="scss" scoped>

    .distance{
        color:green;
    }
</style>