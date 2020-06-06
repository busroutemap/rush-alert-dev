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
                // 後々変えないといけない
                // splice(開始位置、取り除く要素数、追加する要素内容)
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
            this.pinStop = await Promise.all(pAll)
            .catch(e=>{
                console.log(e);
            })
            .then(r=>{
                return r[0];
            });
        },
        /**
         * getNearStops : (c) 周辺停留所情報
         * これはまるごとMap/nearstopと同じなので、将来APIにまとめる
         * 将来的には、lat,lngを引数にしたほうが良い……
         */
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
        /**
         * getRoutesData : (d)その他系統情報
         * 停留所に関わる一般的な情報を取得する
         * 基本は(a)の戻り値を引数に取る？またはVueのdataから？
         * @param routeSameAsArray {Array} 取得してきたい系統の別名配列。
         * @returns {Array} BusroutePattern配列。通常はこの関数の戻り値をthis.linesDataに代入する。
         * 失敗した場合、何もない配列を返す
         */
        getRoutesData(routeSameAsArray){
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
            // 
        }
    }
}
</script>
<style lang="scss" scoped>

</style>