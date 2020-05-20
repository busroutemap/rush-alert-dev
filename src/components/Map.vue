<template>
    <l-map 
    ref="map"
    id="mapcontainer"
    :zoom="zoom"
    :center="center"
    :options="{zoomControl: false}"
    @update:zoom="zoomUpdate"
    @update:center="centerUpdate"
    >
        <BaseMap/>
        <l-control-zoom position="bottomright"/>
        <!-- <v-locatecontrol/> -->

        <HereMarker
        :here="here"
        :lockon="lockon"
        :putMarker="putMarker"
        />

        <MarkerNearStops
        :nearStops="nearStops"
        :nearStopsDistances="nearStopsDistances"
        @clickMarker="selectStopUpdate"
        />

        <MapControl
        :lockon="lockon"
        :putMarker="putMarker"
        @lockChange="lockUpdate()"
        @putMarkerChange="putMarkerUpdate()"
        @hereChange="hereUpdate()"
        />

        <l-control position="bottomleft" >
            <button @click="getNearStops()">
                付近のバス停を探す
            </button>
            <button @click="getSelects()">
                (開発用)選択済みを表示する
            </button>
        </l-control>
    </l-map>
</template>

<script>
import L from 'leaflet';
import { 
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl,
    LIcon,
    LControlZoom,
    } from 'vue2-leaflet';
import { 
    latLng,
    Icon 
    } from 'leaflet';
// https://github.com/vUdav/vue2-leaflet-locatecontrol/issues/3 を参照
// import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol'
import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol';

//---------------------------------------------
// 各種自作コンポーネント
// 成功済み
import MapControl from "./MapComponent/MapControl";
import MarkerNearStops from "./MapComponent/NearStops";
import BaseMap from "./MapComponent/BaseMap";
import HereMarker from "./MapComponent/HereMarker";

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
        LPopup,
        LControl,
        LControlZoom,
        'v-locatecontrol': Vue2LeafletLocatecontrol,
        //---------------------------------------------
        // 自作コンポーネント
        MapControl,
        MarkerNearStops,
        BaseMap,
        HereMarker,
    },
    computed:{
    },
    watch: {
        nearStops: function(value){
            this.nearStopsDistances = new Array(value.length);
            this.nearStopsIsSelected = new Array(value.length);
            const map = this.$refs.map.mapObject;
            // getDistanceメソッドを用いて距離を算出し、配列に代入
            // stopが選択済みかどうかの配列に、初期値でfalseを配列に代入
            for(let i = 0;i < value.length;i++){
                const stop = value[i];
                const dis = map.distance([stop['geo:lat'],stop['geo:long']],this.here);
                this.nearStopsDistances[i] = Math.round(dis);
                this.nearStopsIsSelected[i] = false;
            }
            this.$emit("nearStopsGroupChange",{
                nearStops:this.nearStops,
                nearStopsDistances:this.nearStopsDistances,
                nearStopsIsSelected:this.nearStopsIsSelected,
            });
        }
    },
    methods:{
        zoomUpdate(zoom){
            this.zoom = zoom;
            console.log("ズーム:"+zoom);
        },
        centerUpdate(center) {
            this.center = center;
            console.log("センター変更");
        },
        selectStopUpdate(index){
            if(!isNaN(index)){
                const isSelectedBefore = this.nearStopsIsSelected[index];
                this.nearStopsIsSelected.splice(index,1,!isSelectedBefore);
            }
        },
        lockUpdate(){
            this.lockon = !this.lockon;
            console.log("ロック:"+this.lockon);
        },
        putMarkerUpdate(){
            this.putMarker = !this.putMarker;
        },
        hereUpdate(){
            const map = this.$refs.map.mapObject;
            this.here = map.getCenter();
            console.log("here:"+this.here.lat);
        },
        //---------------------------------------------
        getSelects(){
            // 配列の値とそのindexを元に、要素をチェックし新しい配列を返す
            return this.nearStops.filter((value,i)=>{
                const isSelect = this.nearStopsIsSelected[i];
                console.log(i+"番目:"+isSelect)
                if(typeof isSelect === 'boolean'){
                    if(isSelect){
                        // boolean型でtrueなら返す
                        console.log("選択バス停"+value["dc:title"]);
                        return value;
                    }
                }
            });
        },
        async getNearStops(){
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
            //---------------------------------------------
            let pAll = [];
            // ひとまずエリア内のバス停を探す
            const vaot = process.env.VUE_APP_odpt_token;
            pAll.push(loadjson(`places/odpt:BusstopPole?lat=${this.here.lat}&lon=${this.here.lng}&radius=${this.radius}&acl:consumerKey=${vaot}`));
            this.nearStops = await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
            })
            .then(r=>{
                return r[0];
            });
            //---------------------------------------------
        },
    },
    mounted() {
    },
    data(){
        return{
            dummy : latLng(35.55,139.8),
            //---------------------------------------------
            // 地図中心座標関連
            zoom: 13,
            center: latLng(35.55,139.8),
            //---------------------------------------------
            marker01: latLng(35.678367, 139.763465),
            // 半径300mを検索範囲内とする
            radius:300,
            //---------------------------------------------
            // 現在地関連
            // もしlockonでなければ、地図の中心で代用？
            here : latLng(35.678367, 139.763465),
            lockon : false,
            putMarker : false,
            //---------------------------------------------
            nearStops:[],
            nearStopsIsSelected:[],
            nearStopsDistances:[],
            //---------------------------------------------

        }
    }
};
</script>
<style lang="scss" scoped>
$border:1280px;
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
#mapcontainer{
    @media (min-width: $border){
        // 基準値よりも画面サイズが大きい
        width:50vw;
        height:95vh;
    }
}
</style>