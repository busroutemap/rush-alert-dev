<template>
    <div
    class="card"
    >
        <div
        class="card-header"
        :id="this.headerId"
        >
            <button
            class="btn btn-link btn-block text-left collapsed"
            type="button"
            data-toggle="collapse"
            :data-target="'#'+this.bodyId"
            aria-expanded="false"
            :aria-controls="this.bodyId"
            >
                {{this.title}}
            </button>
        </div>
        <!-- 
            - aria-labelledby
                - ただの関連付け指定(hrefで代替可能)
            - aria-expand
                - 開閉状態
            - data-toggle="collapse"
                - これを指定したものの状態を切り替える
            - aria-controls
                - 開閉対象
        -->
        <div
        :id="this.bodyId"
        class="collapse card-body"
        :data-parent="'#'+this.parentId"
        >
            <p>選択バス停:{{this.title}}</p>
        </div>
    </div>
</template>
<script>

export default {
    name:'Card',
    computed:{
        headerId:function(){
            return this.cardId+"_header";
        },
        bodyId:function(){
            return this.cardId+"_body";
        },
    },
    props:{
        title:{
            type:String,
            default:"タイトル"
        },
        cardId:{
            type:String,
            required:true
        },
        parentId:{
            type:String,
            required:true
        }
    },
    data(){
        return{

        }
    }
}
</script>
<style scoped lang="scss">

</style>