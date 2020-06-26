<script>
/**
 * Headband
 * 上部メイン表示バー
 * 
 * 必要な情報は下記の通り
 * 
 * 1. 停留所情報
 *     - 停留所名称
 *     - 乗り場ポール番号
 * 2. 選択系統情報
 *     - 系統愛称
 *     - 系統名称
 *     - 行き先表示
 * 3. 取得情報
 *     - 現在時刻
 * 
 * (要検討)
 * 1. 将来的に系統番号の一覧もここに持っていきたい
 * 2. operatorはsameAsなので、ここからgetする必要がある
 * 
 */
</script>
<template functional>
    <div>
        <div class="cent">
            <h1>{{props.stopName}}</h1>
            <h2>{{props.stopSubName}}</h2>
            <span
            v-for="(route,index) in props.routesInfo"
            :key="index"
            >{{route['dc:title']}}</span>
            <p class="bold">現在時刻 : (時刻未実装)</p>
            <div
            v-for="(route, index) in props.pinRoutesInfo"
            :key="route['@id']"
            :i="index"
            :routeName="route['dc:title']"
            :routeDirection="route['odpt:direction']"
            :routeNote="route['odpt:note']"
            >
                <h3>{{routeName}}</h3>
                <p
                v-for="operator in route['odpt:operator']"
                :key="operator"
                ><span>{{operator}}</span></p>
                <p>{{routeDirection}}</p>
                <p>{{routeNote}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"HeadBand",
    props:{
        stopName:{
            type:String,
            default:"停留所名"
        },
        stopSubName:{
            type:String,
            default:"停留所副名称"
        },
        routesInfo:{
            type:Array
        },
        time:{
            type:String
        },
        pinRoutesInfo:{
            type:Array
        }
    },
    computed:{
        // time(){
        //     return new Date().getHours().toString()
        // },
    },
}
</script>

<style lang="scss" scoped>
.bold{
    font-weight: bold;
}
.cent{
    margin-top:10vh;
    background-color:#1f87e2;
    h1{
        font-size: 5em;
        border-bottom:solid white 5px;
        background-color: #50FF50;
    }
    h2{
        font-size:2em;
    }
}
</style>