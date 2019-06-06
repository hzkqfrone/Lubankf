<template>
    <div class="emojiContent">
        <Tooltip content="表情" placement="top">
            <a href="javascript:;" class="emoji" @click="showEmoji">
                <div class="emojiWrap" v-show="showIcon">
                    <em v-for="(item,index) in emojiJson" @click="selectIcon(index)" :title="item.cn" :style="{backgroundPositionY:''+index * -24+'px'}"></em>
                </div>
            </a>
        </Tooltip>
    </div>
</template>
<script>
import {smohanFace} from '@/views/my-components/emoji/emoji';
export default {
    props:['isShowIcon'],
    data(){
        return {
            emojiJson:[],  //emoji json
            showIcon:'',
        }
    },
    created(){
        this.emojiJson = smohanFace;
        this.showIcon = this.isShowIcon;
    },
    methods:{
        //显示表情
        showEmoji(){
            this.showIcon = !this.showIcon;
        },

        //选择表情
        selectIcon(index){
            this.$emit('selectEmoji',this.emojiJson[index].cn)
        },
    },
    watch:{
        isShowIcon(n,o){
            this.showIcon = false;
        }
    }
}
</script>
<style lang="less">
    .emojiContent{
        position: absolute;
        top: 5px;
        right:5px;
        z-index: 1000;
        .emoji{
            display: inline-block;
            width:22px;
            height:22px;
            background:url(../../../images/emoji.png) no-repeat center;
        }
        .emojiWrap{
            width:400px;
            height:220px;
            overflow-x: auto;
            border:1px solid #e5e5e5;
            position: absolute;
            bottom:-225px;
            left:-180px;
            background:#fff;
            padding:10px;
            box-shadow: 0 2px 10px 2px #ccd5d8;
            z-index: 100;
            em{
                width:24px;
                height:24px;
                display: inline-block;
                background:url(../../../images/face/emoji.png);
                background-position-x:0px;
                margin:5px;
            }
        }
    }
</style>
