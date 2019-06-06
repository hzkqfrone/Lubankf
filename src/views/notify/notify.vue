<template>
    <div class="notify">
        <div style="height:100%;padding:10px;">
            <Card class="waitaccessWrap">
                <p slot="title">
                    消息中心
                </p>
                <Button type="primary" @click="sendNewNotify" style="margin-bottom:10px;">发送新通知</Button>
                <div class="notifyWrap clearfix configTop">
                    <Tabs value="0" @on-click="selectTabs">
                        <TabPane label="全部消息" name="0"></TabPane>
                        <TabPane label="未读消息" name="1"></TabPane>
                        <TabPane label="已读消息" name="2"></TabPane>
                    </Tabs>
                    <div class="group elementScroll">
                        <div class="groupTitle">
                            <ul class="clearfix">
                                <li :class="{selectItem:params.type==0}" @click="params.type=0,initMessageList()">
                                    <div>
                                        <span class="title">全部消息通知</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:params.type==2}" @click="params.type=2,initMessageList()">
                                    <div>
                                        <span class="title">管理员通知</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:params.type==1}" @click="params.type=1,initMessageList()">
                                    <div>
                                        <span class="title">系统消息</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="listRight elementScroll">
                        <Table :loading="showLoading" stripe :columns="columnsData" :row-class-name="rowClassName" :data="resData" @on-row-click="clickRow"></Table>
                        <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
                        <Button v-if="totalCount>0 && params.status!=2" class="allUpdate" @click="allUpdate">全部标记为已读</Button>
                    </div>
                </div>
            </Card>
        </div>
        <Modal
            v-model="notifyModal"
            title="发送新通知">
            <div style="padding:10px 0 30px 0">
                <Form :label-width="80">
                    <FormItem label="标题">
                        <Input type="text" v-model="sendNotify.title" placeholder="标题"/>
                    </FormItem>
                    <FormItem label="收件人">
                        <div>
                            <Tag closable v-for="(item,index) in kfArr" :key="index" :name="index" @on-close="closeTag">{{item.value}}</Tag>
                        </div>
                        <Dropdown @on-click="changeService" placement="bottom-start">
                            <Button>
                                请选择
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="-1">全部</DropdownItem>
                                <Dropdown placement="right-start" v-for="(item,index) in kfList" :key="index" v-if="item.list.length>0">
                                    <DropdownItem :name="'group'+item.id">
                                        {{item.name}}
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-for="(list, lIndex) in item.list" :key="lIndex" :name="list.group + 's' + list.id">{{list.username}}</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownMenu>
                        </Dropdown>
                    </FormItem>
                    <FormItem label="消息等级">
                        <RadioGroup v-model="sendNotify.level">
                            <Radio label="0">低</Radio>
                            <Radio label="1">中</Radio>
                            <Radio label="2">高</Radio>
                            <Radio label="3">紧急</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="内容">
                        <Input type="textarea" :rows="5" placeholder="内容" v-model="sendNotify.content"/>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="notifyCancel">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="sendBtn">发送</Button>
            </div>
        </Modal>

        <!-- 查看消息详情 -->
        <Drawer width="640" v-model="showDrawer" class="notifydetail">
            <h3><Tag :color="status[detailInfo.if_read].color">{{status[detailInfo.if_read].value}}</Tag>{{detailInfo.title}}</h3>
            <div class="contentWrap">
                <Form :label-width="80">
                    <FormItem label="创建人"><span class="leaveInfo">{{detailInfo.create_uid}}</span></FormItem>
                    <FormItem label="创建时间"><span class="leaveInfo">{{detailInfo.create_time}}</span></FormItem>
                    <FormItem label="内容"><span class="leaveInfo">{{detailInfo.content}}</span></FormItem>
                    <FormItem label=" "><span class="leaveInfo" v-html="detailInfo.link"></span></FormItem>
                </Form>
            </div>
        </Drawer>
    </div>
</template>

<script>
import {getMessageList, seeMessage, addMessage, getService} from '@/libs/api';
export default {
    data(){
        return {
            showDrawer:false,
            notifyModal:false,  //发送新通知modal
            sendNotify:{//新通知参数
                receive_uid:[],
                group:[]
            },     
            kfList:[],  //客服列表
            btnLoading:false,
            resData:[],
            totalCount:0,
            showLoading:false,
            params:{type:0,status:0,page:1},
            columnsData: [
                {
                    key: 'title',
                    title: '标题',
                    render:(h,params) => {
                        var n = Number(params.row.level);
                        return h('div',[
                            h('Tag',{
                                props:{
                                    color: this.status[n].color
                                }
                            },this.status[n].value),
                            h('span',params.row.title)
                        ])
                    }
                },
                {
                    key: 'content',
                    title: '内容'
                },
                {
                    key: 'create_time',
                    title: '日期'
                },
            ],
            kfArr:[],   //选中的收件人
            detailInfo:{if_read:0},
            ids:[],
            status:[
                {color:"#a3a3a3",value:"低"},
                {color:"primary",value:"中"},
                {color:"warning",value:"高"},
                {color:"error",value:"紧急"},
            ],
        }
    },
    mounted(){
        this.initMessageList();
        this.getServiceList();
    },
    methods:{
        //加载消息列表
        initMessageList(){
            this.showLoading = true;
            getMessageList(this.params).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.totalCount = Number(res.total);
                    this.resData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },


        changeNum(page){
            this.params.page = page;
            this.initMessageList();
        },

        //单击某一行时触发
        clickRow(row){
            this.detailInfo = row;
            this.detailInfo.if_read = Number(this.detailInfo.if_read);
            
            this.showDrawer = true;
            this.ids = [row.id];
            if(this.detailInfo.if_read==0){
                this.notifySee();
            }
        },

        //全部标记为已读
        allUpdate(){
            this.ids = [];
            this.resData.forEach(e =>{
                this.ids.push(e.id);
            })
            this.notifySee();
        },
        
        notifySee(){
            seeMessage({id: this.ids}).then(res => {
                if(res.code == 0){
                    this.initMessageList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        // 改变颜色
        rowClassName (row,index) {
            if(row.if_read == "0"){
                return 'table-info-row';
            }
        },

        //切换消息类型列表
        selectTabs(status){
            this.params.status = status;
            this.initMessageList();
        },

        //	获取客服列表
        getServiceList(){
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //选择客服
        changeService(name){
            var group = name.indexOf("group")>-1 ? name.split("group")[1] : name;
            var s = name.indexOf("s")>-1 ? name.split("s")[1] : name;
            var t = name.indexOf("s")>-1 ? name.split("s")[0] : name;
            if(name == -1 && this.serviceReplace(group,"全部")){
                this.kfArr = [];
                this.kfArr.push({id:name,value:'全部'});
                return 
            }else{
                this.kfList.forEach(e => {
                    if(name.indexOf("group")>-1){
                        if(e.id == group && this.serviceReplace(group,e.name)){
                            this.kfArr.push({id:e.id,value:e.name,type:'group'});
                            this.deleteService(e.list);
                        }
                    }else{
                        e.list.forEach(list => {
                            if(list.id == s && this.serviceReplace(s,list.username) && this.hasGroup(t)){
                                this.kfArr.push({id:list.id,value:list.username});
                            }
                        })
                    }
                })
                this.kfArr.forEach((value, index) => {
                    if(value.value == '全部'){
                        this.kfArr.splice(index,1);
                    }
                })
            }
        },

        //删除客服列表
        closeTag(event,index){
            this.kfArr.splice(index,1);
        },

        //选择收件人组 -》 删除已选择组的成员
        deleteService(data){
            data.forEach(e => {
                this.kfArr.forEach((v, index) => {
                    if(e.id == v.id){
                        this.kfArr.splice(index, 1);
                    }
                })
            })
        },

        //选择收件人组内成员-》 已选中该组的话不允许再选择该组下的成员
        hasGroup(id){
            var handel = true;
            this.kfArr.forEach(e => {
                if(e.type == "group" && e.id == id){
                    handel = false;
                }
            })
            return handel;
        },

        serviceReplace(str,name){
            var tag = true;
            this.kfArr.forEach(k => {
                if(k.id == str && k.value == name){
                    tag = false;
                }
            })
            return tag;
        },
        

        //点击发送新通知btn
        sendNewNotify(){
            this.sendNotify = {receive_uid:[],group:[]};
            this.kfArr = [];
            this.notifyModal = true;
        },

        //取消发送新通知
        notifyCancel(){
            this.sendNotify = {receive_uid:[],group:[]}
            this.kfArr = [];
            this.notifyModal = false;
        },

        //发送
        sendBtn(){
            if(this.kfArr.length<1){
                this.$Notice.error({title: "请选择收件人"});
                return;
            }else if(!this.sendNotify.title){
                this.$Notice.error({title: "请填写标题"});
                return;
            }else if(!this.sendNotify.content){
                this.$Notice.error({title: "请填写内容"});
                return;
            }
            this.sendNotify.if_all = 0;
            this.kfArr.forEach(e => {
                //全部
                if(e.id == -1){
                    this.sendNotify.if_all = 1;
                }else if(e.type == "group"){
                    //收技能组
                    this.sendNotify.group.push(e.id);
                } else{
                    //接收人
                    this.sendNotify.receive_uid.push(e.id);
                }
            })
            this.btnLoading = true;
            addMessage(this.sendNotify).then(res => {
                this.btnLoading = false;
                if(res.code == 0){
                    this.notifyModal = false;
                    this.$Notice.success({title: res.msg});
                    this.sendNotify = {receive_uid:[],group:[]}
                    this.kfArr = [];
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }
    }
}
</script>


<style lang="less">
    .notify{
        height: 100%;
        .isPage{
            display: inline-block;
        }
        .allUpdate{
            float:right;
            margin-top:10px;
        }
        .notifyWrap{
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
                .ivu-table .table-info-row td {
                    background: #fffad5 !important;
                }
                .ivu-table-tbody{
                    cursor: pointer;
                }
            }
        }
    }
    .notifydetail{
        font-size:14px;
        h3{
            padding-bottom: 15px;
            border-bottom:1px solid #e7e7e7;
        }
        .ivu-form-item{
            margin-bottom:10px;
        }
        .title{
            padding-bottom:15px;
            font-size: 15px;
        }
    }
</style>
