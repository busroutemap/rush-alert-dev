<template>
    <div>
        <p>詳細モードテスト</p>
    </div>
</template>
<script>
export default {
    name:'Detail',
}
</script>
<style scoped lang="scss">
$border:1280px;
div{
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
}
</style>