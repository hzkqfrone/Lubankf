<template>
    <div class="waitaccess">
        <Card class="waitaccessWrap">
            <p slot="title">
                待接入
            </p>
            <div slot="extra">
                <Button type="success" icon="ios-funnel-outline" @click="showFiltrate"> 筛选</Button>
            </div>
            <Table :loading="showLoading" stripe :columns="columnsData" :data="resData"></Table>
            <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
        </Card>
        <chat-log :chatUserInfo="chatUserInfo" ref="loadTaskLog"></chat-log>
        <!-- 转接客服 -->
        <Modal
            v-model="transferModal"
            width="450"
            title="转接客服">
            <Form :label-width="50">
                <FormItem label="客服">
                    <Select v-model="transfer.transfer_id" filterable>
                        <OptionGroup v-for="(item,index) in kfList" :key="index" :label="item.name + '('+ item.active_num +')'">
                            <Option v-for="(list, lIndex) in item.list" :value="list.id" :label="list.username" :key="lIndex">
                                <span>{{ list.username }}</span>
                                <span style="float:right"><Badge :status="sArr[list.active].s" :text="sArr[list.active].label" /></span>
                            </Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="transfer.transfer_note" type="textarea"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="closeTransfer">取消</Button>
                <Button type="primary" @click="sureTurn">确定</Button>
            </div>
        </Modal>

        <!-- 筛选 -->
        <Drawer v-model="visibleModal" width="350" scrollable  class="filtrateWrap">
            <div slot="header" class="topTitle">
                <span class="selectIn">搜索筛选</span>
            </div>
            <div class="filtrate elementScroll">
                <Form label-position="top" class="filtrateItem">
                    <FormItem label="昵称">
                        <Input placeholder="请填写昵称" clearable v-model="waitParams.username"></Input>
                    </FormItem>
                    <FormItem label="发起时间">
                        <date-picker @changeTime="selectCreateTime"></date-picker>
                    </FormItem>
                    <FormItem label="渠道">
                        <Select filterable transfer clearable v-model="waitParams.channel">
                            <Option v-for="(list, index) in sourceInfo" :value="list.code" :label="list.label" :key="index"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="技能组">
                        <Select filterable transfer clearable v-model="waitParams.group_id">
                            <Option v-for="(list, index) in kfGroup" :value="list.id" :label="list.name" :key="index"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="关联">
                        <Select filterable transfer clearable v-model="waitParams.appToken">
                            <Option v-for="(list, index) in relevanceList" :value="list.appToken" :label="list.nickname" :key="index"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div class="demo-drawer-footer">
                <Button type="primary" @click="getWaitList(),waitParams.page=1">筛选</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
import chatLog from '@/views/my-components/chat-log/chat-log';
import {getUserList, transferService, getService, closeTask, serviceJoinUp} from '@/libs/api.js';
import datePicker from '@/views/my-components/date-picker/date-picker';    //日期选择
import { filtrateData } from '@/mixins/mixin';
export default {
    mixins:[filtrateData],
    data(){
        return {
            showLoading:true,
            chatUserInfo:{},
            transfer:{},
            transferModal:false,   //转接客服
            kfList:[], //可转接客服列表
            totalCount:0,
            columnsData:[
                 {
                    key: 'nickname',
                    title: '昵称',
                    minWidth: 80
                },
                {
                    key: 'time',
                    title: '发起时间',
                    minWidth: 80,
                    render: (h, params) => {
                        return h("span",params.row.task.CreateTime);
                    }
                },
                {
                    key: 'group',
                    title: '技能组',
                    minWidth: 80
                },
                // {
                //     key: 'agent',
                //     title: '客服名',
                //     minWidth: 80
                // },
                {
                    key: 'source_name',
                    title: '渠道',
                    minWidth: 80
                },
                {
                    key: 'status',
                    title: '关联',
                    minWidth: 80,
                    render: (h, params) => {
                        return h("span",params.row.task.nickname);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:250,
                    render: (h, params) => {
                        let btns = [];
                        btns.push(h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.getChatLog(params.index)
                                    }
                                }
                            }, '查看会话')
                        )
                        btns.push(h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.access(params.index)
                                    }
                                }
                            }, '接入')
                        )
                        btns.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.getServiceList();
                                        this.transfer.taskToken = params.row.taskToken;
                                    }
                                }
                            }, '转接')
                        )
                        btns.push(h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要关闭吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.close(params.index)
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
                            }, '关闭')
                        ]))

                        return h("div",btns)
                    }
                }  
            ],
            resData:[],
            sArr:[
                {s:'default',label:'离线',value:'0'},
                {s:'success',label:'空闲',value:'1'},
                {s:'error',label:'忙碌',value:'2'},
                {s:'warning',label:'隐身',value:'3'},
                {s:'processing',label:'离开',value:'4'}
            ],
            chatDate:[],
            visibleModal:false, //显示筛选
            waitParams:{
                tag:0,
                page:1
            },
        }
    },
    computed:{
        waitMsg () {
            return this.$store.state.app.waitMsg;
        }
    },
    mounted() {
        this.$store.commit("updateOpenWaitaccess",true);
    },
    methods:{
        //加载待接入列表
        getWaitList(){
            //待接入 0    会话 1     历史会话 2
            getUserList(this.waitParams).then(res => {
                this.showLoading = false;
                if(res.code ==0 ){
                    this.visibleModal = false;
                    this.totalCount = Number(res.data.totalCount);
                    this.$store.commit("updatedWaitNum",this.totalCount);
                    if(res.data.list) this.resData = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //下一页
        changeNum(page){
            this.waitParams.page = page;
            this.getWaitList();
        },

        //接入
        access(index){
            var taskToken = this.resData[index].taskToken;
            serviceJoinUp({taskToken: taskToken}).then(res => {
                if(res.code == 0){
                    this.getWaitList();
                    this.$nextTick(() => {
                        this.$router.push({
                            path:`/chat?u=${taskToken}`,
                        })
                    })
                    this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum - 1);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //转接
        sureTurn(index){
            if(!this.transfer.transfer_id){
                this.$Notice.warning({title: '请选择客服'});
                return false;
            }
            transferService(this.transfer).then(res => {
                if(res.code == 0){
                    this.getWaitList();
                    this.$Notice.success({title: res.msg});
                    this.transferModal = false;
                    this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum - 1);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //取消转接
        closeTransfer(){
            this.transferModal = false;
        },

        //	获取客服列表
        getServiceList(){
            this.transferModal = true;
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //关闭
        close(index){
            closeTask({taskToken: this.resData[index].taskToken}).then(res =>{
                if(res.code == 0){
                    this.getWaitList();
                    this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum - 1);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //查看会话
        getChatLog(index){
            this.chatUserInfo = this.resData[index];
            this.$refs.loadTaskLog.loadChatLog(true);
        },

        //创建时间
        selectCreateTime(date){
            this.waitParams.task_start_timer = date.createTimeStart;
            this.waitParams.task_end_timer = date.createTimeEnd;
        },

        //显示筛选
        showFiltrate(){
            this.visibleModal = true;
            if(this.kfGroup.length==0) this.getKfGroup();         //技能组
        }

    },
    activated() {
        this.getWaitList();
    },
    watch:{
        waitMsg(){
            var handel = true;
            //待接入已被领取
            if(this.waitMsg.type == "cancel_waiting"){
                this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum - 1);
                this.resData.forEach((e,index) => {
                    if(e.taskToken == this.waitMsg.taskToken){
                        this.resData.splice(index,1);
                    }
                })
                return false;
            }
            //收到待接入消息
            if(this.resData){
                this.resData.forEach((e,index) => {
                    if(e.taskToken == this.waitMsg.taskToken){
                        handel = false;
                    }
                })
                if(handel){
                    handel = false;
                    this.resData.unshift(this.waitMsg);
                    this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum + 1);
                }
            }else{
                this.resData.unshift(this.waitMsg);
                this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum + 1);
            }
        }
    },
    components:{
        chatLog,
        datePicker
    }
}
</script>

<style lang="less">
    @import '../../static/css/filtrate.less';
    .waitaccess{
        padding:10px;
        min-height: 100%;
    }
</style>
