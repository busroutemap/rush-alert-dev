<template>
  <div id="app">
    <nav>
      <div id="menu" class="pm0">
        <h1 id="title" class="m10">かけこみアラート</h1>
        <h1 id="m1" class="m10"><a href="/map" class="a">マップモード</a></h1>
        <h1 id="m2" class="m10"><a href="/detail" class="a">詳細モード</a></h1>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
h1{
  color:white;
  font-size:20px;
}
.a{
  color:white;
  text-decoration: none;
  font-size:15px;
}
.pm0{
  padding:0px;
  margin:0px;
}
.m10{
  margin:10px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}
#menu {
  display:grid;
  background-color: darkslategray;
  grid-template-areas: "title m1 m2";
  /* grid-template-rows: 1fr 1fr; */
  grid-template-columns: 25% 10% 10%;
}
#title{
  grid-area:"title";
  border-right: white solid 2px;
}
#m1{
  grid-area: "m1";
  /* background-color: aliceblue; */
  border-right: white solid 2px;
}
#m2{
  grid-area: "m2";
  /* background-color: aliceblue; */
  border-right: white solid 2px;
}
</style>
