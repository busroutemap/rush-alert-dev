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
            const z = this.zoom;
            const lat = this.center.lat;
            const lon = this.center.lng;
            this.$router.push({
                path:`/map/${z}/${lat}/${lon}`,
            });
        },
        centerUpdate(center) {
            this.center = center;
            const z = this.zoom;
            const lat = this.center.lat;
            const lon = this.center.lng;
            this.$router.push({
                path:`/map/${z}/${lat}/${lon}`,
            });
        },
        apiMarker01() {
            
        }
    },
    async mounted() {
        // 引数があればそれに従いzoom,centerを変更
        // 無ければ既定のものへと強引に値を変更
        if(this.$route.params.z){
            this.zoom = this.$route.params.z;
        } else{
            this.zoom = this.home[0];
        }
        if(this.$route.params.lat){
            this.center.lat = this.$route.params.lat;
        } else{
            this.center.lat = this.home[1].lat;
        }
        if(this.$route.params.lon){
            this.center.lng = this.$route.params.lon;
        } else{
            this.center.lng = this.home[1].lng;
        }
        // this.$router.push({
        //     path:`/map/${this.zoom}/${this.center.lat}/${this.center.lng}`,
        // });
        // this.$nextTick(() => {
        //     // this.$refs.myMap.mapObject.setView(this.center);
        // });
        // ひとまずgithubにある自分のjsonで
        const loadjson = (addURL)=>{
            // const baseURL = "https://busroutemap.github.io/ttrmap/";
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
        // pAll.push(loadjson("stopinfo/data_11.json"));
        // ひとまずエリア内のバス停を探す
        console.log(process.env.VUE_APP_ODPT_TOKEN);
        const lk = process.env.VUE_APP_ODPT_TOKEN;
        pAll.push(loadjson(`places/odpt:BusstopPole?lat=${this.center.lat}&lon=${this.center.lng}&radius=${this.radius}&acl:consumerKey=${lk}`));
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
            // return r[0][0]["バス停名"];
        });
    },
    data(){
        return{
            text:"hello",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            // このzoomとcenterの値はバグ回避で、実際の初期値はhome
            // URLで指定がなければhomeの値を利用する
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