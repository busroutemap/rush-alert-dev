<template>
    <div>
        <l-control
        position="bottomleft">
                <button @click="put">マーカーでの現在地指定</button>
                <button @click="rem">削除</button>
        </l-control>
    </div>
</template>

<script>
import Vue from 'vue'
import { 
    LMarker,
    LPopup,
    LIcon,
    LControl
    } from 'vue2-leaflet';
import { 
    latLng,
    Icon 
    } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default{
    name:"MapControl",
    components:{
        LMarker,
        LPopup,
        LIcon,
        latLng,
        Icon,
        LControl
    },
    props:{
        putMarker:{
            type:Boolean,
            // default:false
        },
        lockon:{
            type:Boolean,
            // default:false
        },
    },
    methods:{
        put(){
            // const map = this.$refs.map.mapObject;
            if((!this.lockon)&&(!this.putMarker)){
                // 現在地指定なく、かつマーカーないなら
                this.$emit("hereChange");
                // this.here = map.getCenter();
                // 自作Llocate作るなら以下？
                // map.locate({
                //     watch:true,
                //     setView:true,
                //     // 高性能モードはオフ
                //     enableHighAccuracy:false
                // });
                this.$emit("lockChange");
                this.$emit("putMarkerChange");
                // this.lockon = true;
                // this.putMarker = true;
            }
        },
        rem(){
            // const map = this.$refs.map.mapObject;
            if(this.lockon&&this.putMarker){
                this.$emit("lockChange");
                this.$emit("putMarkerChange");
            }
        },
    },
    data(){
        return{

        }
    }
}
</script>

<style lang="scss" scoped>

</style>