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
        <h1>{{stopName}}</h1>
        <h2>{{stopSubName}}</h2>
        <span>[系統をここに一覧表示](未実装)</span>
        <p class="bold">現在時刻 : {{time}}</p>
        <div
        v-for="(route, index) in routesInfo"
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
</template>

<script>
export default {
    name:"HeadBand",
    props:{
        stopName:{
            type:String
        },
        stopSubName:{
            type:String
        },
        routesInfo:{
            type:Array
        }
    },
    computed:{
        time(){
            return new Date().getHours().toString()
        },

    },
}
</script>

<style lang="scss" scoped>
.bold{
    font-weight: bold;
}
</style>