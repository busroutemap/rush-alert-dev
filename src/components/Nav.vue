<template>
    <div id="app" class="container">
        <nav class="navbar navbar-expand-md navbar-dark bg-dark">
            <router-link
            to="/"
            class="navbar-brand">かけこみアラート</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <!-- コピペ感著しいので、必要に応じて後でカスタマイズすること -->
            <div class="collapse navbar-collapse" id="navbarsExample04">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link
                        to="/"
                        class="nav-link">HOME</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/map" class="nav-link">マップモード</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/detail" class="nav-link">詳細モード</router-link>
                    </li>
                </ul>
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
.a{
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

</style>