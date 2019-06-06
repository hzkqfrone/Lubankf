<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>微信消息通知</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <h3>Step1:关注微信公众号</h3>
            <p>微信搜索关注“鲁班智服”公众号，或扫描下方二维码添加关注</p>
            <div class="erweima">
                <img src="../../../../images/accounts.jpg">
            </div>
        </div>
        <div style="border-top:1px dashed #d8d8d8;"></div>
        <div class="binding">
            <h3>Step2:授权微信消息通知</h3>
            <p>添加关注“鲁班智服”公众号之后，再次使用微信扫描下方二维码，用以授权微信接收消息通知，授权后你可以直接使用微信统一接收与回复顾客咨询</p>
            <div class="erweima">
                <img :src="wechatImg">
            </div>
        </div>
    </div>
</template>

<script>
import {qrcode} from '@/libs/api';
export default {
    data(){
        return {
            wechatImg:''    
        }
    },
    mounted() {
        qrcode().then(res => {
            if(res.code == 0){
                this.wechatImg = res.data.qrcode;
            }
        })
    },
    methods:{
       
    }
}
</script>
<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
        .accreditList{
            margin-top:20px;
        }
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
        .erweima{
            width:192px;
            height:192px;
            background:url(../../../../images/erweimaBG.png) no-repeat center;
            text-align: center;
            box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
        }
        img{
            width:130px;
            height:130px;
            margin-top:31px;
        }
    }
</style>
