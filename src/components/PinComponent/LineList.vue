<template functional>
    <div>
        <div
        v-for="(route,index)in routesInfo"
        :key="route['@id']"
        :i="index"
        >
            <div
            class="routeSymbol"
            >
                系統愛称(未実装)
            </div>
            <ul>
                <li>{{route['dc:title']}}</li>
                <li
                v-for="operatorSameAs in route['odpt:operator']"
                :key="operatorSameAs"
                >{{operator(operatorSameAs)}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:"LineList",
    props:{
        routesInfo:{
            type:Array
        },
        operators:{
            type:Array
        }
    },
    computed:{
        operator(sameAs){
            const aimData = operators.find(obj=>{
                returnobj["owl:sameAs"]===sameAs
            })
            return aimData["dc:title"];
        }
    },
}
</script>

<style lang="scss" scoped>
.routeSymbol{
    border:solid 2px black;
    background-color: cadetblue;
}
</style>