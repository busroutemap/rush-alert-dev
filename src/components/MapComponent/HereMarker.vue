<template>
    <div>
        <l-marker
        :lat-lng="here"
        v-if="(lockon)&&(putMarker)"
        :options=putMarkerOption
        >
            <l-popup>
                <h2>現在地マーカー</h2>
                <p>マーカーは移動できます</p>
            </l-popup>
        </l-marker>
    </div>
</template>

<script>
import Vue from 'vue'
import { 
    LMarker,
    LPopup,
    LIcon,
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
    name:"HereMarker",
    components:{
        LMarker,
        LPopup,
        LIcon,
        latLng,
        Icon,
    },
    props:{
        putMarker:{
            type:Boolean,
            default:false
        },
        lockon:{
            type:Boolean,
            default:false
        },
        here:{
            validator:function(value){
                // latlng型かの判定
                if(isNaN(value.lat)){
                    console.log("Error! hereはlatlng型ではありません");
                    return false;
                } else{
                    console.log("Success! hereはlatlng型です");
                    console.log(value.lat,value.lng);
                    return true;
                }
            }
        },

    },
    data(){
        return{
            putMarkerOption:{
                title:"仮想現在地",
                alt:"位置情報を用いず、マーカーのドラッグ先を現在地とみなします",
                riseOnHover:true,
                draggable:false,
                opacity:0.7
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>