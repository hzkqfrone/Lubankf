<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>PC授权登录</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <h3>PC授权微信登录</h3>
            <p>授权微信账号登录PC端“鲁班客服”</p>
            <Button type="success" @click="wechatAccredit">去微信平台授权绑定</Button>
            <p><span class="pour">注:</span>不进行PC授权的，只能使用输入账号密码的方式登录，<span class="hint"> [ 无法使用微信扫码直接登录 ]</span></p>
        </div>
        <div style="border-top:1px dashed #d8d8d8;"></div>
        <div class="binding">
            <h3>使用微信登录</h3>
            <p>PC授权微信账号之后，PC端再次登录时，就可以使用<span class="hint"> [ 微信登录 ] </span>方式登录，无需输入账号密码，一键登录，快捷方便</p>
            <div class="pcLogin_info"></div>
        </div>
    </div>
</template>

<script>
import {accreditList, wechatAuth} from '@/libs/api';
export default {
    methods:{
       wechatAccredit(){
           window.open(`${this.$store.state.app.LUBAN_URL}site/wechat-login.htm?type=shouquan&Access-Token=${sessionStorage.access_token}`);
       }
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
            span.pour{
                color:#ff6347;
            }
            span.hint{
                color:#9fa8bc;
            }
        }
        .pcLogin_info{
            width:330px;
            height:265px;
            background:url(../../../../images/pc_author.png) no-repeat center;
            box-shadow: 0 0 6px 0 rgba(0,0,0,.15);
        }
    }
</style>
