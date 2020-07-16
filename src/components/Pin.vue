<template>
    <div>
        <Headband
        :stopName="this.pinStop['dc:title']"
        :stopSubName="this.pinStop['dc:title']"
        :routesInfo="this.linesData"
        :pinRoutesInfo="this.pinRoutesData"
        />
        <UserCard/>
        <!-- 前の便、次の便、おすすめ便ボタンを追加する -->
        <BusCard/>
        <PetitMap
        :poiLatLng="this.pinLatLng"
        />
        <LineList
        :operators="this.operators"
        :routesInfo="this.linesData"
        />
    </div>
</template>
<script>
import Headband from './PinComponent/Headband';
import UserCard from './PinComponent/UserCard';
import BusCard from './PinComponent/BusCard';
import PetitMap from './PinComponent/PetitMap';
import LineList from './PinComponent/LineList';

export default {
    name:"Pin",
    props:{

    },
    components:{
        Headband,
        UserCard,
        BusCard,
        PetitMap,
        LineList
    },
    mounted:function(){
        setInterval(this.checkTime(),3000);
        this.$nextTick(async()=>{
            // 描画されたら次のことを行う
            // (a)該当停留所情報の取得
            //  ↓
            // (c)周辺停留所情報
            //     nearStopを呼び出す
            // (d)その他系統情報
            //    該当停留所の全系統の情報を取得
            //  ↓
            // (b)選択系統情報
            //    選択済み系統の情報は、細かく情報を取得
            //    時刻、遅延情報、IC利用？、今日のダイヤ情報？
            //    何停留所前か、
            //---------------------------------------------
            // (a)
            this.pinStop = (await this.getThePoiData(this.poiSameAs))[0];
            this.allTimeTables = await this.getTimeTablePoiAndTrip(this.poiSameAs,this.allRoutesSameAs)
            // (c)※速度遅いがpromise allを別で行う
            this.nearStops = await this.getNearStops(this.pinLatLng[0],this.pinLatLng[1]);
            console.log(this.nearStops);
            // (d)
            this.linesData = (await this.getRoutesData(this.allRoutesSameAs))[0];
        })
    },
    computed:{
        /**
         * poiSameAs : バス停の別名。URLで1つ指定。
         */
        poiSameAs(){
            return this.$route.params.poiSameAs;
        },
        /**
         * pinRoutesSameAs : クエリで受け取った選択系統別名配列
         */
        pinRoutesSameAs(){
            const q = this.$route.query.pinRoutes;
            if(Array.isArray(q)){
                const sameAsArray = new Array(q);
                return sameAsArray;
            } else {
                console.log("系統指定クエリが無効です");
                const a = this.allRoutesSameAs;
                console.log("指定系統:"+a);
                return [a[0]];
            }
        },
        /**
         * allRoutesSameAs : 該当停留所の別名
         */
        allRoutesSameAs(){
            const bp = this.pinStop["odpt:busroutePattern"];
            console.log("bp!")
            console.log(bp)
            return bp;
        },
        pinLatLng(){
            let lat = 35.55;
            let lng = 139.8;
            if(this.pinStop.hasOwnProperty("geo:lat")){
                lat = this.pinStop["geo:lat"];
                lng = this.pinStop["geo:long"];
            }
            return [lat,lng];
        },
        operators(){
            let operators = [];
            if(this.pinStop.hasOwnProperty("odpt:operator")){
                operators = this.pinStop["odpt:operator"];
            }
            return operators;
        },
        pinRoutesData(){
            const pins = this.pinRoutesSameAs;
            const arr = this.linesData.filter(value=>{
                return pins.includes(value["owl:sameAs"]);
            });
            return arr;
        }
    },
    watch:{
        // 利用者のロケーション情報が変わったら、平均も変わる
        // computedに？
        // 1分平均でデータの欠落はカウントしない
        // userLocationData(oldValue,newValue){
        // }
    },

    methods:{
        checkTime(){
            this.now = new Date();
        },
        /**
         * getLocation : (1)リアルタイム利用者情報
         */
        getLocation(){
            /**
             * _success:成功時のコールバック関数
             * position.coordsはGeolocationCoordinatesインターフェースを実装したオブジェクト
             * .latitude : double型10進数
             * .longitude : double型10進数
             * .accuracy : 精度。double型10進数
             * .speed : 移動速度(m/s)、nullも許容
             * 
             */
            const _success = (position)=>{
                const c = position.coords;
                this.userLocationData.lat = c.latitude;
                this.userLocationData.lng = c.longitude;
                this.userLocationData.ac = c.accuracy;
                this.userLocationData.speed = c.speed;
            }
            // エラー時のコールバック関数
            const _error = ()=>{
                alert("位置情報取得に失敗しました");
            }
            // オプション設定
            const _options = {
                enableHighAccuracy: true,
                maximumAge : 30000,
                timeout : 27000
            }
            // 本当は利用者に事前許可を求めたほうが良い……
            if ("geolocation" in navigator) {
                navigator.geolocation.watchPosition(_success,_error,_options);
            }
        },
        /**
         * getThePoiData : (a)該当停留所情報
         * @param {String} thePoiSameAs  情報が欲しい停留所のsameAs
         * @return {Object} 該当停留所の情報
         */
        getThePoiData(thePoiSameAs){
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
            // 該当停留所を探す
            const vaot = process.env.VUE_APP_odpt_token;
            const wishList = [
                `odpt:BusstopPole?owl:sameAs=${thePoiSameAs}&acl:consumerKey=${vaot}`
            ];
            return loadjson(wishList[0]);
        },
        /**
         * getTimeTablePoiAndTrip : (b)選択停留所と選択系統の停留所&便時刻表を取得する
         * 複雑になるので、これは別で今回作成
         * @param {String} poiSameAs
         * @param {Array} routeSameAsArray
         * @return {Array} 選択系統ごとの配列、[poiTimeTable(Array),tripTimeTable(Array)]がそれぞれ含まれる
         */
        getTimeTablePoiAndTrip(poiSameAs,routeSameAsArray){
            // カレンダー別名(odpt:Calendarのowl:sameAs)
            // 路線別名
            // 方面別名
            // あたりも追加で必要
            // ただ、カレンダーってどう取得する？
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
            const getData = async (urls)=>{
                return Promise.all(urls.map(addURL=>{
                    return loadjson(addURL);
                }));
            }
            //---------------------------------------------
            let pAll = [];
            // ひとまずエリア内のバス停を探す
            const vaot = process.env.VUE_APP_odpt_token;
            const rsaa = routeSameAsArray;
            const wishList = rsaa.map(value=>{
                return [
                `odpt:BusstopPoleTimetable?odpt:busstopPole=${poiSameAs}&odpt:busroutePattern=${value}&acl:consumerKey=${vaot}`,
                `odpt:BusTimeTable?odpt:busroutePattern=${value}&acl:consumerKey=${vaot}`
                ]
            });
            const res = getData(wishList);
            return res;
            //---------------------------------------------
        },
        /**
         * getNearStops : (c) 周辺停留所情報
         * @description MapのNearStiosとは多少違う(引数や戻り値周辺)
         * @param {Number} lat
         * @param {Number} lng
         * @return {Array} nearStops
         */
        async getNearStops(lat,lng){
            /**
             * loadjson : opdtのAPIからjsonをfetchする
             * @param {String} addURL 追加URL(v4/追加URLとfetchしてくる)
             * @returns {Array} jsonデータの配列
             */
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
            let nlat;
            let nlng;
            if(lat==null||lng==null){
                nlat = this.pinStop["geo:lat"];
                nlng = this.pinStop["geo:long"];
            } else{
                nlat = lat;
                nlng = lng;
            }
            // ひとまずエリア内のバス停を探す
            const vaot = process.env.VUE_APP_odpt_token;
            pAll.push(loadjson(`places/odpt:BusstopPole?lat=${nlat}&lon=${nlng}&radius=${this.radius}&acl:consumerKey=${vaot}`));
            console.log("getNearStops");
            return await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
            })
            .then(r=>{
                return r[0];
            });
            //---------------------------------------------
        },
        /**
         * getRoutesData : (d)その他系統情報
         * @summary 停留所に関わる一般的な情報を取得する
         * 基本は(a)の戻り値を引数に取る？またはVueのdataから？
         * @param {Array} routeSameAsArray 取得したい系統の別名配列。
         * @return {Array} BusroutePattern配列。通常はこの関数の戻り値をthis.linesDataに代入する。
         * 失敗した場合、何もない配列を返す
         */
        async getRoutesData(routeSameAsArray){
            const rsaa = routeSameAsArray;
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
            const getData = async (urls)=>{
                return Promise.all(urls.map(addURL=>{
                    return loadjson(addURL);
                }));
            }
            console.log("途中経過getRoutesData")
            if(Array.isArray(rsaa)&&rsaa!==[]){
                let pAll = [];
                // 系統データを取得する
                const vaot = process.env.VUE_APP_odpt_token;
                // rsaa.forEach(e=>{
                //     pAll.push(loadjson(`odpt:BusroutePattern?owl:sameAs=${e}&acl:consumerKey=${vaot}`));
                // });
                const p = [
                    `odpt:BusroutePattern?owl:sameAs=${rsaa}&acl:consumerKey=${vaot}`
                ]
                console.log("getRoutesDataのpromise:"+p);
                return getData(p);
            } else{
                console.log("sameAsArray Error!");
                return [];
            }
        },
        /**
         * getRealTimeTripData : (2)便情報
         * (a)+(b)+(ア)から算出
         * 次便や、利用者情報に基づく推奨便のデータの取得
         * 行き先・時刻や、遅延情報など
         */
        getRealTimeTripData(){
            // え、次便ってどう判定するの？？？？？？
            // 曜日はひとまず、以下のように判定
            //---------------------------------------------
            // 今日の曜日数字(0-6で0が日曜日)
            const day = new Date().getDay();
            if(this.isHoliday(day)){
                // 土休日ダイヤの動作
            } else{
                // 平日ダイヤの動作
            }
            //---------------------------------------------
            // 運行情報がある便は、既に通過しているかどうかで判定
            // 運行情報がない便は、時刻から判定
            // おすすめ便は、現在時刻＋利用者の到着予想を判定
            // 利用者の歩行速度予想に上限を設ける
            // その上でバス到着予想を行い、間に合う便をひとまず選択？
            // バス到着予想はひとまず、ダイヤ上から予測する
            // できれば過去の実績を保存したり、ダイヤから客観的に分析できるとなおよし
        },
        
        getNextTrip(routeSameAsArray){
            const rsaa = routeSameAsArray;
            const day = new Date().getDay();
            if(this.isHoliday(day)){
                // 土休日ダイヤの動作
            } else{
                // 平日ダイヤの動作
            }
        },
        /**
         * isHoliday
         * @summary isHoliday(new Date().getDay())で今日が土休日かどうか返す
         * @description 将来的にはAPIでダイヤ判定を細かく行う
         * @param {Number} dayNum 0-6までの、曜日を示す番号。0は日曜日、6は土曜日
         */
        isHoliday(dayNum){
            const holiday = [0,6];
            return holiday.includes(day);
        },
    },
    data(){
        return{
            now:new Date(),
            // 選択中の停留所情報
            pinStop:{},
            // 選択中の系統情報
            // pinRoutesData:[],
            // 利用者の情報
            userLocationData:{
                lat:null,
                lng:null,
                ac:null,
                speed:null
            },
            // 停留所の系統情報
            linesData:[],
            // 周辺停留所情報
            nearStops:[],
            // 系統ごとの停留所・便時刻データ集(膨大)
            // データ構造は再検討した方が好ましい
            allTimeTables:[],
            radius:400
        }
    }
}
</script>
<style lang="scss" scoped>

</style>