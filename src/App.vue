<template>
  <div
  id="app"
  >
    <headNav
    class="hn"
    />
    <router-view
    class="main"
    />
  </div>
</template>
<script>
import headNav from './components/Nav'
export default {
  mounted(){
  },
  components:{
    headNav
  }
}
</script>
<style lang="scss" scoped>
$border:1280px;
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // width:100vw;
  // height:100vh;
}
.hn{
  @media (min-width: $border){
    // 基準値よりも画面サイズが大きい
    height:5vh;
    @media(max-height:600px){
      height:30px;
    }
  }
}
</style>
