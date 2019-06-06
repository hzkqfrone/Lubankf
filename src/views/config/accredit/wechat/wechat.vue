<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>微信公众号接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div v-if="!showError">
            <div class="binding">
                <h3>绑定微信公众号</h3>
                <p>绑定后你可以使用鲁班客服统一接收与回复顾客咨询</p>
                <Button type="success" @click="wechatAccredit">去微信平台授权绑定</Button>
            </div>
            <div class="accreditList">
                <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
            </div>
        </div>
        <div class="unusual" v-if="showError">
            <em></em>
            <Icon type="md-close" @click="backConfig"/>
            <p>{{$route.query.message}}</p>
            <Button type="primary" @click="backConfig"> 确定 </Button>
        </div>
        <Spin fix size="large" v-if="showSpin"></Spin>
    </div>
</template>

<script>
import {accreditList, wechatAuth, deleteApp} from '@/libs/api';
export default {
    data(){
        return {
            showError:false,
            showSpin:false,
            showLoading:false,
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
                    width:300,
                    render: (h, params) => {
                        return h('div',[
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
                                        this.$router.push({
                                            path:`/config/wechat/menu/${params.row.appToken}`
                                        })
                                    }
                                }
                            }, '微信菜单'),
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
                                        this.$router.push({
                                            path:`/config/wechat/autoreply/${params.row.appToken}`
                                        })
                                    }
                                }
                            }, '自动回复'),
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
        if(this.$route.query.message){
            this.showError = true;
        }
    },
    methods:{
        init(){
            this.showLoading = true;
            accreditList({source:0}).then(res => {
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
            wechatAuth({auth_type:1}).then(res => {
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
                source: 0
            }
            deleteApp(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.init();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //返回config
        backConfig(){
            this.$router.push({
                path: '/config'
            })
        }
    },
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
        .accreditList{
            margin-top:20px;
        }
        .unusual{
            text-align: center;
            color: #ed4e4e;
            font-weight: bold;
            font-size: 16px;
            position: relative;
            padding-top:100px;
            em{
                display: inline-block;
                width:160px;
                height:160px;
                background:url(../../../../images/unusual.png) no-repeat center center;
            }
            i{
                position: absolute;
                right:0;
                top:10px;
                font-size:25px;
                cursor: pointer;
            }
            button{
                margin-top:50px;
                width:100px;
            }
        }
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
</style>
