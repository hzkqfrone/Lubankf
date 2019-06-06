<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>小程序授权登录</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <h3>小程序授权</h3>
            <p>微信搜索“即时对话系统”小程序，使用小程序内<span> [ 左上方扫码工具：<em class="saoIcon"></em> ] </span>扫描下方二维码进行授权登录</p>
            <div class="erweima">
                <img :src="programImg">
            </div>
            <p><span class="pour">注:</span>首次使用小程序端登录的用户，需要先给小程序扫码授权</p>
        </div>
        <div style="border-top:1px dashed #d8d8d8;"></div>
        <div class="binding">
            <h3>使用微信账号快捷登录</h3>
            <p>完成小程序授权之后，再次登录即时对话系统小程序时，就可以<span> [ 使用微信账号快捷登录 ] </span>方式登录，无需输入账号密码，一键登录，快捷方便</p>
            <div class="program_info"></div>
        </div>
    </div>
</template>

<script>
import {programQrcode} from '@/libs/api';
export default {
    data(){
        return {
            programImg: ''
        }
    },
    mounted() {
        programQrcode().then(res => {
            if(res.code == 0){
                this.programImg = res.data.qrcode;
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
            span{
                color:#9fa8bc;
                .saoIcon{
                    width:30px;
                    height:30px;
                    display: inline-block;
                    background: url(../../../../images/saoyisao.png) no-repeat center;
                    vertical-align:middle;
                    margin-right:2px;
                }
            }
            span.pour{
                color:#ff6347;
            }
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
        .program_info{
            width:320px;
            height:250px;
            background:url(../../../../images/program_author.png) no-repeat center;
            box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
        }
    }
</style>
