<template>
    <div class="leaveword">
        <div style="height:100%;padding:10px;">
            <Card class="waitaccessWrap">
                <p slot="title">
                    留言
                </p>
                <div class="leavewordWrap clearfix configTop">
                    <div class="group elementScroll">
                        <div class="groupTitle">
                            <ul class="clearfix">
                                <li :class="{selectItem:pitch==0}" @click="changeleaveListInit(0,1,0)">
                                    <div>
                                        <span class="title">我的未处理留言</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==1}" @click="changeleaveListInit(1,1,1)">
                                    <div>
                                        <span class="title">我的处理中留言</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==2}" @click="changeleaveListInit(2,1,2)">
                                    <div>
                                        <span class="title">我的已解决留言</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==3}" @click="changeleaveListInit(0,0,3,1)">
                                    <div>
                                        <span class="title">全部留言</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==4}" @click="changeleaveListInit(0,0,4)">
                                    <div>
                                        <span class="title">未分配留言</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==5}" @click="changeleaveListInit(0,0,5,'filtrate')">
                                    <div>
                                        <span class="title">留言筛选</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="listRight elementScroll">
                        <Table :loading="showLoading" stripe :columns="columnsData" :data="resData"></Table>
                        <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
                    </div>
                </div>
            </Card>
            <Drawer :title="leaveData.name" width="520" v-model="detailModal" class="leaveDrawerWrap">
                <Spin v-if="showSpin" fix></Spin>
                <div class="leaveDrawer">
                    <Form :label-width="80">
                        <FormItem label="发起人"><span class="leaveInfo">{{leaveData.name}}</span></FormItem>
                        <FormItem label="发起人手机"><span class="leaveInfo">{{leaveData.phone}}</span></FormItem>
                        <FormItem label="发起人邮箱"><span class="leaveInfo">{{leaveData.email}}</span></FormItem>
                        <FormItem label="关联"><span class="leaveInfo">{{leaveData.appName}}</span></FormItem>
                        <FormItem label="创建时间"><span class="leaveInfo">{{leaveData.createTime}}</span></FormItem>
                        <FormItem label="更新时间"><span class="leaveInfo">{{leaveData.updateTime}}</span></FormItem>
                        <FormItem label="内容"><span class="leaveInfo">{{leaveData.content}}</span></FormItem>
                    </Form>
                    <div class="remarkList" v-if="leaveData.agreement && leaveData.agreement.length > 0">
                        <ul>
                            <li v-for="(item,index) in leaveData.agreement" :key="index">
                                <p>
                                    <span class="username">{{item.agent}}</span>
                                    <span class="date">{{item.createTime}}</span>
                                </p>
                                <p class="remarkContent">{{item.content}}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="msgContent">
                        <!-- <Icon type="ios-folder-outline" /> -->
                        <Input type="textarea" :rows="4" placeholder="请输入内容" @on-change="changeLeavRemark" v-model="leaveRemark"></Input>
                    </div>
                </div>
                <div class="drawer-footer">
                    <Button type="primary" @click="submintLeaveRemark(leaveData.id)" :disabled="isdisabled" :loading="btnLoading">提交</Button>
                </div>
            </Drawer>
        </div>
        <!-- 分配留言 -->
        <Modal
            v-model="allotModal"
            width="400"
            title="分配留言">
            <div style="padding:10px 0 30px 0">
                <Select v-model="allotId" size="large">
                    <OptionGroup v-for="(item,index) in kfList" :key="index" :label="item.name + '('+ item.active_num +')'">
                        <Option v-for="(list, lIndex) in item.list" :value="list.id" :label="list.username" :key="lIndex">
                            <span>{{ list.username }}</span>
                            <span style="float:right"><Badge :status="sArr[list.active].s" :text="sArr[list.active].label" /></span>
                        </Option>
                    </OptionGroup>
                </Select>
            </div>
            <div slot="footer">
                <Button type="success" v-if="leaveStatus=='未分配'"  @click="allotId=-1,allotLeaveService()">分配给我</Button>
                <Button @click="allotModal=false">取消</Button>
                <Button type="primary" @click="allotLeaveService">确定</Button>
            </div>
        </Modal>

        <!-- 修改状态 -->
        <Modal
            v-model="statusModal"
            width="400"
            title="修改留言状态">
            <div style="padding:10px 0 30px 0">
                <Select size="large" v-model="leaveStatus">
                    <Option value="0">未处理</Option>
                    <Option value="1">处理中</Option>
                    <Option value="2">已解决</Option>
                </Select>
            </div>
            <div slot="footer">
                <Button @click="statusModal=false">取消</Button>
                <Button @click="updateLeaveStatus" type="primary">确定</Button>
            </div>
        </Modal>

         <!-- 筛选 -->
        <Drawer v-model="visibleModal" width="350" scrollable  class="filtrateWrap">
            <div slot="header" class="topTitle">
                <span class="selectIn">搜索筛选</span>
            </div>
            <div class="filtrate elementScroll">
                <Form label-position="top" class="filtrateItem">
                    <FormItem label="创建人">
                        <Input placeholder="请填写创建人" clearable v-model="leaveParams.username"></Input>
                    </FormItem>
                    <FormItem label="创建时间">
                        <date-picker @changeTime="selectCreateTime"></date-picker>
                    </FormItem>
                    <FormItem label="处理人">
                        <Select transfer clearable v-model="leaveParams.agent_id" multiple filterable>
                            <Option v-for="(list, lIndex) in kfFilList" :value="list.id" :label="list.username" :key="lIndex"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态">
                        <Select transfer clearable v-model="leaveParams.status">
                            <Option value="0">未处理</Option>
                            <Option value="1">处理中</Option>
                            <Option value="2">已解决</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="关联" v-model="leaveParams.appToken">
                        <Select filterable transfer clearable>
                            <Option v-for="(list, index) in relevanceList" :value="list.appToken" :label="list.nickname" :key="index"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div class="demo-drawer-footer">
                <Button type="primary" @click="leaveListInit(), visibleModal=false">筛选</Button>
            </div>
        </Drawer>

    </div>
</template>

<script>
import { getNowFormatDate, filtrateData } from '@/mixins/mixin';
import {getService, getLeaveList, getLeaveMsg, submintLeave, updatedLeave, allotLeave} from '@/libs/api.js';
import datePicker from '@/views/my-components/date-picker/date-picker';    //日期选择
export default {
    mixins:[getNowFormatDate, filtrateData],
    data(){
        return {
            pitch:0,
            allotModal:false,  //分配留言modal
            allotId:'',      //分配参数
            statusModal:false, //修改状态modal
            leaveRemark:'',   //填写留言备注信息
            isdisabled:true,  //提交按钮状态
            btnLoading:false, //提交按钮提交中状态
            showSpin:true,    //显示加载中
            leaveStatus:'0',  //修改留言状态
            leaveId:'',       //留言列表id
            leaveStatus:'',   //留言列表状态
            kfList:[],
            detailModal:false,
            resData:[{}],
            totalCount:0,
            showLoading:true,
            columnsData: [
                {
                    key: 'userName',
                    title: '创建人',
                    render: (h, params) => {
                        return h('p',{
                            attrs:{
                                title: params.row.userName
                            },
                            style:{
                                'text-overflow': 'ellipsis',
                                'white-space': 'nowrap',
                                overflow: 'hidden'
                            }
                        }, params.row.userName)
                    }
                },
                {
                    key: 'createTime',
                    title: '创建时间'
                },
                {
                    key: 'updateTime',
                    title: '更新时间'
                },
                {
                    key: 'appName',
                    title: '关联'
                },
                {
                    key: 'service',
                    title: '分配'
                },
                {
                    key: 'status',
                    title: '状态'
                },
                {
                    title: '操作',
                    key: 'action',
                    width:220,
                    render: (h, params) => {
                        return h('div',[
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.leaveId = params.row.id; 
                                        this.leaveStatus = params.row.status;
                                        this.allotModal = true;
                                        this.getServiceList();
                                    }
                                }
                            }, '分配'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.statusModal = true; 
                                        this.leaveId = params.row.id;  
                                    }
                                }
                            }, '修改状态'),
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
                                        this.leaveMsg(params.row.id);
                                    }
                                }
                            }, '查看详情')
                        ])
        
                    }
                }  
            ],
            sArr:[
                {s:'default',label:'离线',value:'0'},
                {s:'success',label:'空闲',value:'1'},
                {s:'error',label:'忙碌',value:'2'},
                {s:'warning',label:'隐身',value:'3'},
                {s:'processing',label:'离开',value:'4'}
            ],
            leaveParams:{
                page: 1,
                status: 0,          //状态（0未处理 1处理中 2已解决）
                me: 1,              //我的留言 （1我的留言 0未分配留言） 
            },
            leaveData:{},           //留言详情
            visibleModal:false,     //显示筛选
        }
    },
    mounted(){
        this.getServiceList();  //客服列表
        this.getFilService();   //获取筛选客服列表
        //id  消息中心跳入 
        var id = this.$route.query.id;
        if(id){
            this.changeleaveListInit(0,0,3,1)
            this.leaveMsg(id);
        }else{
            this.leaveListInit();
        }
    },
    methods:{
        //加载留言列表
        leaveListInit(){
            this.showLoading = true;
            getLeaveList(this.leaveParams).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.totalCount = Number(res.data.totalCount);
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        changeleaveListInit(s, m, p, a){
            this.leaveParams.status = s;
            this.leaveParams.me = m;
            this.pitch = p;
            this.visibleModal = false;
            if(a == 1 || a == 'filtrate'){
                this.leaveParams = { page: 1 }
            }
            if(a == 'filtrate'){
            //自定义筛选
                this.visibleModal = true;
            }else{
                delete this.leaveParams.all;
            }
            this.leaveListInit();
        },

        //加载留言详情
        leaveMsg(id){
            this.showSpin = true;
            this.detailModal = true;
            getLeaveMsg({id: id}).then(res => {
                this.showSpin = false;
                if(res.code == 0){
                    this.leaveData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //提交留言备注信息
        submintLeaveRemark(id){
            var data = {
                id: id,
                content: this.leaveRemark
            }
            this.btnLoading = true;
            submintLeave(data).then(res => {
                this.btnLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title: "提交成功"});
                    var name = sessionStorage.login_data ? JSON.parse(sessionStorage.login_data) : '';
                    this.leaveData.agreement.push({
                        agent: name.username,
                        content: this.leaveRemark,
                        createTime: this.getNowFormatDate()
                    })
                    this.leaveRemark = "";
                    this.isdisabled = true;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //输入框状态
        changeLeavRemark(event){
            if(!this.leaveRemark.trim()){
                this.isdisabled = true;
            }else{
                this.isdisabled = false;
            }
        },

        changeNum(page){
            this.leaveParams.page = page;
            this.leaveListInit();
        },

        //获取客服列表
        getServiceList(){
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //更新留言状态
        updateLeaveStatus(){
            var data = {
                id: this.leaveId,
                status: this.leaveStatus
            }
            updatedLeave(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.leaveStatus = "0";
                    this.statusModal = false;
                    this.leaveListInit();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //分配留言
        allotLeaveService(){
            var data = {
                id: this.leaveId,
                allotId: this.allotId   //分配客服id（分配自己传-1，未分配传0）
            }
            allotLeave(data).then(res => {
                this.allotModal = false;
                if(res.code == 0){
                    this.leaveListInit();
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //筛选
        //创建时间
        selectCreateTime(date){
            this.leaveParams.create_start_timer = date.createTimeStart;
            this.leaveParams.create_end_timer = date.createTimeEnd;
        }
    },
    components:{
        datePicker
    }
}
</script>


<style lang="less">
    @import '../../static/css/filtrate.less';
    .leaveword{
        height: 100%;
        .leavewordWrap{
            height:100%;
            .group{
                width:220px;
                height:100%;
                overflow-y:auto;
                float:left;
                .addGroupBtn{
                    color:#12b7f5;
                    padding:10px;
                    cursor: pointer;
                }
                .addgroup{
                    i{  
                        font-size:18px;
                        cursor: pointer;
                        &.checkmark:hover{
                            color:#19be6b;
                        }
                        &.close:hover{
                            color:red;
                        }
                    }
                }
                .groupTitle{
                    .noGroup{
                        text-align: center;
                        line-height: 50px;
                    }
                    li{
                        height:45px;
                        line-height: 45px;
                        padding-left:5px;
                        cursor: pointer;
                        .operation{
                            display: none;
                        }
                        &:hover{
                            background:#61c4f5;
                            color:#fff;
                        }
                        &.selectItem{
                            background:#1ba8ed;
                            color:#fff;
                            &:hover{
                                background:#1ba8ed;
                            }
                        }
                        .title{
                            text-overflow:ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            display:inline-block;
                            float:left;
                            width:190px;
                        }
                        .edit:hover{
                            color:#19be6b;
                        }
                        .del:hover{
                            color:red;
                        }
                        &:hover .title{
                            width:calc(100% - 20px);
                        }
                        &:hover .operation{
                            display: inline-block;
                        }
                    }
                }
            }
            .listRight{
                margin-left:220px;
                padding-left:20px;
                border-left:1px solid #e7e7e7;
            }
        }
    }
    .leaveDrawerWrap{
        .leaveDrawer{
            color: #fff;
            span.leaveInfo{
                color:#000;
            }
            .ivu-form-item{
                margin-bottom:10px;
            }
            .remarkList{
                border-top:1px solid #e7e7e7;
                li{
                    padding:10px 0;
                    color:#333;
                    border-bottom:1px solid #e7e7e7;
                    &:last-child{
                        border:none;
                    }
                }
                .username{
                    font-size:13px;
                    margin-right:10px;
                }
                .date{
                    font-size:12px;
                    color:#a8a8a8;
                }
                .remarkContent{
                    line-height:30px;
                    padding:5px 0;
                }
            }
            .msgContent{
                margin-top:10px;
            }
        }
        .drawer-footer{
            width: 100%;
            padding: 10px 16px;
            text-align: right;
            background: #fff;
        }
    }
</style>
