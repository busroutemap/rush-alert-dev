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
            
        })
    },
    methods:{
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
            // 本当は事前許可を求めたほうが良い……
            if ("geolocation" in navigator) {
                navigator.geolocation.watchPosition(_success,_error,_options);
            }
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