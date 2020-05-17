<template>
    <div
    id="main"
    >
        <Map
        id="map"
        @nearStopsGroupChange="this.nearStopsGroupUpdate"
        />
        <Detail
        id="detail"
        :nearStops="this.nearStops"
        :nearStopsIsSelected="this.nearStopsIsSelected"
        :nearStopsDistances="this.nearStopsDistances"
        />
    </div>
</template>

<script>
//---------------------------------------------
import Map from './Map';
import Detail from './Detail';

export default {
    name:'Main',
    components:{ 
        Map,
        Detail,
    },
    computed:{
    },
    watch: {
    },
    methods:{
        nearStopsGroupUpdate(nearStopsGroup){
            this.nearStops=nearStopsGroup.nearStops;
            this.nearStopsIsSelected=nearStopsGroup.nearStopsIsSelected;
            this.nearStopsDistances=nearStopsGroup.nearStopsDistances;
        }
    },
    mounted() {
    },
    data(){
        return{
            nearStops:[],
            nearStopsIsSelected:[],
            nearStopsDistances:[]
        }
    }
};
</script>
<style lang="scss" scoped>
$border:1280px;
#main{
    display:grid;
    @media (min-width: $border){
        // 非モバイル
        padding-top: 5vh;
        grid-template-columns: repeat(2,1fr);
        @media(max-height:600px){
            padding-top:30px;
        }
    }
    @media (max-width: $border){
        grid-template-rows: 80vh 20vh;
    }
    
}
</style>