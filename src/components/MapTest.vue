<template>
    <l-map 
    ref="map"
    id="mapcontainer"
    :zoom="zoom"
    :center="center"
    @update:zoom="zoomUpdate"
    @update:center="centerUpdate"
    >
        <BaseMap/>
        <!-- //--------------------------------------------- -->
        <!-- 現在地マーカー -->
        <l-marker
        :lat-lng="here"
        v-if="(lockon)&&(putMarker)"
        :options=putMarkerOption
        >
            <l-popup>
                <h2>現在地マーカー</h2>
                <p>マーカーは移動できます</p>
                <button @click="rem()">削除</button>
            </l-popup>
        </l-marker>
        <v-locatecontrol/>
        <!-- //--------------------------------------------- -->
        <MarkerNearStops
        :nearStops="nearStops"
        :nearStopsDistances="nearStopsDistances"
        @clickMarker="selectStopUpdate(i)"
        />
        <!-- //--------------------------------------------- -->
        <l-control position="bottomleft" >
            <div>
                <button @click="put">マーカーでの現在地指定</button>
                <button @click="rem">削除</button>
            </div>
            <button @click="getNearStops">
                付近のバス停を探す
            </button>
            <button @click="showSelected">
                選択済みを表示する
            </button>
            <!-- <MapControl/> -->
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
    LIcon
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
// import {MapControl} from "./MapComponent/MapControl";
import MarkerNearStops from "./MapComponent/NearStops";
import BaseMap from "./MapComponent/BaseMap";

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
        'v-locatecontrol': Vue2LeafletLocatecontrol,
        //---------------------------------------------
        // 自作コンポーネント
        // MapControl,
        MarkerNearStops,
        BaseMap
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
        }
    },
    methods:{
        zoomUpdate(zoom){
            this.zoom = zoom;
        },
        centerUpdate(center) {
            this.center = center;
        },
        selectStopUpdate(index){
            if(!isNaN(index)){
                !this.nearStopsIsSelected[index];
            }
        },
        getSelects(){
            // 配列の値とそのindexを元に、要素をチェックし新しい配列を返す
            return this.nearStops.filter((value,i)=>{
                const isSelect = this.nearStopsIsSelected[i];
                if(typeof isSelect === 'boolean'){
                    if(isSelect){
                        // boolean型でtrueなら返す
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
        put(){
            // 現在地指定無ければ地図の中心で判定する、
            // でも良いのかもしれない
            const map = this.$refs.map.mapObject;
            if((!this.lockon)&&(!this.putMarker)){
                // 現在地していなく、かつマーカーないなら
                this.here = map.getCenter();
                // 自作Llocate作るなら以下？
                // map.locate({
                //     watch:true,
                //     setView:true,
                //     // 高性能モードはオフ
                //     enableHighAccuracy:false
                // });
                this.lockon = true;
                this.putMarker = true;
            }
        },
        rem(){
            const map = this.$refs.map.mapObject;
            if(this.lockon&&this.putMarker){
                this.lockon = false;
                this.putMarker = false;
            }
        },
        showSelected(){
            const showStops = this.nearStops.filter(stop=>{
                return stop["kotodu:selected"] === true;
            });
            showStops.forEach(e => {
                console.log("選択バス停"+e["dc:title"]+"まで"+e["kotodu:distance"]+"m");
            });
        }
    },
    mounted() {
    },
    data(){
        return{
            // url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            // attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            dummy : latLng(35.55,139.8),
            zoom: 13,
            center: latLng(35.55,139.8),
            marker01: latLng(35.678367, 139.763465),
            // 半径300mを検索範囲内とする
            radius:300,
            // dummy
            here : latLng(35.678367, 139.763465),
            lockon : false,
            putMarker : false,
            myKey:"",
            nearStops:[],
            nearStopsIsSelected:[],
            nearStopsDistances:[],
            putMarkerOption:{
                title:"仮想現在地",
                alt:"位置情報を用いず、マーカーのドラッグ先を現在地とみなします",
                riseOnHover:true,
                draggable:true,
                opacity:0.7
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
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

    // .distance{
    //     color:green;
    // }
}
</style>