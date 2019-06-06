<template>
    <div class="tickets"  @keydown.enter.prevent="replyMsg('message')" >
        <div style="height:100%;padding:10px;">
            <Card class="waitaccessWrap">
                <p slot="title">
                    工单
                </p>
                <div class="ticketsWrap clearfix configTop">
                    <div class="group elementScroll">
                        <div class="addGroupBtn" @click="addTickets"><i class="ivu-icon ivu-icon-md-add"></i>添加工单</div>
                        <div class="groupTitle">
                            <ul class="clearfix">
                                <li :class="{selectItem:pitch==0}" @click="changeTicketsList(1,null,null,0)">
                                    <div>
                                        <span class="title">我的未处理工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==1}" @click="changeTicketsList(2,null,null,1)">
                                    <div>
                                        <span class="title">我的处理中工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==3}" @click="changeTicketsList(null,1,null,3)">
                                    <div>
                                        <span class="title">我创建的工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==2}" @click="changeTicketsList(3,null,null,2)">
                                    <div>
                                        <span class="title">已解决工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==4}" @click="changeTicketsList(null,null,1,4)">
                                    <div>
                                        <span class="title">全部工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==5}" @click="changeTicketsList(0,null,null,5)">
                                    <div>
                                        <span class="title">未分配工单</span>
                                    </div>
                                </li>
                                <li :class="{selectItem:pitch==6}" @click="changeTicketsList(null,null,1,6)">
                                    <div>
                                        <span class="title">筛选工单</span>
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
        </div>
        
        <!-- 创建工单 -->
        <create-tickets  ref="createTicketRef" :ticketsData="createParams"></create-tickets>
        
        <!-- 查看详情 -->
        <Drawer :width="chatUserInfo.userToken?1200:950" v-model="detailModal" class="ticketsDrawer">
            <Spin v-if="showSpin" fix></Spin>
            <div class="drawerLeft" v-if="ticketData">
                <div class="head clearfix">
                    <div class="head_left clearfix">
                        <h3>
                            <Tag :color="status[ticketData.level].color">{{status[ticketData.level].value}}</Tag>
                            <span class="title">{{ticketData.title}}</span>
                        </h3>
                        <span>分配给:</span>
                        <Dropdown @on-click="changeService">
                            <a href="javascript:void(0)">
                                {{allocation}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <Dropdown placement="right-start" v-for="(item,index) in kfList" :key="index" v-if="item.list.length>0">
                                    <DropdownItem>
                                        {{item.name}}
                                        <Icon type="ios-arrow-forward"></Icon>
                                    </DropdownItem>
                                    <DropdownMenu slot="list">
                                        <DropdownItem v-for="(list, lIndex) in item.list" :key="lIndex" :name="list.id">{{list.username}}</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                    <div class="func">
                        <Button type="success" icon="md-checkmark-circle-outline" v-if="ticketData.ticket_status!=3" @click="sureSolve(3)">已解决</Button>
                        <Button type="success" icon="md-refresh" v-else @click="sureSolve(2)">重新打开</Button>
                    </div>
                </div>
                <div class="leaveDrawer">
                    <div>
                        <Scroll :distance-to-edge="[5,5]" :height="srcollHeight" id="chatScroll">
                            <div class="msgContent">
                                <ul>
                                    <li class="ticketsList create">
                                        <div class="title">
                                            <Icon type="md-add" />
                                            {{ticketData.publish_name}}
                                            <span>创建了新工单</span>
                                            <span>{{ticketData.createTime}}</span>
                                        </div>
                                        <div class="content">
                                            {{ticketData.content}}
                                            <ol class="detailAccessory" v-if="ticketData.attachments.length>0">
                                                <li v-for="(item,index) in ticketData.attachments" :key="index"><a :href="item">{{item}}</a></li>
                                            </ol>
                                            <div v-if="chatUserInfo.userToken">
                                                <Button type="primary" size="small" @click="lookChatLog">查看会话记录</Button>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="chatList clearfix" v-for="(item,index) in reply_list" :key="index">
                                        <!-- 更新工单 -->
                                        <div class="ticketsList" v-if="item.type!='message' && item.type!='file' && item.type!='image'">
                                            <div class="title">
                                                <Icon v-if="item.type=='create'" type="md-add" />  
                                                <Icon v-if="item.type=='update'" type="md-refresh" />  
                                                <Icon v-if="item.type=='allot'" type="ios-send" class="redeploy" />
                                                <Icon v-if="item.type=='done'" type="md-checkmark" class="checkmark" />
                                                {{item.publish_name}}
                                                <span>{{item.content}}</span>
                                                <span>{{item.createTime}}</span>
                                            </div>
                                        </div>
                                        <div class="message" v-else>
                                            <div class="title">
                                                <img v-if="item.publish_head_img" :src="item.publish_head_img"/>
                                                <svg class="icon" v-else aria-hidden="true" style="width:20px;height:20px;"><use xlink:href="#icon-morentouxiang"></use></svg>
                                                <span class="serviceName">{{item.publish_name}}</span>
                                                <span class="date">{{item.createTime}}</span>
                                            </div>
                                            <div class="msgText">
                                                <img class='imageMsg' v-if="item.type=='image'" :src='item.Content'/>
                                                <a :href="item.content" v-else-if="item.type=='file'" target="_blank">{{item.content}}</a>
                                                <div class="voice" v-else-if="item.type=='voice'">
                                                    <div class="voiceWrap" @click="playVoice(index)">
                                                        <img :src="item.voiceImg">
                                                        <span v-if="item.Content.duration">{{item.Content.duration}}”</span>
                                                    </div>
                                                    <p>{{item.Content.text}}</p>
                                                </div>
                                                <div v-else class="msg" v-html="item.content"></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="chatList clearfix" v-if="uploading">
                                        <img class='imageMsg' src='../../images/uploading.gif'/>
                                    </li>
                                </ul>
                            </div>
                        </Scroll>
                        <div class="textareaBox">
                            <div>
                                <div class="func">
                                    <Tooltip content="上传文件" class="funcHint">
                                        <Upload :action="fileAction"
                                            :show-upload-list="false"
                                            :on-exceeded-size="exceededSize"
                                            :on-format-error="handleFormatError"
                                            :on-success="fileSuccess"
                                            :before-upload="beforeUpload"
                                            :data="upLoadData"
                                            name="file"
                                            style="display:inline-block;">
                                            <a href="javascript:;" class="file"></a>
                                        </Upload>
                                    </Tooltip>
                                </div>
                                <textarea class="textarea" id="editText" v-model="replyContent"></textarea>
                                <Button type="primary" class="sendBtn" @click="sendReply">发送</Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- 用户信息 -->
            <user-tag :chatUserInfo="chatUserInfo" v-show="chatUserInfo.userToken" type="tickets"></user-tag>
        </Drawer>
        <!-- 会话记录 -->
        <chat-log :chatUserInfo="chatUserInfo" ref="loadTaskLog"></chat-log>
        <!-- 筛选 -->
        <Drawer v-model="visibleModal" width="350" scrollable  class="filtrateWrap">
            <div slot="header" class="topTitle">
                <span :class="{selectIn: filIndex==1}" @click="filIndex=1,filparams={},initFilList()">搜索筛选</span>
                <span :class="{selectIn: filIndex==2 || filIndex==3}" @click="filIndex=2,filList()">自定义筛选</span>
            </div>
            <div class="filtrate elementScroll" v-if="filIndex==1 || filIndex==3">
                <Form label-position="top" class="filtrateItem">
                    <FormItem label="自定义筛选名称" v-if="filIndex==3">
                        <Input placeholder="请填写自定义筛选名称" clearable v-model="createfilName"></Input>
                    </FormItem>
                    <FormItem label="标题" v-if="condition[0].status">
                        <Input placeholder="请填写标题" clearable v-model="filparams.title"></Input>
                        <span class="del" @click="delFilItem(0)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="工单号" v-if="condition[1].status">
                        <Input placeholder="请填写工单号" clearable v-model="filparams.ticket_id"></Input>
                        <span class="del" @click="delFilItem(1)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="创建人" v-if="condition[2].status">
                        <Select transfer clearable v-model="filparams.publish_id" multiple filterable>
                            <Option v-for="(list, lIndex) in kfFilList" :value="list.id" :label="list.username" :key="lIndex"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(2)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="处理人" v-if="condition[3].status">
                        <Select transfer clearable v-model="filparams.transactor" multiple filterable>
                            <Option v-for="(list, lIndex) in kfFilList" :value="list.id" :label="list.username" :key="lIndex"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(3)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="优先级" v-if="condition[4].status">
                        <RadioGroup v-model="filparams.level">
                            <Radio label="0">低</Radio>
                            <Radio label="1">中</Radio>
                            <Radio label="2">高</Radio>
                            <Radio label="3">紧急</Radio>
                        </RadioGroup>
                        <span class="del" @click="delFilItem(4)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="创建时间" v-if="condition[5].status">
                        <date-picker @changeTime="createTimer" :value="createDate"></date-picker>
                        <span class="del" @click="delFilItem(5)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="解决时间" v-if="condition[6].status">
                        <date-picker @changeTime="doneTime" :value="doneDate"></date-picker>
                        <span class="del" @click="delFilItem(6)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="工单分类" v-if="condition[7].status">
                        <Select transfer clearable v-model="filparams.category">
                            <Option v-for="(item,index) in ticketsTag" :key="index" :value="item.id">{{item.ticket_name}}</Option>
                        </Select>
                        <span class="del" @click="delFilItem(7)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="工单状态" v-if="condition[8].status">
                        <Select transfer clearable v-model="filparams.status">
                            <Option value="0">未处理</Option>
                            <Option value="1">处理中</Option>
                            <Option value="2">已解决</Option>
                            <Option value="3">未分配</Option>
                        </Select>
                        <span class="del" @click="delFilItem(8)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="工单内容" v-if="condition[9].status">
                        <Input placeholder="请填写工单内容" clearable v-model="filparams.content"></Input>
                        <span class="del" @click="delFilItem(9)"><Icon type="ios-remove-circle-outline" />移除</span>
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
                    <li v-for="(item, index) in filData" :key="index" @click="ticketsFiltrate(item.id)">
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
import '../../static/font/iconfont.js'; 
import { url, beyondSize, getNowFormatDate, filtrateData } from '@/mixins/mixin';
import userTag from '@/views/my-components/user-tag/usertag';
import chatLog from '@/views/my-components/chat-log/chat-log';
import {getTicketsList, getService, ticketsDetails, ticketsAllot, ticketsReply, ticketsClassify, updateTicketStatus,
        addCustom, getCustomList, getCustomDetails, updateCustom, deleteTicket } from '@/libs/api';
import datePicker from '@/views/my-components/date-picker/date-picker';    //日期选择
import delfilItem from '@/views/my-components/filtrate/delfilItem';        //删除筛选条件
import createTickets from '@/views/chat/components/createTickets';
export default {
    mixins:[url, beyondSize, getNowFormatDate, filtrateData],
    data(){
        return {
            pitch:0,
            resData:[],
            totalCount:0,
            showLoading:true,
            detailModal:false,    //show 详情
            showSpin:false,    //加载详情
            chatUserInfo:"",
            srcollHeight:0,   //聊天框高度
            ticketData:"",    //工单详情
            reply_list:[],     //回复内容列表
            columnsData: [
                {
                    key: 'id',
                    title: '工单号',
                    width: 80
                },
                {
                    key: 'title',
                    title: '标题',
                    minWidth:150,
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
                    key: 'publisher',
                    title: '创建人'
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
                    key: 'transactor_name',
                    title: '分配'
                },
                {
                    key: 'ticket_status',
                    title: '状态',
                    render:(h,params) => {
                        var str = "";
                        switch (params.row.ticket_status) {
                            case 0:
                                str = "未分配"  
                                break;
                            case 1:
                                str = "未处理"  
                                break;
                            case 2:
                                str = "处理中"  
                                break;
                            case 3:
                                str = "已解决"  
                                break;
                            default:
                                break;
                        }
                        return h('div',str);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:200,
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
                                        this.createParams = params.row;
                                        this.createParams.ticket_id = params.row.id;
                                        this.$refs.createTicketRef.createTickets(this.createParams);
                                    }
                                }
                            }, '编辑'),
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
                                        this.detailModal = true;
                                        this.chatUserInfo = {};
                                        this.chatUserInfo = {
                                            userToken: params.row.userToken,
                                            taskToken: params.row.taskToken,
                                            nickname: params.row.publisher,
                                            headImg: params.row.publisher_head_img,
                                        }
                                        this.getTicketsDetails(params.row.id);
                                    }
                                }
                            }, '查看详情'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除此工单吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.delTicket(params.row.id);
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
                            ])
                        ])
        
                    }
                }  
            ],
            fileAction:'', //上传文件路径
            uploading:false,
            upLoadData:{},
            kfList:[],  //客服列表
            params:{    //工单列表参数
                page:1,
                status:1,  //状态（0未分配 1未处理 2处理中 3已解决）
                create:0,  //我创建的
            },
            filparams:{},
            createParams:{attachments:[]},  //创建工单参数
            createBtn:false,  //创建工单loading
            status:[
                {color:"#a3a3a3",value:"低"},
                {color:"primary",value:"中"},
                {color:"warning",value:"高"},
                {color:"error",value:"紧急"},
            ],
            allocation:"请选择",
            replyContent:'',    //工单回复内容
            ticketsTag:[],      //工单分类
            condition:[         //筛选条件                       
                {id:0, label:'标题',status:1, value:'title'},
                {id:1, label:'工单号',status:1, value:'ticket_id'},
                {id:2, label:'创建人',status:1, value:'publish_id'},
                {id:3, label:'处理人',status:1, value:'transactor'},
                {id:4, label:'优先级',status:1, value:'level'},
                {id:5, label:'创建时间',status:1, value:'create_start_timer'},
                {id:6, label:'解决时间',status:0, value:'done_start_timer'},
                {id:7, label:'工单分类',status:0, value:'category'},
                {id:8, label:'工单状态',status:0, value:'status'},
                {id:9, label:'工单内容',status:0, value:'content'}
            ],
            createDate:[],  //创建时间
            doneDate:[],    //解决时间
        }
    },
    computed: {
        systemTicketsMsgId(){
            return this.$store.state.app.systemTicketsMsgId;
        }
    },
    mounted(){  
        var type = this.$route.query.type;
        var id = this.$route.query.id;
        if(type){
            // 0 今日创建工单  1今日未分配  2今日未处理  3今日处理中  4今日已解决
            switch (type) {
                case '0':
                    this.changeTicketsList(null,null,1,4)   
                    break;
                case '1':
                    this.changeTicketsList(0,null,null,5)
                    break;
                case '2':
                    this.changeTicketsList(1,null,null,0)
                    break;
                case '3':
                    this.changeTicketsList(2,null,null,1) 
                    break;
                case '4':
                    this.changeTicketsList(3,null,null,2)
                    break;
                default:
                    break;
            }
        }else if(id){
            this.detailModal = true;
            this.changeTicketsList(null,null,1,4); 
            this.getTicketsDetails(id); 
            this.$store.commit('setTicketsId', '');
            this.$router.push({
                query:{}
            })
        }
        else{
            this.initTickets();
        }
        


        this.fileAction = `${url}api/task/upload-file.htm`;
        window.onresize = () => {
            this.chatUserSize();   
        }
        this.chatUserSize(); 
        this.getServiceList();  //客服列表
        this.initTicketsTag();  //工单分类列表
        this.getFilService();   //获取筛选客服列表
    },
    methods:{
        //上传之前
        beforeUpload(){
            this.uploading = true;
            this.upLoadData = {
                'Access-Token':this.$store.state.app.access_token,
            }  
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            this.chatWindBottom();
            return promise;
        },
        //加载工单列表
        initTickets(){
            this.showLoading = true;
            // status   0未分配 1未处理 2处理中 3已解决
            // create	int	否	我创建的
            // all	int	否	全部工单
            getTicketsList(Object.assign({},this.filparams, this.params)).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.createfilName = "";
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                    this.filparams = {};
                    
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //切换工单状态
        changeTicketsList(status, create, all, pitch){
            this.pitch = pitch;
            this.params.status = status;
            this.params.create = create;
            if(status == null){
                delete this.params.status;
            }
            if(all){
            //全部工单
                this.params = { page:1 }
            }
            if(pitch == 6){
            //筛选工单
                this.visibleModal = true;
                this.filparams = {};
                this.initFilList();
                if(this.filIndex == 3){
                    this.filIndex = 2;
                }
            }else{
            //其他状态
                this.filparams = {};
                this.visibleModal = false;
            }

            this.initTickets();
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

        //分配工单
        changeService(name){
            if(!name) return false;
            var data = {
                ticket_id: this.ticketData.id,
                transactor:name,
            }
            ticketsAllot(data).then(res =>{
                if(res.code == 0){
                    this.detailModal = false;
                    this.initTickets();
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //已解决
        sureSolve(type){
            var data = {
                ticket_status: type,
                ticket_id: this.ticketData.id
            }
            updateTicketStatus(data).then(res => {
                if(res.code == 0){
                    this.detailModal = false;
                    this.$Notice.success({title: res.msg});
                    this.initTickets();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },


        //打开工单详情
        getTicketsDetails(id){
            this.uploading = false;
            ticketsDetails({ticket_id: id}).then(res => {
                if(res.code == 0){
                    this.reply_list = res.data.reply_list;
                    this.ticketData = res.data.ticket;
                    this.ticketData.level = Number(res.data.ticket.level);
                    //分配的客服
                    this.allocation = this.ticketData.transactor_name;
                    this.chatWindBottom();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //回复工单
        replyMsg(type){
            var data = {
                ticket_id: this.ticketData.id,
                content: this.replyContent,
                type: type
            }
            ticketsReply(data).then(res => {
                if(res.code == 0){
                    var str = {
                        content: this.replyContent,
                        createTime: this.getNowFormatDate(),
                        publish_head_img: this.$store.state.app.serviceInfo.headImg,
                        publish_name: this.$store.state.app.serviceInfo.username,
                        type: type
                    }
                    this.reply_list.push(str);
                    this.replyContent = "";
                    this.chatWindBottom();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //聊天窗口滚动条到底部
        chatWindBottom(){
            setTimeout(() => {
                this.$nextTick(() => {
                    if(document.querySelector('.ivu-scroll-container')){
                        var h = document.querySelector('.ivu-scroll-container');
                        h.scrollTop  = h.scrollHeight;
                    }
                })
            }, 50);
        },

        //添加工单btn
        addTickets(){
            this.createParams = '';
            this.$refs.createTicketRef.createTickets();
        },


        //发送文本回复消息
        sendReply(){
            if(this.replyContent){
                this.replyMsg('message');
            }
        },  

        //分页
        changeNum(page){
            this.params.page = page;
            this.initTickets();
        },

        //工单回复详情高度
        chatUserSize(){
            let fullHeight = document.documentElement.clientHeight - 217;
            this.srcollHeight = fullHeight;
        },

        //工单分类
        initTicketsTag(){
            ticketsClassify().then(res => {
                if(res.code == 0){
                    this.ticketsTag = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //查看会话记录
        lookChatLog(){
            this.$refs.loadTaskLog.loadChatLog(true);
        },

        //筛选
        //选择创建时间
        createTimer(date){
            this.filparams.create_start_timer = date.createTimeStart;
            this.filparams.create_end_timer = date.createTimeEnd;
        },

        //解决时间
        doneTime(date){
            this.filparams.done_start_timer = date.createTimeStart;
            this.filparams.done_end_timer = date.createTimeEnd;
        },

        //筛选
        filtrateBtn(){
            this.initTickets();
            this.params.page = 1;
            this.visibleModal = false;
        },

        //保存自定义筛选
        saveFil(){
            var data = {
                title: this.createfilName,
                category: 'tickets',
                attachments: JSON.stringify(this.filparams)
            }
            addCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.initTickets();
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //文件上传成功
        fileSuccess(res,file) {
            this.uploading = false;
            if(res.code == 0){
                this.replyContent = res.data.pic;
                this.replyMsg('file');
            }else{
                this.$Notice.error({title: res.msg});
            }
        },

        //获取自定义筛选列表
        filList(){
            getCustomList({category: 'tickets'}).then(res => {
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
                        //创建时间
                        if(this.filparams.create_start_timer){
                            this.createDate = [this.filparams.create_start_timer, this.filparams.create_end_timer];
                        }
                        //解决时间
                        if(this.filparams.done_start_timer){
                            this.doneDate = [this.filparams.done_start_timer, this.filparams.done_end_timer];
                        }
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
                category: 'tickets',
                attachments: JSON.stringify(this.filparams),
                custom_id: this.custom_id
            }
            updateCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.$Notice.success({title: res.msg});
                    this.initTickets();
                    this.filIndex = 1;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
        
        //点击自定义筛选列表
        ticketsFiltrate(id){
            this.filparams.search_id = id;
            this.initTickets();
            this.visibleModal = false;
        },

        //删除工单
        delTicket(id){
            deleteTicket({ticket_id: id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.initTickets();
                }else{
                   this.$Notice.error({title: res.msg}); 
                }
            })
        }
    },
    watch: {
        systemTicketsMsgId(n ,o){
            if(n != ''){
                this.detailModal = true;
                this.getTicketsDetails(this.$store.state.app.systemTicketsMsgId); 
                this.$store.commit('setTicketsId', '');
                this.$router.push({
                    query:{}
                })
            }
        }
    },
    components:{
        userTag,
        chatLog,
        datePicker,
        createTickets
    }
}
</script>


<style lang="less">
    @import './tickets.less';
    @import '../../static/css/filtrate.less';
</style>
