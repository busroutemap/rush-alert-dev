<script>
/**
 * UserCard.vue
 * 表示情報
 * 1. 目的地までの残りm
 * 2. 
 * 
 */
</script>
<template>
    <div>
        <h2>利用者情報</h2>
        <p>目的地まで残り</p>
        <p>{{predictUserMinues}}分</p>
        <p>(距離 : {{distances}} m)</p>
    </div>
</template>

<script>
export default {
    name:"UserCard",
    props:{
        predictTripTime:{
            type:Date
        },
        userSpeed:{
            // 毎分m
            type:Number
        },
        distances:{
            // m
            type:Number
        },
    },
    computed:{
        predictUserMinues(){
            return Math.round(distances/userSpeed);
        }
    },
}
</script>

<style lang="scss" scoped>

</style>