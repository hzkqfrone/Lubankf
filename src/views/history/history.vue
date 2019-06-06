<template>
    <div class="history">
        <Card class="historyWrap">
            <p slot="title">
                历史会话
            </p>
            <div slot="extra">
                <Button type="success" icon="ios-funnel-outline" @click="showFiltrate"> 筛选</Button>
            </div>
            <Table :loading="showLoading" stripe :columns="columnsData" :data="resData"></Table>
            <Page class="isPage" :page-size="30" :total="totalCount" show-total show-elevator  @on-change="changeSize"/>
        </Card>
        <chat-log :chatUserInfo="chatUserInfo" ref="loadTaskLog"></chat-log>

        <!-- 筛选 -->
        <Drawer v-model="visibleModal" width="350" scrollable  class="filtrateWrap">
            <div slot="header" class="topTitle">
                <span :class="{selectIn: filIndex==1}" @click="filIndex=1,filparams={},selectTag=[],initFilList()">搜索筛选</span>
                <span :class="{selectIn: filIndex==2 || filIndex == 3}" @click="filIndex=2,filList()">自定义筛选</span>
            </div>
            <div class="filtrate elementScroll" v-if="filIndex==1 || filIndex == 3">
                <Form label-position="top" class="filtrateItem">
                    <FormItem label="自定义筛选名称" v-if="filIndex==3">
                        <Input placeholder="请填写自定义筛选名称" clearable v-model="createfilName"></Input>
                    </FormItem>
                    <FormItem label="用户名称" v-if="condition[0].status">
                        <Input placeholder="请填写用户名称" clearable v-model="filparams.username"></Input>
                        <span class="del" @click="delFilItem(0)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="会话时间" v-if="condition[1].status">
                        <date-picker @changeTime="selectCreateTime" :vlue="createTaskTime"></date-picker>
                        <span class="del" @click="delFilItem(1)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="客服" v-if="condition[2].status">
                        <Select transfer clearable v-model="filparams.agent_id" multiple filterable>
                            <Option v-for="(list, lIndex) in kfFilList" :value="list.id" :label="list.username" :key="lIndex"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(2)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="技能组" v-if="condition[3].status">
                        <Select filterable transfer clearable v-model="filparams.group_id">
                            <Option v-for="(list, index) in kfGroup" :value="list.id" :label="list.name" :key="index"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(3)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="标签" v-if="condition[4].status">
                        <div><Tag v-if="selectTag.length>0" v-for="(item, index) in selectTag" :color="item.color" :key="index">{{item.name}}</Tag></div>
                        <Poptip placement="bottom-start" width="200" transfer clearable>
                            <a href="javascript:;">请选择 <Icon type="ios-arrow-down"></Icon></a>
                            <div class="api" slot="content">
                                <CheckboxGroup v-model="filparams.tags" @on-change="changeTag">
                                    <Checkbox v-for="(item, index) in tagArr" :key="index" :label="item.id" style="display:block;"><Tag :color="item.color">{{item.name}}</Tag></Checkbox>
                                </CheckboxGroup>
                            </div>  
                        </Poptip>
                        <span class="del" @click="delFilItem(4)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="电话" v-if="condition[5].status">
                        <Input placeholder="请输入电话" clearable v-model="filparams.mobile"></Input>
                        <span class="del" @click="delFilItem(5)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="微信" v-if="condition[6].status">
                        <Input placeholder="请输入微信" clearable  v-model="filparams.wechat"></Input>
                        <span class="del" @click="delFilItem(6)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="地址" v-if="condition[7].status">
                        <Input placeholder="请输入地址" clearable v-model="filparams.address"></Input>
                        <span class="del" @click="delFilItem(7)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="邮箱" v-if="condition[8].status">
                        <Input placeholder="请输入邮箱" clearable v-model="filparams.email"></Input>
                        <span class="del" @click="delFilItem(8)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="备注" v-if="condition[9].status">
                        <Input placeholder="请输入备注" clearable v-model="filparams.notes"></Input>
                        <span class="del" @click="delFilItem(9)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="IP" v-if="condition[10].status">
                        <Input placeholder="请输入IP" clearable v-model="filparams.ip"></Input>
                        <span class="del" @click="delFilItem(10)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="渠道" v-if="condition[11].status">
                        <Select filterable transfer clearable v-model="filparams.channel">
                            <Option v-for="(list, index) in sourceInfo" :value="list.code" :label="list.label" :key="index"></Option>
                        </Select>
                        <span class="del" @click="delFilItem(11)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="来源关键字" v-if="condition[12].status">
                        <Input placeholder="请输入来源关键字" clearable v-model="filparams.seoKeyword"></Input>
                        <span class="del" @click="delFilItem(12)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="上级来源" v-if="condition[13].status">
                        <Input placeholder="请输入上级来源" clearable v-model="filparams.parentUrl"></Input>
                        <span class="del" @click="delFilItem(13)"><Icon type="ios-remove-circle-outline" />移除</span>
                    </FormItem>
                    <FormItem label="会话来源" v-if="condition[14].status">
                        <Input placeholder="请输入会话来源" clearable v-model="filparams.taskUrl"></Input>
                        <span class="del" @click="delFilItem(14)"><Icon type="ios-remove-circle-outline" />移除</span>
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
            </div>
            <!-- 自定义筛选列表 -->
            <div class="filtrateList" v-if="filIndex==2">
                <ul class="elementScroll" v-if="filData.length > 0">
                    <li v-for="(item, index) in filData" :key="index" @click="taskChatFiltrate(item.id)">
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
            <div class="demo-drawer-footer">
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
import { getUserList, getService, getTagInfo, addCustom, getCustomList, getCustomDetails, updateCustom } from '@/libs/api.js';
import {formDate, formDate02, filtrateData} from '@/mixins/mixin';
import datePicker from '@/views/my-components/date-picker/date-picker';    //日期选择
export default {
    mixins:[formDate, formDate02, filtrateData],
    data(){
        return {
            showLoading:false,
            chatUserInfo:{},
            totalCount:0,
            columnsData:[
                 {
                    key: 'nickname',
                    title: '昵称',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('p',{
                                attrs:{
                                    title: params.row.nickname
                                },
                                style:{
                                    'text-overflow': 'ellipsis',
                                    'white-space': 'nowrap',
                                    overflow: 'hidden'
                                }
                            },params.row.nickname)
                    }
                },
                {
                    key: 'email',
                    title: '发起时间',
                    minWidth: 80,
                    render: (h, params) => {
                        return h("div",params.row.task.CreateTime);
                    }
                },
                {
                    key: 'group',
                    title: '技能组',
                    minWidth: 80
                },
                {
                    key: 'agent',
                    title: '客服名',
                    minWidth: 80
                },
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
                    width:100,
                    render: (h, params) => {
                        let btns = [];
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
                                        this.getTaskChatLog(params.index)
                                    }
                                }
                            }, '查看会话')
                        )
                        return h("div",btns)
                    }
                }  
            ],
            resData:[],
            params:{
                tag:2,
                page:1
            },
            kfList:[],              //客服列表
            chatDate:[],            //会话时间
            tagArr:[],              //用户标签
            condition:[         //筛选条件
                {id:0, label:'用户名称',status:1, value:'username'},
                {id:1, label:'会话时间',status:1, value:'task_start_timer'},
                {id:2, label:'客服',status:1, value:'agent_id'},
                {id:3, label:'技能组',status:1, value:'group_id'},
                {id:4, label:'标签',status:1, value:'tags'},
                {id:5, label:'电话',status:1, value:'mobile'},
                {id:6, label:'微信',status:1, value:'wechat'},
                {id:7, label:'地址',status:0, value:'address'},
                {id:8, label:'邮箱',status:0, value:'email'},
                {id:9, label:'备注',status:0, value:'notes'},
                {id:10, label:'IP',status:0, value:'ip'},
                {id:11, label:'渠道',status:0, value:'channel'},
                {id:12, label:'来源关键字',status:0, value:'seoKeyword'},
                {id:13, label:'上级来源',status:0, value:'parentUrl'},
                {id:14, label:'会话来源',status:0, value:'taskUrl'},
            ],
            selectTag:[],     //筛选选中的标签
        }                             
    },
    mounted() {
        this.getChatLog();       //历史会话列表
    },
    methods:{
        //加载历史会话
        getChatLog(){
            this.showLoading = true;
            getUserList(Object.assign({}, this.params, this.filparams)).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    if(res.data.list) this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount)
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
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

        //下一页
        changeSize(page){
            this.params.page = page;
            this.getChatLog();
        },

        //查看某条会话 历史记录
        getTaskChatLog(index){
            this.chatUserInfo = this.resData[index];
            this.chatUserInfo.history = true;
            this.$refs.loadTaskLog.loadChatLog(true);
        },

        //加载标签
        getTagList(){
            getTagInfo().then(res => {
                if(res.code == 0){
                    this.tagArr = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //筛选
        //选择日期
        selectCreateTime(date){
            this.filparams.task_start_timer = date.createTimeStart;
            this.filparams.task_end_timer = date.createTimeEnd;
        },

        //筛选
        filtrateBtn(){
            this.getChatLog();
            this.visibleModal = false;
            this.params.page = 1;
        },
        
        //保存自定义筛选
        saveFil(){
            var data = {
                title: this.createfilName,
                category: 'history',
                attachments: JSON.stringify(this.filparams)
            }
            addCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.$Notice.success({title: res.msg});
                    this.getChatLog();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取自定义筛选列表
        filList(){
            getCustomList({category: 'history'}).then(res => {
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
                        //会话时间
                        if(this.filparams.create_start_timer){
                            this.createTaskTime = [this.filparams.create_start_timer, this.filparams.create_end_timer];
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
                category: 'history',
                attachments: JSON.stringify(this.filparams),
                custom_id: this.custom_id
            }
            updateCustom(data).then(res => {
                if(res.code == 0){
                    this.visibleModal = false;
                    this.$Notice.success({title: res.msg});
                    this.getChatLog();
                    this.filIndex = 1;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //点击自定义筛选列表
        taskChatFiltrate(id){
            this.filparams.search_id = id;
            this.getChatLog();
            this.visibleModal = false;
        },

        changeTag(data,value){
            this.selectTag = [];
            data.forEach(element => {
                this.tagArr.forEach(v => {
                    if(element == v.id){
                        this.selectTag.push(v);
                    }
                })
            });
        },

        //显示筛选
        showFiltrate(){
            this.visibleModal = true;
            this.filparams = {};
            this.selectTag = [];
            this.initFilList();
            if(!this.sourceInfo){
                this.getTagList();       //标签
                this.getFilService();    //获取筛选客服列表
                this.getKfGroup();       //技能组
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
    .history{
        margin:10px;
        min-height: 100%;
    }
</style>
