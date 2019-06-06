<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>微信小程序接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <h3>绑定微信小程序</h3>
            <p>绑定后你可以使用鲁班客服统一接收与回复顾客咨询</p>
            <Button type="success" @click="wechatAccredit">去微信平台授权绑定</Button>
        </div>
        <div class="accreditList">
            <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
        </div>
        <Spin fix size="large" v-if="showSpin"></Spin>
    </div>
</template>

<script>
import {accreditList, wechatAuth, deleteApp} from '@/libs/api';
export default {
    data(){
        return {
            showSpin:false,
            showLoading:false,
            showSetting:false,  //管理公众号
            resData:[],
            wechatToken:'',   //微信 appToken
            columnsData:[
                {
                    key: 'head_img',
                    title: '头像',
                    render:(h,params) =>{
                        return h('img',{
                            style:{
                                width:'50px',
                                height:'50px',
                                borderRadius:'25px',
                                verticalAlign: 'bottom'
                            },
                            attrs:{
                                src:params.row.head_img
                            }
                        })
                    }
                },
                {
                    key: 'nickname',
                    title: '微信名称'
                },
                {
                    key: 'source',
                    title: '接入类型'
                },
                {
                    key: 'createTime',
                    title: '接入时间'
                },
                {
                    key: 'status',
                    title: '授权',
                    render:(h,params) => {
                        var status = "已授权",
                            color = "success";
                        if(params.row.status == 0){
                            status = "未授权";
                            color = "error";
                        }
                        return h('Tag',{
                            props:{
                                color:color
                            }
                        },status)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:150,
                    render: (h, params) => {
                        return h('div',[
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.del(params.row.appToken)
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        margin: '5px'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        placement: 'top'
                                    }
                                }, '删除')
                            ]),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',      
                                },
                                on: {
                                    click: () => {
                                        if(this.$store.state.app.LUBAN_auth.indexOf("assign/:id")>-1){
                                            this.$router.push({
                                                path:`/config/assign/${params.row.appToken}`
                                            })
                                        }else{
                                            this.$Notice.warning({title: '您暂无操作权限~'});
                                        }
                                    }
                                }
                            }, '指定客服'),
                        ])
                    }
                }
            ]
        }
    },
    mounted() {
        this.init();
    },
    methods:{
        init(){
            this.showLoading = true;
            accreditList({source:1}).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //微信 接入授权
        wechatAccredit(type){
            this.$store.commit('changeLeaveWechat',true);
            this.showSpin = true;
            // 1公众号  2小程序
            wechatAuth({auth_type:2}).then(res => {
                this.showSpin = false;
                if(res.code == 0){
                    window.location.href = res.data.url;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //删除
        del(token){
            var data = {
                appToken: token,
                source: 1
            }
            deleteApp(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.init();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
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
        }
    }
</style>
