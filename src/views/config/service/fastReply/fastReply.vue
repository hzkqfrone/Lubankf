<template>
    <div style="height:100%;" class="fastReply">
        <div class="titleTop replyT">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>快捷回复</h2>
                </router-link>
            </div>
        </div>
        <div class="configWrap configTop">
            <div class="storeroom">
                <div class="storeroomTop">
                    <a href="javascript:;" :class="reIndex==0?'on':''" @click="getGroupList(0)">企业回复</a>
                    <a href="javascript:;" :class="reIndex==1?'on':''" @click="getGroupList(1)">个人回复</a>
                </div>
                <div class="group">
                    <Poptip placement="right" v-model="addPoptip" width="275">
                        <div class="addGroupBtn"><Icon type="md-add" />添加分组</div>
                        <div class="addgroup" slot="content">
                            <Input style="width:180px;" v-model="groupParams.group_name" @on-enter="addGroup"></Input>
                            <Icon class="checkmark" @click="addGroup" title="确定" type="md-checkmark" />
                            <Icon class="close" title="取消" @click="closePoptip" type="md-close" />
                        </div>
                    </Poptip>
                    <div class="groupTitle">
                        <Spin size="large" fix v-if="showSpin"></Spin>
                        <div v-if="replyG.length == 0" class="noGroup">暂无分组~</div>
                        <ul v-if="replyG.length>0">
                            <li class="clearfix" v-for="(item,index) in replyG" :key="index" :class="{selectItem: index==clickIndex}">
                                <div v-if="!item.edit">
                                    <span class="title" @click="quickReply(index)">{{item.name}}</span>
                                    <div class="operation">
                                        <Icon class="edit" type="md-create" title="编辑" @click="editGroups(index)" />
                                        <Poptip
                                            confirm
                                            title="确定要删除该类别及其所有的快捷回复吗?"
                                            @on-ok="delGroup(index)">
                                            <Icon class="del" type="md-trash" title="删除"/>
                                        </Poptip>
                                    </div>
                                </div>
                                <div class="addgroup" v-if="item.edit">
                                    <Input style="width:160px;" v-model="editGroup.group_name" @on-enter="addGroup('edit')"></Input>
                                    <Icon class="checkmark" @click="addGroup('edit')" title="确定" type="md-checkmark" />
                                    <Icon class="close" title="取消" @click="closeEditGroup(index)" type="md-close" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="reply">
                <h3>{{groupTitle}}</h3>
                <div class="template">
                    <p><Icon type="md-download" />下载<a href="javascript:;" @click="downLoadTemplate">快捷回复导入模板</a></p>
                </div>
                <div class="replyTop">
                    <Button class="addBtn" type="primary" icon="md-add" @click="addBtn('addForm')">添加快捷回复</Button>
                    <Button class="delBtn" type="error" icon="md-trash" @click="selectDel">删除</Button>
                    <div class="search">
                        <Input style="width:300px;" search placeholder="搜索快捷回复" v-model="searchContent" @on-enter="searchReply" @on-search="searchReply"></Input>
                        <Upload :action="importAction"
                            :before-upload="beforeUpload"
                            :data="uploadData"
                            :show-upload-list="false"
                            :format="['xls','xlsx']"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :on-format-error="handleFormatError"
                            class="importReply">
                            <Button class="delBtn" type="info" icon="md-arrow-up">导入</Button>
                        </Upload>
                        <Button class="delBtn" type="info" icon="md-arrow-down" @click="exportReply">导出</Button>
                    </div>
                </div>
                <Table :loading="showLoading" :columns="columnsData" :data="replyListDatas" @on-selection-change="selectChange"></Table>
            </div>
        </div>

        <Modal
            v-model="ModalShow"
            :title="modalTitle">
            <Spin fix v-if="editModal"></Spin>
            <Form :model="addForm" ref="addForm" :rules="rules" :label-width="100">
                <FormItem label="类别" prop="GroupId" required>
                    <Select v-model="addForm.GroupId" filterable clearable>
                        <Option v-for="item in type" :value="item.GroupId" :key="item.GroupId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="关键词" prop="keyword" required>
                    <Input v-model="addForm.keyword" placeholder="关键词"/></Input>
                </FormItem>
                <FormItem label="回复内容" prop="content" class="addReContent">
                    <Input type="textarea" v-model="addForm.content" @on-focus="isShowIcon=!isShowIcon" :rows="4" placeholder="回复内容" ></Input>
                    <emoji-show :isShowIcon="isShowIcon" @selectEmoji="selectEmoji"></emoji-show>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="ModalShow=false">取消</Button>
                <Button type="primary" @click="addReply">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
var qs = require('qs');
import Cookies from 'js-cookie';
import { url, beyondSize } from '@/mixins/mixin';
import emojiShow from '@/views/my-components/emoji/emojiComponents.vue';
import { getReplyList, addEditGroup, deleteReply, addEditReply, replyList, importReplyList } from '@/libs/api';
export default {
    mixins:[url, beyondSize],
    data(){
        return{
            reIndex:"0",
            showLoading:false,
            ModalShow:false,
            editModal:false,
            modalTitle:'添加快捷回复',
            groupTitle:'企业回复',
            type:[],  //类别
            groupParams:{},  // 添加组
            editGroup:{},    //编辑组
            addPoptip:false,
            groupData:[], //快捷回复列表
            replyG:[],
            showSpin:false,
            addForm:{
                content:''
            },
            isGroupId:"",  //组id
            replyListData:[], //右侧快捷回复内容
            replyIds:[],
            isShowIcon:false,  //显示emoji
            columnsData:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    key: 'keyword',
                    title: '关键词',
                },
                {
                    key: 'content',
                    title: '内容',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                title: '',
                                placement: 'bottom'
                            },
                            attrs:{
                                class: 'replyContent'
                            }
                        }, [
                            h('Tag', params.row.content),
                            h('div', {
                                slot: 'content',
                                style: {
                                    whiteSapce:'normal'
                                }
                            },params.row.content)
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:200,
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
                                        this.edit(params.index)
                                    }
                                }
                            }, '编辑')
                        )
                        btns.push(h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除这条快捷回复吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.del(params.index)
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
                        ]))

                        return h("div",btns)
                    }
                }  
            ],
            rules:{
                GroupId: [
                    {required: true, type:'number', message: '请选择类别', trigger: 'blur'},
                ],
                keyword: [
                    {required: true, message: '请输入关键词', trigger: 'blur'},
                ],
                content: [
                    {required: true, message: '请输入回复内容', trigger: 'blur'},
                ]
            },
            importAction:'', //导入快捷回复地址
            uploadData:{},   //导入模板参数
            searchContent:'',  //搜索快捷回复内容
            filterSearch:'',
            replyListDatas:[],
            clickIndex:-1,
        }
    },
    mounted() {
        this.reply();   //左侧分组列表
        this.replyContentList();  //快捷回复列表 默认企业所以快捷回复
        this.importAction = `${url}api/settings/quick-reply/import.htm`
    },
    computed:{
        //过滤搜索快捷回复
        filterReply(){
            this.replyListDatas = [];
            var obj={};
            obj=JSON.parse(JSON.stringify(this.replyListData));
            if(this.filterSearch){
                obj.forEach(e => {
                    if(e.content.indexOf(this.filterSearch) > -1 || e.keyword.indexOf(this.filterSearch) > -1){
                        this.replyListDatas.push(e);
                    }   
                });
            }else{
                this.replyListDatas = obj;
            }
        },

        comResData(){
            var obj = {};
            obj = JSON.parse(JSON.stringify(this.replyListData));
            return obj;
        }
    },
    methods:{
        //getGroupList  分组列表
        getGroupList(index){
            this.reIndex = index;
            this.isGroupId = "";
            this.replyContentList();
            if(index == 0){
                this.groupTitle = "企业回复";
                this.replyG = this.groupData.enterprise_reply;
            }else{
                this.groupTitle = "个人回复";
                this.replyG = this.groupData.self_reply;
            }
        },

        //获取快捷回复列表
        reply(){
            this.showSpin = true;
            getReplyList().then(res => {
                this.showSpin = false;
                if(res.code == 0){
                    this.type = [];
                    this.groupData = res.data;
                    if(this.reIndex == 1){
                        this.replyG = res.data.self_reply;
                    }else{
                        this.replyG = res.data.enterprise_reply;
                    }
                    if(res.data.enterprise_reply){
                        res.data.enterprise_reply.forEach(v => {
                            this.type.push(v);
                        });
                    }
                    if(res.data.self_reply){
                        res.data.self_reply.forEach(v => {
                            this.type.push(v);
                        });
                    }
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //添加分组 0- 企业 1-个人
        addGroup(type){
            var data = {};
            if(type == "edit"){
                data = this.editGroup;
            }else{
                this.groupParams.owner_type = this.reIndex;
                data = this.groupParams;
            }
            if(!data.group_name) return false;
            addEditGroup(data).then(res => {
                this.groupParams = {};
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.addPoptip = false;
                    this.reply();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //取消添加 和修改 分组
        closePoptip(){
            this.groupParams = {};
            this.addPoptip = false;
        },
        closeEditGroup(index){
            this.groupParams = {};
            this.replyG[index].edit = false;
        },

        //编辑组名
        editGroups(index){
            var handle = true;
            this.replyG.forEach(v => {
                if(v.edit == true){
                    handle = false;
                }
            });
            if(handle){
                this.editGroup = this.replyG[index];
                this.editGroup.group_name = this.replyG[index].name;
                var e = this.replyG[index];
                e.edit = true;
                this.$set(this.replyG,index,e)
            }
        },

        //删除分组
        delGroup(index){
            this.deleteReply({GroupIds:[this.replyG[index].GroupId]});
        },
        
        //点击分组查看快捷回复列表
        quickReply(index){
            this.clickIndex = index;
            this.isGroupId = this.replyG[index].GroupId;
            this.groupTitle = this.replyG[index].name;
            this.replyContentList();
        },


        //右侧快捷回复 内容列表
        replyContentList(){
            replyList({GroupId:this.isGroupId,owner_type:this.reIndex}).then(res => {
                if(res.code == 0){
                    if(res.data){
                        this.replyListData = res.data.list;
                        this.replyListDatas = res.data.list;
                    }else{
                        this.replyListData = [];
                    }
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //添加快捷回复
        addReply(){
            addEditReply(this.addForm).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.replyContentList();
                    this.ModalShow = false;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //选中emoji
        selectEmoji(data){
            this.addForm.content = this.addForm.content + data;
        },

        //编辑
        edit(index){
            this.addForm = this.comResData[index];
            this.ModalShow = true;
        },

        //删除快捷回复
        del(index){
            this.deleteReply({replyIds:[this.replyListData[index].replyId]})
        },

        //多选 - 删除快捷回复
        selectChange(row){
            this.replyIds = [];
            row.forEach(e => {
                this.replyIds.push(e.replyId);
            });
        },

        selectDel(){
            if(this.replyIds.length==0){
                this.$Notice.error({title:"请选择要删除的快捷回复列表"});
                return false;
            }
            this.deleteReply({replyIds:this.replyIds});
        },

        //删除快捷回复组/回复内容
        deleteReply(data){
            deleteReply(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    if(data.GroupIds){
                        this.reply();
                        this.replyContentList();
                    }else if(data.replyIds){
                        this.replyContentList();
                    }
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //导出快捷回复
        exportReply(){
            var data = {
               'Access-Token':this.$store.state.app.access_token,
                owner_type:this.reIndex
            }
            window.open(`${url}api/settings/quick-reply/export.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //下载快捷回复模板样式
        downLoadTemplate(){
            var data = {
                'Access-Token':this.$store.state.app.access_token
            }
            window.open(`${url}api/settings/quick-reply/export-template.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //上传之前
        beforeUpload(){
            this.uploadData = {
                owner_type:this.reIndex,
                'Access-Token':this.$store.state.app.access_token
            };
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
        },

        //上传文档成功
        uploadSuccess(response,file,fileList){
            if(response.code == 0){
                this.$Notice.success({
                    title: response.msg
                }); 
                this.reply();
                this.replyContentList();
                this.addModal = false;
            }else{
                this.$Notice.error({
                    title: response.msg
                });
            }
        },

        //搜索快捷回复
        searchReply(){
            if(!this.searchContent) this.searchContent = "";
            this.filterSearch = this.searchContent;
            this.filterReply;
        },

        //添加快捷回复btn
        addBtn(name){
            this.ModalShow = true;
            this.addForm = {};
            // this.$refs[name].resetFields();
        }
    },
    components:{
        emojiShow
    }
}
</script>
<style lang="less">
.fastReply{
    .tabs{
        position: fixed;
        width:100%;
        background:#fff;
    }
    .configWrap{
        height: 100%;
    }
    .single-page,.chatContent,.ivu-card-body,.ivu-card-bordered{
        height:100%;
    }
    .storeroom{
        width:250px;
        margin-right:30px;
        padding-right:20px;
        border-right:1px solid #e5e5e5;
        float: left;
        height:100%;
        overflow: auto;
        .storeroomTop{
            border-bottom:1px solid #e5e5e5;
            line-height: 40px;
            text-align: center;
            padding-top:20px;
            margin-left:20px;
            a{  
                color:#666;
                margin:0 10px;
            }
            a.on{
                color:#2d8cf0;
            }
        }
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
            padding:0 5px 0 16px;
            .noGroup{
                text-align: center;
                line-height: 50px;
            }
            li{
                line-height: 38px;
                cursor: pointer;
                &.selectItem .title{
                    color:#2d8cf0;
                }
                .operation{
                    display: none;
                }
                .title{
                    text-overflow:ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    display:inline-block;
                    float:left;
                    width:210px;
                    &:hover{
                        color:#2d8cf0;
                    }
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
    .reply{
        margin:0 20px 0 280px;
        height: 100%;
        overflow-x: auto;
        h3{
            line-height: 40px;
            padding-top:20px;
        }
        .template{
            text-align: right;
        }
        .replyTop{
            padding:10px 0 20px 0;
            .search{
                display: inline-block;
                float:right;
            }
            .importReply{
                display: inline-block;
            }
        }
        .ivu-table-wrapper{
            margin-bottom:20px;
        }
    }
    .addReContent{
        position: relative;
        textarea{
            padding-right:25px;
        }
    }
    .emojiContent{
        position: absolute;
        top: 5px;
        right:5px;
        z-index: 1000;
    }
    .replyT {
        margin:0 20px;
        .configTitle{
            padding:20px;
            height: 70px;
        }
    }
    .storeroom,.reply{
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
    .replyContent{
        .ivu-poptip-popper{
            left:0;
            .ivu-poptip-inner{
                width:500px;
                white-space: normal;
            }
        }
    }
}
</style>

