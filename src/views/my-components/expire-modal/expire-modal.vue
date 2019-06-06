<template>
    <!-- 试用期到期提示 -->
    <Modal v-model="isExpire" class="tapeOutMoadl" 
        title="客服账号试用期到期提醒"
        :mask-closable="false"
        :closable="false"
        width=440>
        <p class="title">您的试用已过期，请尽快购买。您可选择直接在线购买，如果您已线下支付，请联系商务为您升级正式版。如有疑问，请到官网点击商务咨询。</p>
        <div slot="footer">
            <Button @click="loginOut">退出登录</Button>
            <Button type="primary" @click="pay" v-if="showPay">去支付</Button>
        </div>
    </Modal>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data(){
        return{
            isExpire: false,
            showPay: false,
        }
    },
    computed: {
        ...mapState({
            isResponse: state => state.app.isExpire,
        })
    },
    created() {
        if(this.$store.state.app.serviceInfo.role_id == 0){
            this.showPay = true;
        }
    },
    methods:{
        pay(){
            this.isExpire = false;
            this.$router.push({
                path: '/pay'
            })
        },

        loginOut(){
            this.$emit('loginOut');
        }
    },
    watch: {
        isResponse(n, o){
            this.isExpire = n;
        }
    },
}
</script>
<style lang="less" scoped>
    .title{
        line-height: 26px;
    }
</style>
