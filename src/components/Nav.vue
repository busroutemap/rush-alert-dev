<template>
  <div id="app" class="">
    <nav>
      <div id="menu" class="p0 m0">
        <h1 id="title" class="item min3x">かけこみアラート</h1>
        <h1 id="m1" class="item min2x">
          <router-link to="/map" class="a">マップモード</router-link>
        </h1>
        <h1 id="m2" class="item min2x">
          <router-link to="/detail" class="a">詳細モード</router-link>
        </h1>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped>
h1{
  color:white;
  font-size:2.5vh;
}
.a{
  color:white;
  text-decoration: none;
  font-size:2vh;
}
.p0{
  padding:0px;
}
.m0{
  margin:0px;
}
.item{
  margin-top:1vh;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 0.5vh;
  padding:0.5vh;
}
.min2x{
  min-width:100px;
  max-width: 25vw;
}
.min3x{
  min-width:150px;
  max-width: 50vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  margin: 0px;
}
#menu {
  display:grid;
  background-color: darkslategray;
  /* grid-template-rows: 1fr 1fr; */
  grid-template-columns: 5fr 2fr 2fr;
  height:6vh;
}
#title{
  border: none;
}
#m1{
  /* background-color: aliceblue; */
  border-left: white solid 2px;
}
#m2{
  /* background-color: aliceblue; */
  border-left: white solid 2px;
}
</style>