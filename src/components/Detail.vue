<template>
    <div id="detail">
        <div
        class="accordion"
        :id="ac"
        >
            <Card
            v-for="(stop,i) in nearStops"
            :key="stop['@id']"
            :cardId="'card:'+i"
            :title="stop['dc:title']"
            :parentId="ac"
            :poleNum="stop['odpt:busstopPoleNumber']"
            :routeName="stop['odpt:busroutePattern']"
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
            type:Array
        },
        nearStopsIsSelected:{
            type:Array
        },
        nearStopsDistances:{
            type:Array,
        },
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