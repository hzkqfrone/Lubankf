<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>微博接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div>
            <div class="binding">
                <h3>绑定微博</h3>
                <p>绑定后你可以使用鲁班客服统一接收与回复顾客咨询</p>
                <p>微博账号需通过微博认证（橙V或蓝V）</p>
                <Button type="success" @click="weiboAccredit">绑定微博账号</Button>
            </div>
            <div class="accreditList">
                <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
            </div>
        </div>

        <!-- 绑定微博 -->
        <Modal
            v-model="modal"
            width="450"
            title="绑定微博账号">
            <Form label-position="top">
                <FormItem label="微博名称">
                    <Input v-model="weiboParams.nickname" placeholder="微博名称" clearable></Input>
                </FormItem>
                <FormItem label="微博ID">
                    <Input v-model="weiboParams.weibo_id" placeholder="微博ID" clearable></Input>
                </FormItem>
                <FormItem label="" v-show="weiboParams.weibo_id">
                    <div class="weiboSetting">
                        <p>请到企业微博开发者中心设置以下参数:</p>
                        <p>URL: <span>{{$store.state.app.LUBAN_URL}}weibo/callback.htm?wid={{weiboParams.weibo_id}}</span></p>
                        <p>APPKEY: <span>3615053569</span></p>
                        <p>请将设置成功后取得的 access_token 填写到下面输入框</p>
                    </div>
                </FormItem>
                <FormItem label="access_token" clearable>
                    <Input v-model="weiboParams.access_token" placeholder="access_token"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="modal=false">取消</Button>
                <Button type="primary" @click="sureTurn">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {accreditList, addWeibo, deleteApp} from '@/libs/api';
export default {
    data(){
        return {
            showLoading:false,
            resData:[], 
            weiboParams:{},
            modal:false,
            columnsData:[
                {
                    key: 'nickname',
                    title: '微博名称'
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
                    width:200,
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
            accreditList({source:3}).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //绑定微博账号btn
        weiboAccredit(){
            this.modal = true;
            this.weiboParams = {};
        },

        //确定绑定微博
        sureTurn(){
            if(!this.weiboParams.nickname){
                this.$Notice.warning({title: '请填写微博名称'});
                return
            }else if(!this.weiboParams.weibo_id){
                this.$Notice.warning({title: '请填写微博ID'});
                return
            }else if(!this.weiboParams.access_token){
                this.$Notice.warning({title: '请填写access_token'});
                return
            }
            addWeibo(this.weiboParams).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.modal = false;
                    this.init();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //删除微博
        del(token){
            var data = {
                appToken: token,
                source: 3
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
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
    .weiboSetting{
        background:#edf5fc;
        padding:10px;
        span{
            text-decoration:underline;
        }
    }
</style>
