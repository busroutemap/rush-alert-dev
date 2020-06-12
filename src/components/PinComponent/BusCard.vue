<script>
/**
 * BusCard.vue
 * 
 */

</script>

<template functional>
    <div>
        <h1>(ここに何分後発車か予測し表示)</h1>
        <h2>定刻 : {{scheduleTime}}</h2>
        <h3>遅延 : {{delayMinutes}} 分 </h3>
        <p>データ取得日時 : {{DataSourceTime}}</p>
    </div>
</template>

<script>
export default {
    name:"BusCard",
    props:{
        headName:{
            type:String
        },
        scheduleTime:{
            type:String
            // Date型で受け取る、とかできるのかな……
        },
        delayMinutes:{
            type:Number
        },
        DataSourceTime:{
            type:String
        }

    },
    computed:{

    },
}
</script>

<style lang="scss" scoped>

</style>