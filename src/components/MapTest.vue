<template>
    <l-map 
    ref="map"
    id="mapcontainer"
    v-bind:zoom="zoom"
    v-bind:center="center"
    @update:zoom="zoomUpdate"
    @update:center="centerUpdate"
    >
        <l-tile-layer 
        v-bind:url="url"
        v-bind:attribution="attribution"/>
        <l-marker
        v-bind:lat-lng="marker01"
        >
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
    computed:{
    },
    watch: {
    },
    methods:{
        zoomUpdate(zoom) {
            this.zoom = zoom;
        },
        centerUpdate(center) {
            this.center = center;
        },
        apiMarker01() {
            
        }
    },
    async mounted() {
        // this.$router.push({
        //     path:`/map/${this.zoom}/${this.center.lat}/${this.center.lng}`,
        // });
        // this.$nextTick(() => {
        //     // this.$refs.myMap.mapObject.setView(this.center);
        // });
        const loadjson = (addURL)=>{
            const baseURL = "https://api-tokyochallenge.odpt.org/api/v4/";
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
        // ひとまずエリア内のバス停を探す
        const vaot = process.env.VUE_APP_ODPT_TOKEN;
        pAll.push(loadjson(`places/odpt:BusstopPole?lat=${this.center.lat}&lon=${this.center.lng}&radius=${this.radius}&acl:consumerKey=${vaot}`));
        // ここにAPIを継ぎ足していく
        // then内のthis変更回避でthatを指定
        const that = this;
        this.text = await Promise.all(pAll)
        .catch(e=>{
            console.log(e);
        })
        .then(r=>{
            // console.log(r);
            return r;
        });
    },
    data(){
        return{
            text:"hello",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            // このzoomとcenterの値はバグ回避で、実際の初期値はhome
            zoom: 10,
            center: latLng(35,135),
            home: [11, latLng(36, 140)],
            marker01: latLng(35.678367, 139.763465),
            // 半径300mを検索範囲内とする
            radius:300,
            myKey:"",
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