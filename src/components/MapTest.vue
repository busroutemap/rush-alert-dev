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
        <!-- <l-marker
        v-bind:lat-lng="marker01"
        >
            <l-popup>
                <p>{{text}}</p>
            </l-popup>
        </l-marker> -->

        <!-- <v-locatecontrol
        v-bind:options='{setView:"false"}'
        /> -->
        <v-locatecontrol/>
        <l-marker
        :key="stop['@id']"
        v-for="stop in nearStops"
        :nearStops="nearStops"
        v-bind:lat-lng="[stop['geo:lat'],stop['geo:long']]"
        v-bind:id="stop['@id']"
        >
            <l-popup>
                <!-- <h2>{{stop['title']['ja']}}</h2> -->
                <h2>{{stop['dc:title']}}</h2>
                <h3>{{stop['odpt:kana']}}</h3>
                <p
                v-for="operator in stop['odpt:operator']"
                :key="operator"
                >{{operator}}</p>
                <p class="distance">現在地から{{stop['kotodu:distance']}}m</p>
            </l-popup>
        </l-marker>
        <l-control position="bottomleft" >
            <button @click="getNearStops">
            付近のバス停を探す
            </button>
            <div>
            <button @click="put">マーカーでの現在地指定</button>
            <button @click="rem">削除</button>
            </div>
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
    LControl
    } from 'vue2-leaflet';
import { 
    latLng,
    Icon 
    } from 'leaflet';
// https://github.com/vUdav/vue2-leaflet-locatecontrol/issues/3 を参照
// import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol'
import Vue2LeafletLocatecontrol from 'vue2-leaflet-locatecontrol/Vue2LeafletLocatecontrol'

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
        'v-locatecontrol': Vue2LeafletLocatecontrol
    },
    computed:{
    },
    watch: {
    },
    methods:{
        zoomUpdate(zoom){
            this.zoom = zoom;
        },
        centerUpdate(center) {
            this.center = center;
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
            pAll.push(loadjson(`places/odpt:BusstopPole?lat=${this.center.lat}&lon=${this.center.lng}&radius=${this.radius}&acl:consumerKey=${vaot}`));
            this.nearStops = await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
            })
            .then(r=>{
                return r[0];
            });
            // getDistanceメソッドを用いて距離を算出する
            for(let i = 0;i < this.nearStops.length;i++){
                const stop = this.nearStops[i];
                this.distances[i] = this.getDistance(stop['geo:lat'],stop['geo:long']);
                stop["kotodu:distance"]= Math.round(this.distances[i]);
            }
            //---------------------------------------------
        },
        /**
         * 中心位置(又は現在位置)から引数の緯度経度まで何m離れているか
         * @param lat
         * @param lng
         * @returns distance
         */
        getDistance(lat,lng){
            let map = this.$refs.map.mapObject;
            const distance = map.distance([lat,lng],this.center);
            return distance;
        },
        put(){
            const map = this.$refs.map.mapObject;
            if((!this.lockon)&&(!this.putMarker)){
                this.here = map.getCenter();
                const theVue=this;
                // 自作Llocate作るなら以下？
                // map.locate({
                //     watch:true,
                //     setView:true,
                //     // 高性能モードはオフ
                //     enableHighAccuracy:false
                // });
                const markerOption = {
                    title:"仮想現在地",
                    alt:"位置情報を用いず、マーカーのドラッグ先を現在地とみなします",
                    // マウスを近づけると押しのけて最上位表示される
                    riseOnHover:true,
                    draggable:true,

                };
                const popupContent = '<h2>現在地マーカー</h2><br><p>マーカーは移動できます</p><button onclick="this.rem()">削除</button>';
                // 置いたらボタンスタイル変えたいけど。
                // 本当は以下のような指定微妙じゃ？

                const putLocate = L.marker(this.here,markerOption);
                putLocate.bindPopup(popupContent);
                putLocate.on('dragend', ()=>{
                    theVue.here = putLocate.getLatLng();
                    console.log(theVue.here);
                });
                map.addLayer(putLocate);
                this.lockon = true;
                this.putMarker = true;
            }
        },
        rem(){
            const map = this.$refs.map.mapObject;
            if(this.lockon&&this.putMarker){
                map.removeLayer(putLocate);
                this.lockon = false;
                this.putMarker = false;
            }
        }
    },
    mounted() {
    },
    data(){
        return{
            text:"hello",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
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
            distances:[]
            // lcoption:{
            //     setView:"once",
            // }
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

    .distance{
        color:green;
    }
}
</style>