<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    菜单管理
                </p>
                <Row>
                    <span v-if="addMenuBtn" style="margin-right:10px;"><Button type="primary" icon="plus" @click="modal1 = true">添加</Button></span>
                    <!-- 搜索 -->
                    <span>
                        <Input v-model="searchMenu.path" placeholder="path" @on-enter="searchBtn" style="width: 200px"></Input>
                        <Input v-model="searchMenu.api" placeholder="api" @on-enter="searchBtn"  style="width: 200px"></Input>
                        <Input v-model="searchMenu.name" placeholder="name" @on-enter="searchBtn"  style="width: 200px"></Input>
                        <Button type="primary" icon="ios-search" @click="searchBtn">搜索</Button>
                    </span>

                    <!-- 添加栏目 -->
                    <Modal
                        v-model="modal1"
                        title="导航栏目新增"
                        class="addMenu">
                        <Form ref="addMenuStr" :model="addMenuStr" :label-width="100" :rules="ruleValidate">
                            <Form-item label="path" prop="path">
                                <Input style="width: 350px" v-model="addMenuStr.path"></Input>
                            </Form-item>
                            <Form-item label="name" prop="name">
                                <Input style="width: 350px" v-model="addMenuStr.name"></Input>
                            </Form-item>
                            <Form-item label="栏目名称" prop="title">
                                <Input style="width: 350px" v-model="addMenuStr.title"></Input>
                            </Form-item>
                            <Form-item label="图标">
                                <Input style="width: 350px" v-model="addMenuStr.icon"></Input>
                            </Form-item>
                            <Form-item label="访问地址" prop="view">
                                <Input style="width: 350px" v-model="addMenuStr.view"></Input>
                            </Form-item>
                            <Form-item label="上级分类" prop="pid">
                                <Select v-model="addMenuStr.pid" filterable  style="width: 350px">
                                    <Option v-for="item in superiorList" :value="item.id" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="Api" prop="api">
                                <Input style="width: 350px" v-model="addMenuStr.api"></Input>
                            </Form-item>
                            <Form-item label="排序" prop="sort">
                                <Input style="width: 350px" v-model="addMenuStr.sort"></Input>
                            </Form-item>
                            <Form-item label="状态">
                                <RadioGroup v-model="addMenuStr.status">
                                    <Radio label="停用">停用</Radio>
                                    <Radio label="启用">启用</Radio>
                                </RadioGroup>
                            </Form-item>
                            <Form-item label="显示左侧菜单">
                                <i-switch v-model="showMenu" @on-change="change"></i-switch>
                            </Form-item>
                        </Form>
                        <div slot="footer">
                            <Button @click="modal1=false">取消</Button>
                            <Button type="primary" @click="addMenu('addMenuStr')">确定</Button>
                        </div>
                    </Modal>

                    <!-- 修改栏目 -->
                    <Modal
                        v-model="modal2"
                        title="导航栏目编辑"
                        class="addMenu"
                        @on-ok="addMenu">
                        <Form ref="getMenuStr" :model="getMenuStr" :label-width="100" :rules="ruleValidate">
                            <Form-item label="path" prop="path">
                                <Input style="width: 350px" v-model="getMenuStr.path"></Input>
                            </Form-item>
                            <Form-item label="name" prop="name">
                                <Input style="width: 350px" v-model="getMenuStr.name"></Input>
                            </Form-item>
                            <Form-item label="栏目名称" prop="title">
                                <Input style="width: 350px" v-model="getMenuStr.title"></Input>
                            </Form-item>
                            <Form-item label="图标">
                                <Input style="width: 350px" v-model="getMenuStr.icon"></Input>
                            </Form-item>
                            <Form-item label="访问地址" prop="view">
                                <Input style="width: 350px" v-model="getMenuStr.view"></Input>
                            </Form-item>
                            <Form-item label="上级分类" prop="pid">
                                <Select v-model="getMenuStr.pid" filterable  style="width: 350px">
                                    <Option v-for="item in superiorList" :value="item.id" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="Api" prop="api">
                                <Input style="width: 350px" v-model="getMenuStr.api"></Input>
                            </Form-item>
                            <Form-item label="排序" prop="sort">
                                <Input style="width: 350px" v-model="getMenuStr.sort"></Input>
                            </Form-item>
                            <Form-item label="状态">
                                <RadioGroup v-model="getMenuStr.status">
                                    <Radio label="停用">停用</Radio>
                                    <Radio label="启用">启用</Radio>
                                </RadioGroup>
                            </Form-item>
                            <Form-item label="显示左侧菜单">
                                <i-switch v-model="showMenu" @on-change="change"></i-switch>
                            </Form-item>
                        </Form>
                        <div slot="footer">
                            <Button @click="modal2=false">取消</Button>
                            <Button type="primary" @click="addMenu('getMenuStr')">确定</Button>
                        </div>
                    </Modal>
                </Row>
                <Row class="margin-top-10 searchable-table-con1">
                    <Table :row-class-name="rowClassName" border :loading="loading" :columns="columnsData" :data="resData"></Table>
                </Row>

                <!-- <template>
                    <Page :total="totalCount" style="margin-top:20px" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                </template> -->
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import { get, post } from '@/libs/http';

    let redact = false;  //编辑
    let pageChange = {
        pageNum:1,
        numPerPage:10,
        path:'',
        api:'',
        name:''
    }
    let showMenuEdit = false;  //可编辑
    let showMenuDel = false;    //可删除

    export default {
        name: 'columnnav',
        data () {
            return {
                modal1:false,
                modal2:false,
                loading:true,   //Loading
                columnsData: [
                    {title: 'path',key: 'path'},
                    {title: 'name',key: 'name'},
                    {
                        title: '栏目名称',
                        key: 'title',
                        minWidth: 250,
                        width: 160,
                    	render: function (h, params) {
                            if (this.row.dep != 0) {
                                var j = "__";
                                var d = "|" + j.repeat(this.row.dep);
                            } else {
                                var d = "";
                            }
                            return h('span', d + this.row.title);
                        }
                    },
                    {
                    	title: '图标',
                    	key: 'icon',
                    	width: 80,
                    	render: function (h, params) {
                    		return h('Icon', {
                    			props: {
                                    type: this.row.icon,
                                },
                    		},this.row.icon);
                        }
                    },
                    {title: '访问地址',key: 'view'},
                    {title: '上级分类',key: 'pName'},
                    {title: 'Api',key: 'api'},
                    {
                        title: '状态',
                        key: 'status',
                        render: function (h, params) {
                            return h('span', this.row.status ==1 ? '启用' : '停用');
                        }
                    },
                    {
                        title: '显示左侧菜单',
                        key: 'showMenu',
                        render: function (h, params) {
                            return h('span', this.row.showMenu ==1 ? '显示' : '不显示');
                        }
                    },
                    {title: '排序',key: 'sort',width:80},
                    {
                        title: '操作',
                        key:'desc',
                        fixed: 'right',
                        width: 170,
                        render: (h, params) => {
                            let showMenuArr = [];
                            if(showMenuEdit){
                                showMenuArr.push(
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.index);
                                                if(this.getMenuStr.showMenu == '0'){
                                                    this.showMenu = false;
                                                }
                                                if(this.getMenuStr.status == '1'){
                                                    this.getMenuStr.status = '启用'
                                                }
                                            }
                                        }
                                    }, '编辑')
                                )
                            }

                            if(showMenuDel){
                                showMenuArr.push(
                                    h('Poptip', {
                                        props: {
                                            confirm: true,
                                            title: '您确定要删除这条数据吗?',
                                            transfer: true
                                        },
                                        on: {
                                            'on-ok': () => {
                                                this.removeMenu({id:params.row.id},params.index)
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
                                                icon:'trash-a',
                                                placement: 'top'
                                            }
                                        }, '删除')
                                    ])
                                )
                            }
                            return h('div', showMenuArr);
                        }
                    }
                ],
                resData:[],
                totalCount:0,
                showMenu:true,
                addMenuStr:{      //添加栏目 列表参数
                    path:'',
                    name:'',
                    title:'',
                    icon:'',
                    view:'',
                    pid:'',
                    sort:'',
                    status:'启用', //状态
                    showMenu:'显示',
                    api:''
                },
                getMenuStr:{},    //编辑栏目
                superiorList:[],  //上级分类
                searchMenu:{   //搜索
                    path:'',
                    api:'',
                    name:''
                },
                addMenuBtn:false,  //添加btn

                //验证规则
                ruleValidate: {
                    name: [
                        {required: true, message: 'name不能为空', trigger: 'blur'},
                    ],
                    path: [
                        {required: true, message: 'path不能为空', trigger: 'blur'},
                    ],
                    title: [
                        {required: true, message: '栏目名称不能为空', trigger: 'blur'}
                    ],
                    view: [
                        {required: true, message: '访问地址不能为空', trigger: 'blur'}
                    ],
                    pid: [
                        {required: true, message: '上级分类不能为空', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '排序不能为空', trigger: 'blur'}
                    ],
                    api: [
                        {required: true, message: 'api不能为空', trigger: 'blur'}
                    ]
                },
            };
        },
        computed: {
            // 拷贝数据
            getMenuStrData() {
                var obj={};
                obj=JSON.parse(JSON.stringify(this.getMenuStr));
                return obj
            },
            getResStrData() {
                var obj={};
                obj=JSON.parse(JSON.stringify(this.resData));
                return obj
            }
        },
        methods: {
            addMenu(name) {
                //验证表单
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var data = this.addMenuStr;
                        if(redact){
                            //编辑栏目
                            data = this.getMenuStrData;
                        }
                        if(data.showMenu == '显示' || data.showMenu == 1){
                            data.showMenu = 1;
                        }else{
                            data.showMenu = 0;
                        }
                        data.status = data.status== '启用' ? 1 : 0
                        //添加栏目
                        post('?r=api/menu/edit',data).then(res => {
                            this.modal1 = false;
                            this.modal2 = false;
                            if(res.errorCode == 0){
                                if(redact){
                                    this.$Notice.success({
                                        title: '编辑成功'
                                    });
                                    redact = false;
                                }else{
                                    this.$Notice.success({
                                        title: '添加成功'
                                    });
                                }
                                var str = {value:data.pName,label:data.pName,id:data.pid};
                                this.superiorList.push(str);
                                this.getMenuList(pageChange);
                            }else{
                                this.$Notice.error({title:res.msg});
                            }
                        }).catch(error => {
                            this.$Notice.error({title:error})
                        })
                    }
                })
            },
            //删除栏目
            removeMenu(id,index) {
                post('?r=api/menu/delete',id).then(res => {
                    if(res.errorCode == 0){
                        this.resData.splice(index, 1);
                        this.totalCount = this.totalCount - 1;
                    }else{
                        this.$Notice.warning({title:res.msg});
                    }

                })
            },
            //获取栏目列表
            getMenuList(data) {
                this.loading = true;
                post('?r=api/menu/list',data).then(res => {
                    this.loading = false;
                    if(res.errorCode == 0){
                        this.resData = res.data.dataList;
                        this.totalCount = Number(res.data.totalCount);
                    }else{
                        this.$Notice.warning({title:res.msg});
                    }
                })
            },
            //搜索
            searchBtn() {
                pageChange.path = this.searchMenu.path;
                pageChange.api = this.searchMenu.api;
                pageChange.name = this.searchMenu.name;
                this.getMenuList(pageChange);
            },
            //清空data值
            clearData(str) {
                for(var name in str) {
                    str[name] = ""
                }
            },
            //获取编辑栏目的数据
            edit (index) {
                this.modal2 = true;
                redact = true;
                this.showMenu = true;
                //获取拷贝的数据
                this.getMenuStr = this.getResStrData[index];
            },
            //是否显示左侧菜单
            change (status) {
                this.addMenuStr.showMenu = this.showMenu ? '显示' : '不显示';
                this.getMenuStr.showMenu = this.showMenu ? '显示' : '不显示';
            },
            //分页 - 页数
            // changeNum (page){
            //     pageChange.pageNum = page;
            //     this.getMenuList(pageChange);
            // },
            // //分页 - 条数
            // changeSize (size){
            //     pageChange.numPerPage = size;
            //     this.getMenuList(pageChange);
            // }
            rowClassName (row,index) {
                if(row.dep == 0){
                    return 'demo-table-info-row';
                }
            }
        },
        mounted () {
            this.getMenuList(pageChange);
            //获取栏目分类列表
            post('?r=api/menu/cate-list').then(res => {
                if(res.errorCode == 0){
                    var str = {value:'顶级栏目',label:'顶级栏目',id:'0'};
                    this.superiorList.push(str);
                    res.data.forEach(element => {
                        var str = {};
                        str.value = element.title;
                        str.label = element.title;
                        str.id = element.id;
                        this.superiorList.push(str);
                    });
                }
            })
            //获取权限
            let media_list = JSON.parse(localStorage.getItem('funList'));
            let msg = media_list[`menu_${this.$route.path.split('/')[1]}`];
            msg.forEach(val => {
                if(val.name == 'menu_add'){
                    this.addMenuBtn = true;
                }else if(val.name == 'menu_edit'){
                    showMenuEdit = true;
                }else if(val.name == 'menu_del'){
                    showMenuDel = true;
                }
            });
        },
        activated(){
            this.getMenuList(pageChange);
        }

    };

</script>

<style lang="less">
    @import '../../styles/common.less';

    .ivu-table .demo-table-info-row td{
        background: #7ec3f5;
    }
</style>
