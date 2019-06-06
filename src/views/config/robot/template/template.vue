<template>
    <div class="repositoryTemplate">
        <div class="repBox">
            <div class="titleTop replyT">
                <div class="configTitle">
                    <router-link to="/config">
                        <Icon type="md-arrow-round-back" />
                        <h2>知识模板库</h2>
                    </router-link>
                    <div class="search" v-if="isSelected">
                        <Input style="width:300px;" search placeholder="搜索问题" v-model="templateParams.title" @on-enter="searchQuestion" @on-search="searchQuestion"></Input>
                    </div>
                </div>
            </div>
            <div class="repositoryContent clearfix configTop" v-if="!isSelected">
                <Button type="primary" @click="selectTradeModal=true">选择行业</Button>
            </div>
            <div class="repositoryContent clearfix configTop" v-if="isSelected">
                <div class="group elementScroll" v-if="isSuper">
                    <div class="addCateBtn" @click="showStairInput=true, stairFocus=true"><Icon type="md-add" />添加行业</div>
                    <div class="groupTitle">
                        <Menu :open-names='activeId' width='401px' ref="side_menu" @on-select="selectMenu">
                            <MenuItem :name="0">
                                <div class="content">
                                    <span class="title">全部</span>
                                </div>
                            </MenuItem>

                            <MenuItem v-if="showStairInput" :name='Date.parse(new Date())'>
                                <div class="editTrade">
                                    <Input class="addInput" :autofocus="stairFocus" v-model="stair"></Input>
                                    <div class="inputRightHint">
                                        <a href="javascript:;" @click="saveAddTrade()">保存</a>
                                        <a href="javascript:;" @click="showStairInput=false">取消</a>
                                    </div>
                                </div>
                            </MenuItem>
                            <template v-for='(item, index) in trade'>

                                <MenuItem v-if="!item.children" :name="item.value">
                                    <div class="content" v-if="rexItem['input'+item.value] && !rexItem['input'+item.value].edit">
                                        <span class="title">{{item.label}}</span>
                                        <div class="operation">
                                            <span @click.stop="showSecond('input'+item.value, item.value, null, null, 'add')"><Icon class="edit" type="md-add"/>新建分类</span>
                                            <span @click.stop="showSecond('input'+item.value, item.value, null, null, 'edit')"><Icon class="edit" type="md-create"/>重命名</span>
                                            <span @click.stop="delTrade(item.value)"><Icon class="del" type="md-trash" />删除</span>
                                        </div>
                                    </div>
                                    <!-- 编辑一级行业 -->
                                    <div class="editTrade" v-if="rexItem['input'+item.value] && rexItem['input'+item.value].edit">
                                        <Input @click.stop.native="stopstop" v-model="editName[index].label" class="addInput"></Input>
                                        <div class="inputRightHint">
                                            <a href="javascript:;" @click.stop="editSave(editName[index].label, item.value, index, null, null, '1')">保存</a>
                                            <a href="javascript:;" @click.stop="rexItem['input'+item.value].edit=false">取消</a>
                                        </div>
                                    </div>
                                    <!-- 添加二级行业 -->
                                    <MenuItem v-if="rexItem['input'+item.value] && rexItem['input'+item.value].show" :name='Date.parse(new Date())'>
                                        <div class="editTrade" @click.stop.native="stopstop">
                                            <Input class="addInput" v-model="rexItem['input'+item.value].value"></Input>
                                            <div class="inputRightHint">
                                                <a href="javascript:;" @click.stop="saveAddSecond('input'+item.value, item.value, index)">保存</a>
                                                <a href="javascript:;" @click.stop="rexItem['input'+item.value].show=false">取消</a>
                                            </div>
                                        </div>
                                    </MenuItem>
                                </MenuItem>

                                <Submenu :name="item.value" v-if="item.children">
                                    <template slot="title">
                                        <div class="content" v-if="rexItem['input'+item.value] && !rexItem['input'+item.value].edit">
                                            <span class="title">{{item.label}}</span>
                                            <div class="operation">
                                                <span @click.stop="showSecond('input'+item.value, item.value, null, null, 'add')"><Icon class="edit" type="md-add"/>新建分类</span>
                                                <span @click.stop="showSecond('input'+item.value, item.value, null, null, 'edit')"><Icon class="edit" type="md-create"/>重命名</span>
                                                <span @click.stop="delTrade(item.value)"><Icon class="del" type="md-trash" />删除</span>
                                            </div>
                                        </div>
                                        <!-- 编辑一级行业 -->
                                        <div class="editTrade" v-if="rexItem['input'+item.value] && rexItem['input'+item.value].edit">
                                            <Input @click.stop.native="stopstop" v-model="editName[index].label" class="addInput"></Input>
                                            <div class="inputRightHint">
                                                <a href="javascript:;" @click.stop="editSave(editName[index].label, item.value, index, null, null, '1')">保存</a>
                                                <a href="javascript:;" @click.stop="rexItem['input'+item.value].edit=false">取消</a>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- 添加二级行业 -->
                                    <MenuItem v-if="rexItem['input'+item.value] && rexItem['input'+item.value].show" :name='Date.parse(new Date())'>
                                        <div class="editTrade">
                                            <Input class="addInput" v-model="rexItem['input'+item.value].value"></Input>
                                            <div class="inputRightHint">
                                                <a href="javascript:;" @click.stop="saveAddSecond('input'+item.value, item.value, index)">保存</a>
                                                <a href="javascript:;" @click.stop="rexItem['input'+item.value].show=false">取消</a>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <template v-if="item.children" v-for="(oneList, oneIndex) in item.children">
                                        <MenuItem v-if="!oneList.children" :name="oneList.value">
                                            <div class="content" v-if="rexItem['input'+oneList.value] && !rexItem['input'+oneList.value].edit">
                                                <span class="title">{{oneList.label}}</span>
                                                <div class="operation">
                                                    <span @click.stop="showSecond('input'+oneList.value, item.value, oneList.value, null, 'add')"><Icon class="edit" type="md-add"/>新建分类</span>
                                                    <span @click.stop="showSecond('input'+oneList.value, item.value, oneList.value, null, 'edit')"><Icon class="edit" type="md-create"/>重命名</span>
                                                    <span @click.stop="delTrade(oneList.value)"><Icon class="del" type="md-trash" />删除</span>
                                                </div>
                                            </div>
                                            <!-- 编辑二级行业 -->
                                            <div class="editTrade" v-if="rexItem['input'+oneList.value] && rexItem['input'+oneList.value].edit">
                                                <Input @click.stop.native="stopstop" v-model="editName[index].children[oneIndex].label" class="addInput"></Input>
                                                <div class="inputRightHint">
                                                    <a href="javascript:;" @click.stop="editSave(editName[index].children[oneIndex].label, oneList.value, index, oneIndex, null, '2')">保存</a>
                                                    <a href="javascript:;" @click.stop="rexItem['input'+oneList.value].edit=false">取消</a>
                                                </div>
                                            </div>
                                            <!-- 添加三级行业 -->
                                            <MenuItem v-if="rexItem['input'+oneList.value] && rexItem['input'+oneList.value].show" :name='Date.parse(new Date())'>
                                                <div class="editTrade">
                                                    <Input class="addInput" v-model="rexItem['input'+oneList.value].value"></Input>
                                                    <div class="inputRightHint">
                                                        <a href="javascript:;" @click="saveAddthirdly('input'+oneList.value, oneList.value, index, oneIndex)">保存</a>
                                                        <a href="javascript:;" @click="rexItem['input'+oneList.value].show=false">取消</a>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        </MenuItem>

                                        <Submenu v-if="oneList.children" :name="oneList.value">
                                            <template slot="title">
                                                <div class="content" v-if="rexItem['input'+oneList.value] && !rexItem['input'+oneList.value].edit">
                                                    <span class="title">{{oneList.label}}</span>
                                                    <div class="operation">
                                                        <span @click.stop="showSecond('input'+oneList.value, item.value, oneList.value, null, 'add')"><Icon class="edit" type="md-add"/>新建分类</span>
                                                        <span @click.stop="showSecond('input'+oneList.value, item.value, oneList.value, null, 'edit')"><Icon class="edit" type="md-create"/>重命名</span>
                                                        <span @click.stop="delTrade(oneList.value)"><Icon class="del" type="md-trash" />删除</span>
                                                    </div>
                                                </div>
                                                <!-- 编辑二级行业 -->
                                                <div class="editTrade" v-if="rexItem['input'+oneList.value] && rexItem['input'+oneList.value].edit">
                                                    <Input @click.stop.native="stopstop" v-model="editName[index].children[oneIndex].label" class="addInput"></Input>
                                                    <div class="inputRightHint">
                                                        <a href="javascript:;" @click.stop="editSave(editName[index].children[oneIndex].label, oneList.value, index, oneIndex, null, '2')">保存</a>
                                                        <a href="javascript:;" @click.stop="rexItem['input'+oneList.value].edit=false">取消</a>
                                                    </div>
                                                </div>
                                            </template>
                                            <!-- 添加三级行业 -->
                                            <MenuItem v-if="rexItem['input'+oneList.value] && rexItem['input'+oneList.value].show" :name='Date.parse(new Date())'>
                                                <div class="editTrade">
                                                    <Input class="addInput" v-model="rexItem['input'+oneList.value].value"></Input>
                                                    <div class="inputRightHint">
                                                        <a href="javascript:;" @click="saveAddthirdly('input'+oneList.value, oneList.value, index, oneIndex)">保存</a>
                                                        <a href="javascript:;" @click="rexItem['input'+oneList.value].show=false">取消</a>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                            <MenuItem v-if="oneList.children" v-for="(twoList, twoIndex) in oneList.children" :key="twoIndex" :name="twoList.value">
                                                <div class="content" v-if="rexItem['input'+twoList.value] && !rexItem['input'+twoList.value].edit">
                                                    <span class="title">{{twoList.label}}</span>
                                                    <div class="operation">
                                                        <span @click.stop="showSecond('input'+twoList.value, item.value, oneList.value, twoList.value, 'edit')"><Icon class="edit" type="md-create"/>重命名</span>
                                                        <span @click.stop="delTrade(twoList.value)"><Icon class="del" type="md-trash" />删除</span>
                                                    </div>
                                                </div>
                                                 <!-- 编辑三级行业 -->
                                                <div class="editTrade" v-if="rexItem['input'+twoList.value] && rexItem['input'+twoList.value].edit">
                                                    <Input @click.stop.native="stopstop" v-model="editName[index].children[oneIndex].children[twoIndex].label" class="addInput"></Input>
                                                    <div class="inputRightHint">
                                                        <a href="javascript:;" @click.stop="editSave(editName[index].children[oneIndex].children[twoIndex].label, twoList.value, index, oneIndex, twoIndex, '3')">保存</a>
                                                        <a href="javascript:;" @click.stop="rexItem['input'+twoList.value].edit=false">取消</a>
                                                    </div>
                                                </div>
                                            </MenuItem>
                                        </Submenu>
                                    </template>
                                </Submenu>
                            </template>
                        </Menu>
                    </div>
                </div>
                <div class="repositoryContent elementScroll clearfix" :class="{listRight: isSuper}">
                    <div class="checkTrade" v-if="checkTrade.checkTrade && !isSuper">
                        <h3>所在行业: {{checkTrade.checkTrade}}</h3>
                    </div>
                    <div class="func clearfix" v-if="isSuper">
                        <Button class="addBtn" type="primary" icon="md-add" @click="addRepository">添加知识点</Button>
                        <Button class="delBtn" type="error" icon="md-trash"  @click="batchDel">删除</Button>
                    </div>
                    <div class="replaceWrap">
                        <div class="replace">
                            <Input class="input" v-model="templateParams.search_title[0]"></Input>
                            <span>替换</span>
                            <Input class="input" v-model="templateParams.replace_title[0]"></Input>
                        </div>
                        <div class="replace">
                            <Input class="input" v-model="templateParams.search_title[1]"></Input>
                            <span>替换</span>
                            <Input class="input" v-model="templateParams.replace_title[1]"></Input>
                        </div>
                        <Button class="addBtn" type="primary" icon="md-search" @click="searching">检索</Button>
                    </div>
                    <Table :loading="showLoading" :columns="columnsData" :data="resData" @on-selection-change="selectChange" ref="table"></Table>
                    <Button class="delBtn" type="success" icon="md-arrow-up" style="margin-top:10px" @click="importRepository">导入到知识库</Button>
                    <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
                </div>
            </div>
        </div>


        <!-- 添加分类 -->
        <Modal
            v-model="addTradeModal"
            width="450"
            :title="groupTitle">
            <Form :label-width="80">
                <FormItem label="行业名称">
                    <Input v-model="addTradeParams.title"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addTradeModal=false">取消</Button>
                <Button type="primary" @click="addTradeModal=false">确定</Button>
            </div>
        </Modal>

        <!-- 添加 编辑 查看知识点 -->
        <Modal
            class="addRepository"
            v-model="ModalShow"
            width="800"
            :title="modalTitle">
            <Form :label-width="60" class="repForm" style="padding:0 10px;">
                <FormItem label="问题">
                    <Input placeholder="问题" class="reInput" v-model="addForm.title"/>
                </FormItem>
                <FormItem label="分类">
                    <Cascader :data="trade" :disabled="!isSuper" @on-change="changeCategory" :value="cascaderCategory"></Cascader>
                </FormItem>
                <FormItem label="答案">
                    <vue-editor v-model="addForm.answer" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="ModalShow=false">取消</Button>
                <Button v-if="modalTitle == '知识详情'" :loading="sureBtnLoading" type="primary" @click="importData=[addForm],importRepository()">导入</Button>
                <Button v-else :loading="sureBtnLoading" type="primary" @click="sureAdd">确定</Button>
            </div>
        </Modal>


        <!-- 选择行业 -->
        <Modal
            class="addRepository"
            v-model="selectTradeModal"
            title="请选择行业">
            <div class="selectTradeModal">
                <Cascader :data="trade" @on-change="changeCascader"></Cascader>
            </div>
            <div slot="footer">
                <Button @click="selectTradeModal=false">取消</Button>
                <Button type="primary" @click="selectTradeModal=false">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
import { setTrade, permissionAuth, getTRradeList, createTrade, updateTrade, deleteTrade, templateList, createTemplate, updateTemplate, deleteTemplate, importTemplate } from '@/libs/api'
import { url } from '@/mixins/mixin';
import { VueEditor } from "vue2-editor";
export default {
    mixins: [url],
    data(){
        return {
            isSelected: false,           //是否已选择了行业
            isSuper: false,              //是否管理员
            addTradeModal: false,        //添加行业modal
            groupTitle: '添加行业',
            activeId: [],                //激活菜单的 name 值
            showStairInput: false,       //显示添加行业input框
            stair: '',                   //添加一级
            rexItem: {},                 
            addTradeParams: {},
            selectTradeModal: false,     //选择行业modal
            trade:[],                    //行业列表
            ModalShow: false,
            modalTitle: '添加知识点',
            group:[],
            addForm:{},             //添加参数
            sureBtnLoading: false,  //确定按钮loading
            showLoading:true,
            resData:[],             //知识库列表
            totalCount:0,
            editTemplate:{},        //编辑知识模板
            delIds: [],             //要删除的知识模板ID
            importData: [],         //要导入的知识列表
            cascaderCategory: [],   //行业分类value
            templateParams:{
                page:1,
                search_title:[],
                replace_title:[]
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
                    key: 'category_name',
                    title: '归属分类',
                    minWidth: 100,
                },
                {
                    key: 'use_times',
                    title: '使用频次',
                    minWidth: 100,
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 190,
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
                                        this.modalTitle = '知识详情';
                                        this.addForm = {};
                                        this.addForm = this.comTemplateList[params.index];
                                        this.cascaderCategory = this.addForm.category;
                                        this.ModalShow = true;
                                    }
                                }
                            }, '查看详情')
                        )
                        if(this.isSuper){
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
                                            this.addForm = {};
                                            this.modalTitle = '编辑知识点';
                                            this.addForm = this.comTemplateList[params.index];
                                            this.cascaderCategory = this.addForm.category;
                                            this.ModalShow = true;
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
                                        this.delIds = [params.row.id];
                                        this.batchDel();
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
                        }
                        
                        return h("div",btns)
                    }
                }  
            ],
            checkTrade: '',            //已选择的行业信息
        }
    },
    computed: {
        editName(){
            var obj = {};
            obj = JSON.parse(JSON.stringify(this.trade));
            return obj;
        },
        //知识列表
        comTemplateList(){
            var obj = {};
            obj = JSON.parse(JSON.stringify(this.resData));
            return obj;
        }
    },
    mounted(){
        this.initAuth();
        this.getGroupList();
    },
    methods:{
        //查看权限
        initAuth(){
            permissionAuth().then(res => {
                if(res.code == 0){
                    if(res.data.checkTrade) this.checkTrade = res.data;      //已选择的行业
                    if(res.data.trade){
                        this.isSelected = true;
                        this.getQsList();
                    }else{
                        this.selectTradeModal = true;
                    }
                    if(res.data.is_super){
                        this.isSuper = true;
                    }
                }
            })
        },

        //选择行业
        changeCascader(value){
            var id = value[value.length-1];
            setTrade({category: id}).then(res =>{
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.selectTradeModal = false;
                    this.$nextTick(() => {
                        this.isSelected = true;
                        this.getQsList();
                    })
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //选择行业菜单 查看知识模板列表
        selectMenu(name){
            if(name.length!=13){
                this.templateParams.category = name;
                this.getQsList();
            }
        },

        //获取行业列表
        getGroupList(){
            getTRradeList().then(res => {
                if(res.code == 0){
                    this.trade = res.data;
                    this.dynamicModel();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //添加行业 api
        addTradeSubmit(n, id){
            var data = {
                name: n,
                pid: id
            }
            createTrade(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
                this.getGroupList();
            }).catch(res => {
                this.$Notice.error({title: '添加异常'});
            })
        },

        dynamicModel(){
            this.trade.forEach((e, index) => {
                var key = `input${e.value}`;   
                this.rexItem[key] = {
                    value: '',
                    show: false,
                    edit: false,
                };
                if(e.children){
                    e.children.forEach((c, cIndex) => {
                        var key = `input${c.value}`;
                        this.rexItem[key] = {
                            value: '',
                            show: false,
                            edit: false
                        };
                        if(c.children){
                            c.children.forEach((v, index) => {
                                var key = `input${v.value}`;
                                this.rexItem[key] = {
                                    value: '',
                                    show: false,
                                    edit: false
                                };
                            })
                        }
                    })
                }
            })
        },

        //添加顶级行业
        saveAddTrade(){
            this.showStairInput = false;
            this.trade.unshift(
                {
                    name: this.stair,
                    id: Date.parse(new Date())
                }
            )
            this.addTradeSubmit(this.stair, 0);
            this.stair = '';
        },

        //保存添加二级行业
        saveAddSecond(value, id, index){
            var name = this.rexItem[value].value;
            if(name){
                if(!this.trade[index].children) this.trade[index].children = [];
                this.trade[index].children.unshift(
                    {
                        label: name,
                        value: Date.parse(new Date())
                    }
                )
                this.initialize(value, id);
            }
        },

        //添加三级行业
        saveAddthirdly(value, id, index, oIndex){
            var name = this.rexItem[value].value;
            if(value){
                if(!this.trade[index].children[oIndex].children) this.trade[index].children[oIndex].children = [];
                this.trade[index].children[oIndex].children.unshift(
                    {
                        label: name,
                        value: Date.parse(new Date())
                    }
                )
                this.initialize(value, id);
            }
        },
        
        //添加后 input框初始化
        initialize(value, id){
            this.addTradeSubmit(this.rexItem[value].value, id);
            this.rexItem[value].show = false;
            this.rexItem[value].value = '';
            this.rexItem = Object.assign({}, this.rexItem);
        },

        //编辑行业
        editSave(value, id, index, oIndex, twoIndex, type){
            if(value){
                var data = {
                    name: value,
                    id: id
                }
                updateTrade(data).then(res => {
                    this.rexItem['input'+id].edit = false;
                    if(res.code == 0){
                        if(type == 1){
                            this.trade[index].label = value;
                        }else if(type == 2){
                            this.trade[index].children[oIndex].label = value;
                        }else if(type == 3){
                            this.trade[index].children[oIndex].children[twoIndex].label = value;
                        }
                    }else{
                        this.$Notice.error({title: res.msg});
                    }
                })
            }
        },

        //阻止冒泡
        stopstop(){

        },

        // 显示编辑 和 添加 分类
        showSecond(value, name, oname, tname, type){
            if(type == 'add'){
                this.rexItem[value].show = true;
                this.activeId = [name, oname, tname];
                this.$nextTick(() => {
                    this.$refs.side_menu.updateOpened()
                    this.$refs.side_menu.updateActiveName()
                })
            }else if(type == 'edit'){
                this.rexItem[value].edit = true;
            }
			this.rexItem = Object.assign({}, this.rexItem)
        },

        //知识库列表接口
        getQsList(type, data){
            this.showLoading = true;
            templateList(this.templateParams).then(res => {
                this.showLoading = false;
                this.resData = res.data.list;
                this.totalCount = Number(res.data.totalCount);
            })
        },
        
        //搜索知识库问题
        searchQuestion(){
            this.getQsList();
        },

    
        //改变页数
        changeNum (page){
            this.templateParams.page = page;
        },
        

        //删除行业
        delTrade(id){
            this.$Modal.confirm({
                title: '确定要删除吗?',
                onOk: () => {
                    deleteTrade({id: id}).then(res => {
                        if(res.code == 0){
                            this.$Notice.success({title: res.msg});
                            this.getGroupList();
                        }else{
                            this.$Notice.error({title: res.msg});
                        }
                    })
                },
            });
        },

        //点击添加知识点按钮
        addRepository(){
            this.addForm = {};
            this.modalTitle = '添加知识点';
            this.ModalShow = true;
        },

        //确定添加知识模板
        sureAdd(){
            if(!this.addForm.title){
                this.$Notice.warning({title: '请填写问题'});
                return
            }else if(!this.addForm.answer){
                this.$Notice.warning({title: '请填写答案'});
                return
            }
            var api = createTemplate;
            // 有id 为编辑接口
            if(this.addForm.id){
                api = updateTemplate;
            }
            if(typeof(this.addForm.category) == 'object') this.addForm.category = this.addForm.category[this.addForm.category.length-1];
            this.sureBtnLoading = true;
            api(this.addForm).then(res => {
                this.sureBtnLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.ModalShow = false;
                    this.getQsList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //导入知识库
        importRepository(){
            this.ModalShow = false;
            if(this.importData.length == 0){
                this.$Notice.warning({title: '请勾选要导入的知识模板'});
                return
            }
            importTemplate({ImportData: JSON.stringify(this.importData)}).then(res => {
                if(res.code == 0){
                    // this.importData = [];
                    // for(var i in this.$refs.table.objData){
                    //     this.$refs.table.objData[i]._isChecked = false;
                    // }
                    this.getQsList();
                    this.$Notice.success({title: res.msg});
                }else{  
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //添加知识模板 - 选择分类
        changeCategory(value){
            var id = value[value.length-1];
            this.addForm.category = id;
        },

        //替换  检索
        searching(){
            this.templateParams.page = 1;
            this.getQsList();
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
            xhr.open('POST', `${url}api/upload/image.htm`);
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

        //勾选要删除的列表
        selectChange(row){
            this.importData = [];
            this.delIds = [];
            row.forEach(e => {
                this.delIds.push(e.id);
                this.importData.push({
                    answer: e.answer,
                    title: e.title,
                    id: e.id
                })
            });
        },

        //批量删除知识模板
        batchDel(){
            if(this.delIds.length == 0){
                this.$Notice.warning({title: '请勾选要删除的知识模板'});
                return
            }
            deleteTemplate({ids: this.delIds}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.getQsList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })

        },
       
    },
    components:{
        VueEditor
    }
}
</script>


<style lang="less">
    .repositoryTemplate{
        height: 100%;
        .repBox{
            height:100%;
            padding:20px;
            .search{
                float: right;
            }
            .groupTab{
                float:right;
                margin-top:-10px;
            }
            .repositoryContent{
                height:100%;
                margin-top:5px;
                .checkTrade{
                    line-height: 50px;
                    margin-bottom:20px;
                }
                .group{
                    width:400px;
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
                    .operation{
                        float: right;
                        display: none;
                        span{
                            font-size:12px;
                            margin-right:8px;
                            &:last-child{
                                margin:0;
                            }
                            i{
                                margin:-2px 0 0 0;
                            }
                        }
                    }
                    .groupTitle{
                        .noGroup{
                            text-align: center;
                            line-height: 50px;
                        }
                        li{
                            .editTrade{
                                width:300px;
                                display: inline-block;
                            }
                            .addInput{
                                width:70%;
                            }
                            .inputRightHint{
                                display: inline-block;
                                float:right;
                                margin-left:10px;
                                a{
                                    margin:0 5px;
                                }
                            }
                            .content{
                                display: inline-block;
                                padding-right: 12px;
                                height: 22px;
                                &:hover .title{
                                    width:130px;
                                }
                                .title{
                                    text-overflow:ellipsis;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    display:inline-block;
                                    float:left;
                                    width:300px;
                                }
                                &:hover .operation{
                                    display: inline-block;
                                }
                            }
                        }
                    }
                }
                .listRight{
                    margin-left:220px;
                    padding:0 0 10px 20px;
                    border-left:1px solid #e7e7e7;
                }
                .repositoryContent{
                    height: 100%;
                    overflow-y: auto;
                    .func{
                        margin-bottom:10px;
                    }
                    .replaceWrap{
                        margin-bottom:10px;
                        .replace{
                            margin-right:30px;
                            display: inline-block;
                            .input{
                                width:100px;
                                display: inline-block;
                            }
                        }
                    }
                }
            }
        }
    }
    .ivu-menu-submenu-title-icon{
        transform: rotate(270deg);
    }
    .qsContent{
        max-width: 400px;
        img{
            max-width:100px;
        }
    }
    .selectTradeModal{
        height:300px;
        width: 80%;
        margin:0 auto;
    }
</style>
