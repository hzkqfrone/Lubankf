<template>
    <div class="customer">
        <Card class="customerWrap">
            <p slot="title">
                客户管理
            </p>
            <div slot="extra">
                <Button type="success" icon="ios-funnel-outline" @click="openFiltrate"> 筛选</Button>
            </div>
            <Table :loading="showLoading" stripe :columns="columnsData" :data="resData"></Table>
            <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
            
            <Modal
                v-model="ModalShow"
                :footer-hide="true"
                draggable scrollable
                @on-visible-change="visibleChange"
                title="历史会话">
                <div class="customer_log">
                    <Spin fix v-if="chatLogLoading"></Spin>
                    <Timeline>
                        <TimelineItem v-for="(item,index) in taskList" :key="index" :class="{timeBg:tIndex==index}">
                            <a href="javascript:;" @click="historyChat(item.taskToken),tIndex=index">{{item.startTime}} <span class="source"> {{item.source}}  咨询</span></a>
                        </TimelineItem>
                    </Timeline>
                </div>
            </Modal>
            
            <!-- 消息记录 -->
            <chat-log :chatUserInfo="chatUserInfo" ref="loadTaskLog"></chat-log>
        </Card>

        <!-- 筛选 -->
        <Drawer v-model="visibleModal" width="350" scrollable  class="filtrateWrap">
            <div slot="header" class="topTitle">
                <span :class="{selectIn: filIndex==1}" @click="filIndex=1,filparams={},initFilList()">搜索筛选</span>
                <span :class="{selectIn: filIndex==2 || filIndex == 3}" @click="filIndex=2,filList()">自定义筛选</span>
            </div>
            <div class="filtrate elementScroll" v-if="filIndex==1 || filIndex == 3">
                <Form label-position="top" class="filtrateItem">
                    <FormItem label="自定义筛选名称" v-if="filIndex==3">
                        <Input placeholder="请填写自定义筛选名称" clearable v-model="createfilName"></Input>
                    </FormItem>
                    <FormItem label="姓名" v-if="condition[0].status">
                        <Input placeholder="请填写姓名" clearable v-model="filparams.username"></Input>
                        <span class="del" @click="delFilItem(0)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="年龄" v-if="condition[1].status">
                        <Input placeholder="请填写年龄" clearable v-model="filparams.age"></Input>
                        <span class="del" @click="delFilItem(1)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="性别" v-if="condition[2].status">
                        <RadioGroup v-model="filparams.sex">
                            <Radio label="1">男</Radio>
                            <Radio label="0">女</Radio>
                        </RadioGroup>
                        <span class="del" @click="delFilItem(2)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="电话" v-if="condition[3].status">
                        <Input placeholder="请输入电话" clearable v-model="filparams.mobile"></Input>
                        <span class="del" @click="delFilItem(3)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="微信" v-if="condition[4].status">
                        <Input placeholder="请输入微信" clearable v-model="filparams.wechat"></Input>
                        <span class="del" @click="delFilItem(4)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="地址" v-if="condition[5].status">
                        <Input placeholder="请输入地址" clearable v-model="filparams.address"></Input>
                        <span class="del" @click="delFilItem(5)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="邮箱" v-if="condition[6].status">
                        <Input placeholder="请输入邮箱" clearable v-model="filparams.email"></Input>
                        <span class="del" @click="delFilItem(6)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="备注" v-if="condition[7].status">
                        <Input placeholder="请输入备注" clearable v-model="filparams.notes"></Input>
                        <span class="del" @click="delFilItem(7)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="IP" v-if="condition[8].status">
                        <Input placeholder="请输入IP" clearable v-model="filparams.ip"></Input>
                        <span class="del" @click="delFilItem(8)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="渠道" v-if="condition[9].status">
                        <Select filterable transfer clearable v-model="filparams.channel">
                            <Option v-for="(list, index) in sourceInfo" :value="list.code" :label="list.label" :key="index"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(9)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="关联" v-if="condition[10].status">
                        <Select filterable transfer clearable v-model="filparams.appToken">
                            <Option v-for="(list, index) in relevanceList" :value="list.appToken" :label="list.nickname" :key="index"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(10)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="来源关键字" v-if="condition[11].status">
                        <Input placeholder="请输入来源关键字" clearable v-model="filparams.seoKeyword"></Input>
                        <span class="del" @click="delFilItem(11)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="上级来源" v-if="condition[12].status">
                        <Input placeholder="请输入上级来源" clearable v-model="filparams.parentUrl"></Input>
                        <span class="del" @click="delFilItem(12)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="会话来源" v-if="condition[13].status">
                        <Input placeholder="请输入会话来源" clearable v-model="filparams.fromUrl"></Input>
                        <span class="del" @click="delFilItem(13)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="">
                        <Dropdown trigger="click" style="margin-left: 20px" @on-click="addCondition">
                            <a href="javascript:;"><Icon type="md-add" /> 添加筛选条件</a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-for="(item,index) in condition" v-if="!item.status" :name="item.id" :key="index">{{item.label}}</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </FormItem>
                </Form>
                <div class="demo-drawer-footer">
                    <div v-if="filIndex==1">
                        <Button style="margin-right: 8px" @click="saveAndFiltrate('fil')">保存当前条件并筛选</Button>
                        <Button type="primary" @click="filtrateBtn">筛选</Button>
                    </div>
                    <div v-if="filIndex==3">
                        <Button style="margin-right: 8px" @click="saveAndFiltrate('save')">保存当前条件并筛选</Button>
                        <Button type="error" @click="delFil(custom_id)">删除</Button>
                    </div>
                </div>
            </div>
            <!-- 自定义筛选列表 -->
            <div class="filtrateList" v-if="filIndex==2">
                <ul class="elementScroll" v-if="filData.length > 0">
                    <li v-for="(item, index) in filData" :key="index" @click="customerFiltrate(item.id)">
                        <div class="title">{{item.title}}</div> 
                        <div class="operation">
                            <Icon type="ios-create" title="编辑" @click.stop="editFil(item.id,item.title)"/>     
                            <Icon type="md-trash" title="删除" @click.stop="delFil(item.id)"/>
                        </div>
                    </li>
                </ul>
                <div v-else class="empty">
                    暂无自定义筛选列表~
                </div>
            </div>
        </Drawer>
        <!-- 创建自定义筛选 填写名称 -->
        <Modal
            v-model="filName"
            @on-ok="createFilItem"
            @on-cancel="filName=false"
            title="创建自定义筛选">
                <Input placeholder="填写名称" v-model="createfilName"></Input>
        </Modal>

    </div>
</template>
<script>
import chatLog from '@/views/my-components/chat-log/chat-log';
import { customerList, customerChatList, addCustom, getCustomList, updateCustom, getCustomDetails} from '@/libs/api';
import { filtrateData } from '@/mixins/mixin';
export default {
    mixins:[filtrateData],
    data(){
        return {
            ModalShow:false,
            chatLogLoading:true,
            showLoading:true,
            chatUserInfo:{},
            tIndex:-1,
            columnsData:[
                {
                    key: 'username',
                    title: '姓名',
                    render:(h, params) => {
                        if(params.row.name){
                            return h('span',`${params.row.username}(${params.row.name})`)
                        }else{
                            return h('span',params.row.username)
                        }
                    }
                },
                {
                    key: 'age',
                    title: '年龄'
                },
                {
                    key: 'sex',
                    title: '性别',
                    render:(h, params) => {
                        var sex = "女"
                        if(params.row.sex == "1"){
                            sex = "男"
                        }else if(params.row.sex == "-1"){
                            sex = "未知"
                        }
                        return h('span',sex)
                    }
                },
                {
                    key: 'AppNickName',
                    title: '关联',
                },
                {
                    key: 'tel',
                    title: '电话'
                },
                {
                    key: 'wechat',
                    title: '微信'
                },
                {
                    key: 'address',
                    title: '地址'
                },
                {
                    key: 'email',
                    title: '邮箱'
                },
                {
                    key: 'AppNickName',
                    title: '来源'
                },
                {
                    key: 'notes',
                    title: '备注'
                },
                {
                    key: 'other',
                    title: '操作',
                    render:(h, params) => {
                        return h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.chatUserInfo = params.row;
                                    this.getcustomerChatList(params.row.userToken);
                                }
                            }
                        }, '查看历史会话')
                    }
                },
            ],
            resData:[],
            totalCount:0,
            taskList:[],  //所有会话列表
            reaceTop:'',
            params:{   //搜索
                page:1
            },  
            visibleModal:false,
            filIndex:1,
            condition:[         //筛选条件
                {id:0, label:'姓名',status:1,value:'username'},
                {id:1, label:'年龄',status:1,value:'age'},
                {id:2, label:'性别',status:1,value:'sex'},
                {id:3, label:'电话',status:1,value:'mobile'},
                {id:4, label:'微信',status:1,value:'wechat'},
                {id:5, label:'地址',status:1,value:'address'},
                {id:6, label:'邮箱',status:1,value:'email'},
                {id:7, label:'备注',status:0,value:'notes'},
                {id:8, label:'IP',status:0,value:'ip'},
                {id:9, label:'渠道',status:0,value:'channel'},
                {id:10, label:'关联',status:0,value:'appToken'},
                {id:11, label:'来源关键字',status:0,value:'seoKeyword'},
                {id:12, label:'上级来源',status:0,value:'parentUrl'},
                {id:13, label:'会话来源',status:0,value:'fromUrl'}                 
            ]
        }
    },
    mounted() {
        this.getCustomerList();
    },
    methods:{
        changeNum(page){
            this.params.page = page;
            this.getCustomerList();
        },

        //加载客户列表
        getCustomerList(){
            customerList(Object.assign({}, this.params, this.filparams)).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.filparams = {};
                    this.initFilList();
                    this.totalCount = Number(res.data.totalCount);
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取单个用户所有会话列表
        getcustomerChatList(token){
            this.ModalShow = true;
            this.chatLogLoading = true;
            this.tIndex = -1;
            customerChatList({userToken:token}).then(res => {
                this.chatLogLoading = false;
                if(res.code == 0){
                    this.taskList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //点击历史会话列表
        historyChat(token){
            this.chatUserInfo.taskToken = token;
            this.$refs.loadTaskLog.loadChatLog(true);
        },

        //历史会话弹窗状态
        visibleChange(status){
            if(!status){
                this.$refs.loadTaskLog.loadChatLog(false);
            }
        },


        //打开筛选框
        openFiltrate(){
            this.visibleModal = true;
            if(this.filIndex == 3) this.filIndex = 2;
            if(!this.sourceInfo){
                this.getFilService();   //获取筛选客服列表
            }
        },

        //筛选
        filtrateBtn(){
            this.getCustomerList();
            this.params.page = 1;
            this.visibleModal = false;
        },

        //保存自定义筛选
        saveFil(){
            var data = {
                title: this.createfilName,
                category: 'customer',
                attachments: JSON.stringify(this.filparams)
            }
            addCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.getCustomerList();
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取自定义筛选列表
        filList(){
            getCustomList({category: 'customer'}).then(res => {
                if(res.code == 0){
                    this.filData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取自定义筛选内容
        editFil(id, title){
            this.filIndex = 3;
            this.custom_id = id;
            getCustomDetails({custom_id: id}).then(res => {
                if(res.code == 0){
                    if(res.data){
                        this.editCustom = JSON.parse(res.data);
                        this.filparams = this.editCustom;
                        this.initFiltrate();
                        this.createfilName = title;
                        this.isedit = true;
                    }
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //更新自定义筛选内容
        updateFil(){
            var data = {
                title: this.createfilName,
                category: 'customer',
                attachments: JSON.stringify(this.filparams),
                custom_id: this.custom_id
            }
            updateCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.$Notice.success({title: res.msg});
                    this.getCustomerList();
                    this.filIndex = 1;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //点击自定义筛选列表
        customerFiltrate(id){
            this.filparams.search_id = id;
            this.getCustomerList();
            this.visibleModal = false;
        }

        
    },
    components:{
        chatLog
    }
}
</script>
<style lang="less">
    @import '../../static/css/filtrate.less';
    .customer{
        padding:10px;
        .customerWrap{
            background: #fff;
            .chatLogDrawer .ivu-drawer-wrap{
                z-index: 99999;
                width:640px;
                left:inherit;
                .ivu-drawer-body{
                    padding:0 16px 16px;
                }
            }
            .chatLogTop{
                line-height: 32px;
                border-bottom:1px solid #e5e5e5;
                padding-bottom:10px;
                position: fixed;
                background:#fff;
                width: 592px;
                z-index:99;
                img{
                    width:32px;
                    height:32px;
                    display: inline-block;
                    float: left;
                }
                h2{
                    font-size:14px;
                    i{
                        float: right;
                        line-height:32px;
                        font-size:18px;
                    }
                }
                h3{
                    display: inline-block;
                    margin-left:10px;
                    font-weight:400;
                }
            }
            .msgContent{
                margin-top:76px;
                width:100%;
                ul{
                    margin:0 10px;
                    li{
                        margin-top:10px;
                        width:100%;
                        display: inline-block;
                        & .right{
                            float: right;
                            width:90%;
                            .chatContent{
                                float:right;
                                .title{
                                    text-align: right;
                                    margin-left:5px;
                                }
                                .msgText{
                                    float: right;
                                    background:#f0f1f3;
                                    .error,.sendLoading{
                                        position: absolute;
                                        top:50%;
                                        left:-22px;
                                        margin-top:-8px;
                                        width:16px;
                                        height:16px;
                                        display: inline-block;
                                        background:url(../../images/error.png) no-repeat center;
                                        cursor: pointer;
                                    }
                                    .sendLoading{
                                        background:url(../../images/loading_status.gif) no-repeat center;
                                    }
                                }
                            }
                        }
                        & .left{
                            width:90%;
                            display: inline-block;
                            .msgText{
                                float: left;
                                background:#e7f4ff;
                                //语音
                                .voice .voiceWrap{
                                    cursor: pointer;
                                    img{
                                        width:15px;
                                        height:15px;
                                        vertical-align: middle;
                                        margin-top:-3px;
                                    }
                                    span{
                                        float:right;
                                    }
                                }
                            }
                        }
                        .message{
                            float:left;
                            .title{
                                font-size:12px;
                                color:#b2b2b2;
                            }
                            .errorInfo{
                                font-size:12px;
                                color:#f43e0b;
                                display: inline-block;
                            }
                            .msgText{
                                // overflow: hidden;
                                text-overflow: hidden;
                                padding:5px 10px;
                                line-height: 24px;
                                border-radius:3px;
                                position: relative;
                                em{
                                    width:24px;
                                    height:24px;
                                    display: inline-block;
                                    background:url(../../images/face/emoji.png);
                                    background-position-x:0px;
                                    vertical-align: bottom;
                                }
                                .msg>img{
                                    width:24px;
                                    height:24px;
                                    margin:0;
                                    float:none;
                                    vertical-align: middle;
                                }
                                img.imageMsg{
                                    width:100%;
                                    max-width: 100px;
                                    height:auto;
                                    cursor: pointer;
                                }
                                .emoji{
                                    display: inline-block;
                                    width:22px;
                                    height:22px;
                                    background:url(../../images/face/emoji.png);
                                    background-position: -2px 0px;
                                }
                            }
                        }
                        & .tsInfo{
                            text-align: center;
                            color:#b2b2b2;
                            p.info{
                                display:inline-block;
                                background: #f5f5f5;
                                padding:0 5px;
                                border-radius:5px;
                            }
                            p.dashed{
                                width:100%;
                                border-top:1px dashed #e7e7e7;
                                margin-top:-10px;
                            }
                        }
                    }
                }
            }
        }
    }
.ivu-scroll-container{
    &::-webkit-scrollbar {/*滚动条整体样式*/
        width: 3px;    
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #e0e0e0;
    }
}
.timeBg .ivu-timeline-item-head-blue{
    background: #2d8cf0;
}
.customer_log{
    max-height: 600px;
    overflow-y: auto;
}
</style>
