<template>
  <div id="app">
    <headNav/>
    <router-view/>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
}

</style>
