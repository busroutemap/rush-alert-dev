<template>
    
</template>
<script>
export default {
    name:"Pin",
    props:{

    },
    components:{

    },
    mounted:function(){
        this.$nextTick(()=>{
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
            this.pinStop = this.getThePoiData(this.poiSameAs);
            this.allTimeTables = this.getTimeTablePoiAndTrip(this.poiSameAs,this.allRoutesSameAs)
            // (c)※速度遅いがpromise allを別で行う
            this.nearStops = this.getNearStops(userLocationData.lat,userLocationData.lng);
            // (d)
            this.linesData = this.getRoutesData(this.allRoutesSameAs);
        })
    },
    computed:{
        /**
         * poiSameAs : バス停の別名。URLで1つ指定。
         */
        poiSameAs(){
            const sameAs = new String(this.$route.params.poiSameAs);
            return sameAs;
        },
        /**
         * pinRoutesSameAs : クエリで受け取った選択系統別名配列
         */
        pinRoutesSameAs(){
            const q = this.$route.query.pinRoutes;
            if(Array.isArray(q)){
                const sameAsArray = new Array(q);
                return sameAsArray;
            } else if (q!==""){
                return [q];
            } else {
                console.log("系統指定クエリが無効です");
                const dummy = [];
                return dummy;
            }
        },
        /**
         * allRoutesSameAs : 該当停留所の別名
         */
        allRoutesSameAs(){
            return this.pinStop["odpt:busroutePattern"];
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
         * @param thePoiSameAs {String} 情報が欲しい停留所のsameAs
         * @return {Object} 該当停留所の情報
         */
        async getThePoiData(thePoiSameAs){
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
            // 該当停留所を探す
            const vaot = process.env.VUE_APP_odpt_token;
            pAll.push(loadjson(`odpt:BusstopPole?owl:sameAs=${thePoiSameAs}&acl:consumerKey=${vaot}`));
            return await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
                return {};
            })
            .then(r=>{
                return r[0];
            });
        },
        /**
         * getTimeTablePoiAndTrip : (b)選択停留所と選択系統の停留所&便時刻表を取得する
         * 複雑になるので、これは別で今回作成
         * @param poiSameAs {String}
         * @param routeSameAsArray {Array}
         * @return result {Array} 選択系統ごとの配列、[poiTimeTable(Array),tripTimeTable(Array)]がそれぞれ含まれる
         */
        async getTimeTablePoiAndTrip(poiSameAs,routeSameAsArray){
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
            //---------------------------------------------
            let pAll = [];
            // ひとまずエリア内のバス停を探す
            const vaot = process.env.VUE_APP_odpt_token;
            const rsaa = routeSameAsArray;
            rsaa.forEach(value=>{
                // 各選択系統ごとに、該当停留所の時刻表と、系統の時刻表を取得する
                pAll.push([
                    loadjson(`odpt:BusstopPoleTimetable?odpt:busstopPole=${poiSameAs}&odpt:busroutePattern=${value}&acl:consumerKey=${vaot}`),
                    loadjson(`odpt:BusTimeTable?odpt:busroutePattern=${value}&acl:consumerKey=${vaot}`)
                ]);
            })
            return await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
            })
            .then(r=>{
                return r;
            });
            //---------------------------------------------
        },
        /**
         * getNearStops : (c) 周辺停留所情報
         * MapのNearStiosとは多少違う(引数や戻り値周辺)
         * @param {Number} lat
         * @param {Number} lng
         * @return {Array} nearStops
         */
        async getNearStops(lat,lng){
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
            if(lat==null||lng==null){
                const nlat = this.pinStop["geo:lat"];
                const nlng = this.pinStop["geo:long"];
            } else{
                const nlat = lat;
                const nlng = lng;
            }
            // ひとまずエリア内のバス停を探す
            const vaot = process.env.VUE_APP_odpt_token;
            pAll.push(loadjson(`places/odpt:BusstopPole?lat=${nlat}&lon=${nlng}&radius=${this.radius}&acl:consumerKey=${vaot}`));
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
         * 停留所に関わる一般的な情報を取得する
         * 基本は(a)の戻り値を引数に取る？またはVueのdataから？
         * @param routeSameAsArray {Array} 取得したい系統の別名配列。
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
            if(Array.isArray(rsaa)&&rsaa!==[]){
                let pAll = [];
                // 系統データを取得する
                const vaot = process.env.VUE_APP_odpt_token;
                rsaa.forEach(e=>{
                    pAll.push(loadjson(`odpt:BusroutePattern?owl:sameAs=${e}&acl:consumerKey=${vaot}`));
                });
                return await Promise.all(pAll)
                .catch(e=>{
                    console.log("NetWork API Error!");
                    return [];
                })
                .then(r=>{
                    return r;
                });
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
        }
    },
    data(){
        return{
            // 選択中の停留所情報
            pinStop:{},
            // 選択中の系統情報
            pinLine:{},
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
            allTimeTables:[]
        }
    }
}
</script>
<style lang="scss" scoped>

</style>