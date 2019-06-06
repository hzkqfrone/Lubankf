<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>企业微信接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div>
            <div class="binding">
                <h3>绑定企业微信</h3>
                <p>绑定后你可以使用鲁班客服统一接收与回复顾客咨询</p>
                <Button type="success" @click="workWechatAccredit">绑定企业微信</Button>
            </div>
            <div class="accreditList">
                <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
            </div>
        </div>

        <!-- 绑定微博 -->
        <Modal
            v-model="modal"
            width="700"
            title="绑定企业微信">
            <Form :label-width="100">
                <div class="workWechatStep">
                    <div class="title clearfix">
                        <div class="step">第一步:</div> 
                        <div class="info">填写要绑定的企业号名称，并在企业号管理后台 "我的企业" - "企业信息" 中找到CorpID，填入下方输入框中</div>
                    </div>
                    <FormItem label="企业号名称">
                        <Input v-model="params.nickname" placeholder="企业号名称" clearable></Input>
                    </FormItem>
                    <FormItem label="CorpId">
                        <Input v-model="params.corp_id" placeholder="获取CorpId（企业ID）" clearable></Input>
                    </FormItem>
                </div>
                <div class="workWechatStep">
                    <div class="title clearfix">
                        <div class="step">第二步:</div> 
                        <div class="info">在企业号管理后台 "企业应用" - "自建应用" 中点击 "创建应用" ，创建完成后可见到AgentID和Secret，填入下方输入框中</div>
                    </div>
                    <FormItem label="AgentID">
                        <Input v-model="params.agent_id" placeholder="AgentID" clearable></Input>
                    </FormItem>
                    <FormItem label="Secret">
                        <Input v-model="params.secret" placeholder="Secret" clearable></Input>
                    </FormItem>
                </div>
                <div class="workWechatStep">
                    <div class="title clearfix">
                        <div class="step">第三步:</div> 
                        <div class="info">在已创建应用内页，找到 "接收消息" 项，点击 "设置API接收" ，再将下方生成的URL地址复制到里面</div>
                    </div>
                    <FormItem label="URL">
                        <div class="url">https://www.lubankf.com/work-wechat/callback.htm?cid={{params.corp_id}}</div>
                    </FormItem>
                </div>
                <div class="workWechatStep">
                    <div class="title clearfix">
                        <div class="step">第四步:</div> 
                        <div class="info">填写要绑定的Token和EncodingAESKey，请保证与企业号后台信息一致</div>
                    </div>
                    <FormItem label="Token">
                        <Input v-model="params.token" placeholder="Token" clearable></Input>
                    </FormItem>
                    <FormItem label="EncodingAESKey">
                        <Input v-model="params.encoding_aes_key" placeholder="EncodingAESKey" clearable></Input>
                    </FormItem>
                </div>
            </Form>
            <div slot="footer">
                <Button @click="modal=false">取消</Button>
                <Button type="primary" @click="sureTurn">确定</Button>
            </div>
        </Modal>


        <Modal
            v-model="showBind"
            title="企业微信解除绑定">
            <div class="closeBind">
                <h4>解绑后，将删除列表中该条数据；</h4> 
                <p>同时还需前往 企业微信后台 “企业应用”－“自建应用”，找到绑定的应用并点击进入内页，点“删除应用”后，才能解绑成功！</p> 
                <p>否则客户能继续发送消息，而您无法正常查收。</p>  
            </div>
            <div slot="footer">
                <Button @click="showBind=false">取消</Button>
                <Button type="primary" @click="del">解绑</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {accreditList, addWorkWechat, deleteApp} from '@/libs/api';
export default {
    data(){
        return {
            showBind:false,
            showLoading:false,
            resData:[], 
            params:{},
            modal:false,
            delAppToken:'',
            columnsData:[
                {
                    key: 'nickname',
                    title: '企业微信名称'
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
                                       this.showBind = true;
                                       this.delAppToken = params.row.appToken;
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
            accreditList({source:5}).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //绑定企业微信账号btn
        workWechatAccredit(){
            this.modal = true;
            this.params = {};
        },

        //确定绑定企业微信
        sureTurn(){
            if(!this.params.nickname){
                this.$Notice.warning({title: '请填写企业号名称'});
                return
            }else if(!this.params.corp_id){
                this.$Notice.warning({title: '请填写CorpId'});
                return
            }else if(!this.params.agent_id){
                this.$Notice.warning({title: '请填写AgentID'});
                return
            }else if(!this.params.secret){
                this.$Notice.warning({title: '请填写Secret'});
                return
            }else if(!this.params.token){
                this.$Notice.warning({title: '请填写Token'});
                return
            }else if(!this.params.encoding_aes_key){
                this.$Notice.warning({title: '请填写EncodingAESKey'});
                return
            }
            addWorkWechat(this.params).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.modal = false;
                    this.init();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //删除企业微信
        del(){
            var data = {
                appToken: this.delAppToken,
                source: 5
            }
            deleteApp(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.init();
                    this.showBind = false;
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
    .workWechatStep{
        margin-bottom:20px;
        .title{
            margin-bottom:10px;
            font-size:14px;
            padding:10px;
            background:#edf5fc;
            font-weight: bold;
            border-radius: 5px;
            .step{
                float: left;
            }
            .info{
                float:left;
                margin-left:10px;
                width:560px;
            }
        }
        .url{
            display: inline-block;
            width: 100%;
            height: 32px;
            line-height: 1.5;
            padding: 4px 7px;
            font-size: 12px;
            border: 1px solid #dcdee2;
            border-radius: 4px;
            color: #515a6e;
            background-color: #fff;
            background-image: none;
            position: relative;
            cursor: text;
            transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
        }
    }
    .closeBind{
        h4,p{
            line-height:24px;
        }
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
</style>
