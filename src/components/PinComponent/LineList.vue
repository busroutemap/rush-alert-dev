<template functional>
    <div>
        <div
        v-for="(route,index) in props.routesInfo"
        :key="index"
        :i="index"
        >
            <div
            class="routeSymbol"
            >
                系統愛称(未実装)
            </div>
            <ul>
                <li>{{route['dc:title']}}</li>
                <li>
                <span
                v-for="operatorSameAs in route['odpt:operator']"
                :key="operatorSameAs"
                >{{operatorSameAs}}</span>
                </li>
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
    },
}
</script>

<style lang="scss" scoped>
.routeSymbol{
    border:solid 2px black;
    background-color: cadetblue;
}
</style>