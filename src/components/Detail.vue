<template>
    <div id="detail">
        <div>
            <p>現在の検索バス停数:{{this.nearStops.length}}</p>
            <div
            v-show="this.selectStops.length>0"
            >
                <p
                v-if="this.pinData instanceof Object && this.pinData.hasOwnProperty('dc:title')"
                >{{this.pinData['dc:title']}}まで{{this.selectDistance[0]}}m</p>
            </div>
            <!-- 一時的に選択バス停の0番目で対応 -->
            <!-- 将来的には複数バス停を？それとも単体？要検討 -->
            <!-- クエリで何が必要になるのか？ -->
            <button
            v-show="this.selectStops.length>0"
            @click="pushPin"
            >
                PIN
            </button>
        </div>
        <div
        class="accordion"
        :id="ac"
        >
            <Card
            v-for="(stop,i) in this.nearStops"
            :key="stop['@id']"
            :cardId="'card'+i"
            :title="stop['dc:title']"
            :parentId="ac"
            :poleNum="stop['odpt:busstopPoleNumber']"
            :routePatterns="stop['odpt:busroutePattern']"
            :i="i"
            :isSelected="nearStopsIsSelected[i]"
            />
        </div>
    </div>
</template>
<script>
import Card from './DetailComponent/Card';
export default {
    name:'Detail',
    components:{
        Card,
    },
    props:{
        nearStops:{
            type:Array,
            default:[],
            required:true
        },
        nearStopsIsSelected:{
            type:Array
        },
        nearStopsDistances:{
            type:Array,
        },
    },
    computed:{
        selectStops(){
            // nearStopsのpropsエラー
            return this.nearStops.filter((value,i)=>{
                const isSelect = this.nearStopsIsSelected[i];
                console.log(i+"番目:"+isSelect);
                if(typeof isSelect === 'boolean'){
                    if(isSelect){
                        // boolean型でtrueなら返す
                        console.log("選択バス停"+value["dc:title"]);
                        return value;
                    }
                }
            });
        },
        selectDistance(){
            return this.nearStopsDistances.filter((value,i)=>{
                const isSelect = this.nearStopsIsSelected[i];
                if(typeof isSelect === 'boolean'){
                    if(isSelect){
                        return value;
                    }
                }
            })
        },
        pinData(){
            return this.selectStops[0]
        }
    },
    methods:{
        pushPin(){
            const sameAs = this.selectStops[0]["owl:sameAs"];
            this.$router.push({
                // 以下だとこうなる
                // http://localhost:8080/pin/odpt.BusstopPole:Toei.Shinhamakawabashi.735.1?plan=private
                path: `/pin/${sameAs}`,
                query: {
                    here: '',
                    pinRoutes:'',
                }
            })
        }
    },
    data(){
        return{
            ac:"accordionExample"
        }
    }
}
</script>
<style scoped lang="scss">
$border:1280px;
#detail{
    background-color: #EEEEEE;
    border: solid 1px #000000;
    @media (min-width: $border){
        // 基準値よりも画面サイズが大きい
        width:50vw;
        height:95vh;
    }
    @media (max-width: $border){
        // 基準値よりも画面サイズが小さい
        width:100%;
        height:100%;
    }
    overflow:auto;
}
</style>