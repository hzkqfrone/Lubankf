<template>
    <div class="repository">
        <div class="repBox">
            <div class="titleTop replyT">
                <div class="configTitle">
                    <router-link to="/config">
                        <Icon type="md-arrow-round-back" />
                        <h2>知识库</h2>
                    </router-link>
                    <div class="groupTab">
                        <ButtonGroup >
                            <Button v-for="(item,index) in repButton" @click="changeRep(index)" :type="item.type" :key="index">{{item.label}}</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
            <div class="repositoryContent clearfix configTop">
                <div class="group elementScroll" v-show="repIndex==0">
                    <div class="addCateBtn" @click="addCateModal=true,groupTitle='添加分类',addCate={}"><Icon type="md-add" />添加分类</div>
                    <div class="groupTitle">
                        <Spin size="large" fix v-if="showSpin"></Spin>
                        <ul class="clearfix">
                            <li :class="{selectGroup:repositoryParams.qid==0}">
                                <div>
                                    <span class="title" @click="group_userList(0)">默认分类</span>
                                </div>
                            </li>
                            <li v-for="(item,index) in group" :key="index" v-if="group.length>0" :class="{selectGroup:repositoryParams.qid==item.id}">
                                <div>
                                    <span class="title" @click="group_userList(item.id)">{{item.title}}</span>
                                    <div class="operation">
                                        <Icon class="edit" type="md-create" title="编辑" @click="editGroups(index)" />
                                        <Icon class="del" type="md-trash" title="删除" @click="confirm(item.id)"/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="listRight elementScroll clearfix" v-show="repIndex==0">
                    <div class="template">
                        <p><Icon type="md-download" />下载<a href="javascript:;" @click="downLoadTemplate">知识库数据导入模板</a></p>
                    </div>
                    <div class="func">
                        <Button class="addBtn" type="primary" icon="md-add" @click="addrepository">添加知识点</Button>
                        <Button class="delBtn" type="error" icon="md-trash" @click="selectDel">删除</Button>
                        <div class="search">
                            <Input style="width:300px;" search placeholder="搜索问题" v-model="searchTitlt" @on-enter="searchQuestion" @on-click="searchQuestion"></Input>
                            <Upload :action="importAction"
                                    :before-upload="beforeUpload"
                                    :data="uploadData"
                                    :show-upload-list="false"
                                    :format="['xls','xlsx']"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    :on-format-error="handleFormatError"
                                    class="importReply">
                                <Button type="info" icon="md-arrow-up">导入</Button>
                            </Upload>
                            <Button type="info" icon="md-arrow-down" @click="exportRep">导出</Button>
                        </div>
                    </div>
                    <Table :loading="showLoading" :columns="columnsData" :data="resData" @on-selection-change="selectChange"></Table>
                    <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
                </div>
                
                <!-- 未解决的高频问题 -->
                <high-frequency v-show="repIndex==1" :handle="handle" @addWord="addWord" ref="highQuestion"></high-frequency>
            </div>

            <!-- 添加分类 -->
            <Modal
                v-model="addCateModal"
                width="450"
                :title="groupTitle">
                <Form :label-width="80">
                    <FormItem label="分类名称">
                        <Input v-model="addCate.title"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="closePoptip">取消</Button>
                    <Button type="primary" @click="addAndEditGroup">确定</Button>
                </div>
            </Modal>

            <Modal
                class="addRepository"
                v-model="ModalShow"
                width="800"
                :title="modalTitle">
                <Form :label-width="60" class="repForm" style="padding:0 10px;">
                    <FormItem label="问题">
                        <Input placeholder="问题" class="reInput" v-model="addForm.title"/>
                        <div v-for="(item, index) in similarityArr" :key="index">
                            <Input placeholder="相似问题" class="reInput similarity" v-model="similarityArr[index]"/>
                            <Icon type="md-close" class="delRes" @click="deleteRes(index)"/>
                        </div>
                        <a href="javascript:;" @click="addSimilarity"><Icon type="md-add" />添加相似问题</a>
                    </FormItem>
                    <FormItem label="分类">
                        <Select v-model="addForm.qid" class="reInput">
                            <Option v-for="(item, index) in group" :value="item.id" :key="index">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="答案">
                        <vue-editor v-model="addForm.answer" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
                    </FormItem>
                    <FormItem label="关联问题">
                        <Button @click="showAddQs">添加关联问题</Button>
                        <div class="qsList" v-if="addForm.correlation_question && addForm.correlation_question.length>0">
                            <ul>
                                <li v-for="(qs, index) in addForm.correlation_question" :key="index" v-dragging="{ item: qs, list: addForm.correlation_question, group: 'qs' }">
                                    <span :title="qs.title">{{qs.title}}</span>
                                    <a href="javascript:;" class="close" @click="delQs(index)">删除</a>
                                </li>
                            </ul>
                        </div>
                    </FormItem>
                    <FormItem label="启用状态">
                        <i-switch size="large" :true-value="1" :false-value="0" v-model="addForm.status">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="ModalShow=false">取消</Button>
                    <Button :loading="sureLoading" type="primary" @click="sureAddQes">确定</Button>
                </div>
            </Modal>
            <add-question :selectInData="addForm.correlation_question" @addQs="addQs" ref="showAddQuestion"></add-question>
        </div>
    </div>
</template>

<script>
var qs = require('qs');
import { getKnowledge, createKnowledge, updateKnowledge, knowledgeDetails, createCate, updateCate, getCateList, deleteCate, deleteKnowledge, deleteMark,
        exportTemplate } from '@/libs/api'
import { VueEditor } from "vue2-editor";
import axios from "axios";
import addQuestion from '../components/add-question';
import highFrequency from './highFrequency.vue';
import {url, beyondSize} from '@/mixins/mixin';
export default {
    mixins:[url, beyondSize],
    data(){
        return {
            addCateModal:false,
            addCate:{},  // 添加组名
            editGroup:'',  //修改组名
            showSpin:false,
            ModalShow:false,
            modalTitle:'添加知识',
            groupTitle:'添加分类',
            group:[],
            addForm:{status:1},
            showLoading:true,
            resData:[],      //知识库列表
            totalCount:0,
            repositoryParams:{
                page:1,
                group:-2   //-2 全部
            },
            params:{},
            columnsData: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    key: 'title',
                    title: '问题',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('Poptip',{
                            props:{
                                placement: 'top',
                                transfer: true,
                                'word-wrap': true,
                                trigger:'hover',
                                maxWidth: '450'
                            }
                        },[
                            h('Tag',{
                                style:{
                                    height: 'auto'
                                }
                            },params.row.title),
                             h('div',{
                                slot: 'content',
                                attrs:{
                                    class: 'qsContent'
                                },
                                domProps:{
                                    innerHTML: params.row.answer
                                } 
                            })
                        ])
                    }
                },
                {
                    key: 'category',
                    title: '归属分类',
                    minWidth: 100,
                },
                {
                    key: 'createTime',
                    title: '创建时间',
                    minWidth: 120,
                },
                {
                    key: 'have_help',
                    title: '有解决数',
                    minWidth: 80,
                },
                {
                    key: 'not_help',
                    title: '没解决数',
                    minWidth: 80,
                },
                {
                    key: 'hit_times',
                    title: '命中次数',
                    minWidth: 80,
                },
                {
                    key: 'status',
                    title: '状态',
                    minWidth: 80,
                    render: (h,params) => {
                        return h('span',{
                            style:{
                                color: params.row.status ? 'green' : 'red'
                            }
                        }, params.row.status ? '已启用' : '已停用')
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:120,
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
                                title: '您确定要删除此问题吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.delIds = [this.resData[params.index].id];
                                    this.del();
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
            
            content: "",   //答案内容
            relevanceParams:{               
                page:1
            },
            similarityArr:[],          //相似问题
            sureLoading:false,         //确定按钮loading
            delIds:[],                 //删除知识点id
            searchTitlt:'',            //搜索问题      
            repIndex:0,
            repButton:[{label: '知识库',type: 'primary'},{label:'未解决的高频问题',type: 'dashed'}],
            handle:0,
            isMark:false,              //是否添加高频词到知识库
            highQsId:'',               //高频问题Id
            uploadData:{},             //导入模板参数
            importAction:'',           //导入快捷回复地址
        }
    },
    mounted(){
        this.getQsList();
        this.getGroupList();
        this.importAction = `${url}api/robot/knowledge/import.htm`
    },
    methods:{
        //知识库列表接口
        getQsList(type, data){
            getKnowledge(this.repositoryParams).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },
        
        //搜索知识库问题
        searchQuestion(){
            this.repositoryParams.title = this.searchTitlt;
            this.getQsList();
        },

        //获取分类列表
        getGroupList(){
            getCateList().then(res => {
                if(res.code == 0){
                    this.group = res.data;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //点击添加知识点
        addrepository(){
            this.ModalShow = true;
            this.isMark = false;
            this.modalTitle = "添加知识";
            this.addForm = {status:1,answer:''};
            this.similarityArr = [];
        },

        //添加知识  ||   修改 多传id
        sureAddQes(){
            this.sureLoading = false;
            this.addForm.questions = this.similarityArr;
            if(this.modalTitle == "编辑知识"){
                var repUrl = updateKnowledge;
            }else{
                var repUrl = createKnowledge;
            }
            if(!this.addForm.title){
                this.$Notice.warning({title: '问题不能为空'});
                return
            }else if(!this.addForm.answer){
                this.$Notice.warning({title: '答案不能为空'});
                return
            }
            repUrl(this.addForm).then(res => {
                this.sureLoading = false;
                if(res.code == 0){
                    this.ModalShow = false;
                    this.$Notice.success({title:res.msg});
                    this.getQsList();
                    this.addForm = {status:1};
                    if(this.isMark){
                        this.deleteHighQs();
                    }
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //编辑弹框
        edit(index){
            this.modalTitle = "编辑知识"
            this.ModalShow = true;
            this.isMark = false;
            knowledgeDetails({id:this.resData[index].id}).then(res => {
                if(res.code == 0){
                    this.addForm = res.data;
                    this.similarityArr = res.data.questions;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //多选 - 删除快捷回复
        selectChange(row){
            this.delIds = [];
            row.forEach(e => {
                this.delIds.push(e.id);
            });
        },

        //删除
        del(index){
            deleteKnowledge({ids: this.delIds}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.getQsList();
                    this.repositoryParams.page = 1;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },
        
        //改变页数
        changeNum (page){
            this.repositoryParams.page = page;
        },
        
        //取消添加组
        closePoptip(){
            this.addCateModal = false;
            this.addCate = {};
        },

        //点击编辑组
        editGroups(index){
            this.groupTitle = "编辑分类";
            this.addCate = this.group[index];
            this.addCateModal = true;
        },  

        //删除分类
        delGroup(id){
            deleteCate({id:id}).then(res => {
                if(res.code == 0){
                    this.getGroupList();
                    this.getQsList();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },  

        confirm (id) {
            this.$Modal.confirm({
                title: '确定删除此技能组?',
                onOk: () => {
                    this.delGroup(id);
                },
                onCancel: () => {
                    // this.
                }
            });
        },

        //查看分类下知识点
        group_userList(id){
            this.repositoryParams.qid = id;
            this.getQsList();
        },

        //编辑 - 添加 分类
        addAndEditGroup(){
            if(!this.addCate.title){
                this.$Notice.error({title:"请填写分类名称"});
                return false;
            }
            if(this.groupTitle == "编辑分类"){
                var cateUrl = updateCate;
            }else{
                var cateUrl = createCate;
            }
            cateUrl(this.addCate).then(res => {
                if(res.code == 0){
                    this.getGroupList();
                    this.addCateModal = false;
                    this.$Notice.success({title:res.msg});
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //下载模板
        downLoadTemplate(){
            var data = {'Access-Token':this.$store.state.app.access_token}
            window.open(`${url}api/robot/knowledge/export-template.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //上传文档成功
        uploadSuccess(response,file,fileList){
            if(response.code == 0){
                this.$Notice.success({
                    title: response.msg
                }); 
                this.getQsList();
            }else{
                this.$Notice.error({
                    title: response.msg
                });
            }
        },

        //上传之前
        beforeUpload(){
            this.uploadData = {'Access-Token':this.$store.state.app.access_token};
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise; //通过返回一个promis对象解决
        },

        //导出问题
        exportRep(){
            var data = {'Access-Token':this.$store.state.app.access_token}
            window.open(`${url}api/robot/knowledge/export.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //删除问题
        selectDel(){
            if(this.delIds.length < 1){
                this.$Notice.warning({title: '请选中要删除的问题'});
                return
            }
            this.del();
        },

        //添加相似问题
        addSimilarity(){
            this.similarityArr.push('');
        },

        //上传图片
        handleImageAdded(file, Editor, cursorLocation, resetUploader) {
            if (file.size > 10 * 1024 * 1024){
                chatUtils.showtoast()
                that.$Notice.warning({title: "上传文件太大，超过10M"});
                return;
            }
            var that = this;
            var formdata = new FormData()
            formdata.append('image',file);
            formdata.append('Access-Token',this.$store.state.app.access_token);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://www.lubankf.com/api/upload/image.htm');
            xhr.send(formdata);
            xhr.getAllResponseHeaders()
            xhr.onerror = function () {
                that.$Notice.warning({title: "上传图片异常"});
            };

            xhr.onload = function (e) {
                var res = e.target.response;
	            var data = JSON.parse(res);
                if(data.code == 0){
                    let url = data.data.url; // Get url from response
                    Editor.insertEmbed(cursorLocation, "image", url);
                    resetUploader();
                }else{
                    that.$Notice.error({title:data.msg});
                }
            };
        },

        //删除相似问题
        deleteRes(index){
            this.similarityArr.splice(index,1);
        },

        //添加关联问题
        addQs(data){
            var question = []
            data.forEach((e, index) => {
                if(index <= 4){
                    question.push({title: e.title, id: e.id});
                }
            })
            this.$set(this.addForm,'correlation_question',question);
        },

        //删除关联问题
        delQs(index){
            this.addForm.correlation_question.splice(index,1);
        },


        //tab切换
        changeRep(num){
            this.repIndex = num;
            this.repButton.forEach(e => {
                e.type = "dashed";
            });
            this.repButton[num].type = "primary";
            if(num == 1) this.$refs.highQuestion.getList();
        },
        
        //高频词 添加到知识库
        addWord(data){
            this.ModalShow = true;
            this.isMark = true;
            this.highQsId = data.id;
            this.modalTitle = "添加知识";
            this.similarityArr = [];
            this.addForm = {status:1,title: data.title};
            this.addForm.correlation_question = [];
        },

        //删除高频问题词
        deleteHighQs(){
            deleteMark({ids: [this.highQsId]}).then(res => {
                if(res.code == 0){
                    this.$refs.highQuestion.getList();
                }else{
                    this.$Notice.error({title:data.msg});
                }
            })
        },

        //添加关联问题
        showAddQs(){
            this.$refs.showAddQuestion.showAddQs();
        }
       
    },
    components:{
        VueEditor,
        addQuestion,
        highFrequency
    }
}
</script>


<style lang="less">
    .repository{
        height: 100%;
        .repBox{
            height:100%;
            padding:20px;
            .groupTab{
                float:right;
                margin-top:-10px;
            }
            .repositoryContent{
                height:100%;
                margin-top:20px;
                .group{
                    width:220px;
                    height:100%;
                    overflow-y:auto;
                    float:left;
                    .addCateBtn{
                        color:#12b7f5;
                        padding:10px;
                        cursor: pointer;
                    }
                    .addCate{
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
                            &.selectGroup{
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
                    padding:0 0 10px 20px;
                    border-left:1px solid #e7e7e7;
                    height: 100%;
                    overflow-y: auto;
                    .template{
                        width:100%;
                        text-align: right;
                        padding-bottom:5px;
                    }
                    .func{
                        margin-bottom:10px;
                        .search{
                            float:right;
                            .importReply{
                                display: inline-block;
                            }
                        }
                    }
                }
            }
        }
    }
    .addRepository{
        .qsList{
            width:540px;
            margin-top:10px;
            li{
                height:32px;
                line-height: 32px;
                background:#f5f5f5;
                border-bottom:1px solid #e7e7e7;
                span{
                    max-width:500px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    text-indent: 10px;
                }
                a.close{
                    float:right;
                    margin-right:10px;
                    color:red;
                    display: none;
                }
                &:hover{
                    background:#ebf8ff;
                    cursor: move;
                }
                &:hover a{
                    display: block;
                    cursor: pointer;
                }
            }
        }
    }
    .qsContent{
        max-width: 400px;
        img{
            max-width:100px;
        }
    }
</style>
