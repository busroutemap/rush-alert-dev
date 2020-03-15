<template>
    <l-map ref="myMap">
        <l-tile-layer v-vind:url="url"></l-tile-layer>
    </l-map>
</template>

<script>
  export default {
    mounted() {
        this.$nextTick(() => {
            this.$refs.myMap.mapObject.setView(this.center);
        });
    },
    data(){
        return{
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            zoom: 11,
            center: [35.678367, 139.763465]
        }
    }
  };
</script>
<style scoped>

</style>