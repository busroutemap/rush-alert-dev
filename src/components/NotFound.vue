<template>
  <div>
    <p>{{text}}</p>
    <p>{{introduction}}</p>
  </div>
</template>
<script>
export default {
  name:'NotFound',
  data(){
    return{
      text:"適切なモードを選択してください",
      introduction:"かけこみアラートとは？という説明をします"
    }
  }
}
</script>
<style scoped>

</style>