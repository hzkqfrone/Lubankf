<style lang="less">
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col>
            <Card>
                <p slot="title">
                    用户管理
                </p>
                <Row>
                    <Form :label-width="60" inline>
                        <FormItem label="用户名:">
                            <Input v-model="form.username" placeholder="请输入用户名" style="width: 200px" />
                        </FormItem>
                        <FormItem label="角 色:" prop="roleList" >
                            <Select v-model="form.roleList" style="width:100px">
                                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="启 用:" prop="enabled" >
                            <Select v-model="form.enabled" value="1" style="width:100px">
                                <Option value="-2">请选择</Option>
                                <Option value="1">启用</Option>
                                <Option value="0">不启用</Option>
                            </Select>
                        </FormItem>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    </Form>
                </Row>
                </Card>
                </Col>
            
				<Col class="margin-top-10">
            	<Card>
                <Row>
                    <Button type="success" v-if="isAdd" @click="userModalShow = true; disabled=false; modalTitle='添加';addForm = {};"><Icon type="plus"></Icon> 添加</Button>
                    <Button type="info" @click="init"><Icon type="refresh"></Icon> 刷新</Button>
                </Row>

                <Row class="margin-top-10 searchable-table-con1">
                    <Table border :loading="showLoading" :columns="columnsData" :data="resData" @on-sort-change="sort"></Table>
                </Row>

                <template>
                    <Page :total="totalCount" :current="pageInfo.pageNum" :page-size-opts="pageSizeOpts" :page-size="pageSize" show-sizer show-elevator show-total @on-change="changeNum" @on-page-size-change="changeSize"></Page>
                </template>

                <Modal
                    v-model="userModalShow"
                    :title="modalTitle"
                    @on-cancel="init();">
                    <Form :model="addForm" ref="addForm" :rules="rules" :label-width="100">
                        <FormItem label="用户名:" prop="username" required>
                            <Input v-model="addForm.username" :disabled="disabled" placeholder="用户名" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="姓 名:" prop="name" required>
                            <Input v-model="addForm.name" placeholder="姓 名" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="邮 箱:">
                            <Input v-model="addForm.email" type="email" placeholder="邮 箱" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="联系电话:">
                            <Input v-model="addForm.telphone"  placeholder="联系电话" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="公司名称:">
                            <Input v-model="addForm.companyName"  placeholder="公司名称" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="启用:">
                            <Checkbox v-model="addForm.enabled">是</Checkbox>
                        </FormItem>
                        <FormItem label="密码:">
                            <Input v-model="addForm.password" type="password" placeholder="密码" style="width: 300px"/>
                        </FormItem>
                        <FormItem label="角 色:" prop="roleList" required>
                            <Select v-model="rl" multiple @on-change="rlChange" style="width:300px">
                                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="登录方式:">
                            <CheckboxGroup v-model="addForm.loginType">
                                <Checkbox label="1">密码登录</Checkbox>
                                <Checkbox label="2">短信登录</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button @click="userModalShow=false;init();">取消</Button>
                        <Button type="primary" @click="asyncOKUser()">确定</Button>
                    </div>
                </Modal>
            </Card>

            </Col>
        </Row>
    </div>
</template>

<script>
    import http from '@/libs/http.js';
    let showEditBtn = false;   //编辑
    let showdelBtn = false;     //删除

    export default {
        name: 'user_list',
        data () {
            return {
                rl:[],
                pageSizeOpts:[15,50,100],
                pageSize:15,
                form:{
                    username:'',
                    roleList:'',
                },
                pageInfo:{
                    numPerPage:15,
                    pageNum:1,
                },
                orderInfo:{
                    orderField:'',
                    orderDirection:'',
                },
                columnsData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: 'username',
                        title: '用户名'
                    },
                    {
                        key: 'name',
                        title: '姓名'
                    },
                    {
                        key: 'roleList',
                        title: '角色',
                        render: function (h, params) {
                            return h('span', this.row.roleList.join(','));/*这里的this.row能够获取当前行的数据*/
                        }
                    },
                    {
                        key: 'enabled',
                        title: '启用状态',
                        sortable:"custom",
                        render: function (h, params) {
                            return h('span', this.row.enabled=='1' ? '启用' :'不启用');/*这里的this.row能够获取当前行的数据*/
                        }
                    },
                    {
                        key: 'lastvisit',
                        title: '最后登录时间'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:200,
                        render: (h, params) => {
                            let btns = [];
                            if(showEditBtn) {
                                btns.push(h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'edit'
                                        },
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params)
                                            }
                                        }
                                    }, '编辑')
                                )
                            }
                            if(showdelBtn){
                                btns.push(h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.del(params)
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
                                ]))
                            }
                            return h("div",btns)
                            
                        }
                    }
                    
                ],

                resData:[],
                totalCount:0,
                modalTitle:'添加',
                scrollable:true,
                disabled:false,
                userModalShow:false,
                maskClosable:false,
                loading:false,
                addForm:{
                    roleList:[],
                    enabled:true,
                    loginType:[]
                },
                defalutAddForm:{
                    enabled:true,
                    loginType:[]
                },
                rules:{
                    username: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '姓名不能为空', trigger: 'blur'},
                    ]
                },
                roleList:[],
                isAdd:false,
                showLoading:true
            };
        },
        methods: {
            init () {
                var qs = require('qs');
                this.showLoading = true;
                http.post('?r=api/user/list', qs.stringify(Object.assign(this.form,this.pageInfo,this.orderInfo))).then(res => {
                    if (res.data.errorCode === 0) {
                        // 登录成功
                        this.showLoading = false;
                        this.resData = res.data.data.dataList;
                        this.totalCount = Number(res.data.data.totalCount);
                    } else {
                        this.$Notice.error({title:res.data.msg});
                    }
                });

            },
            rlChange(option) {
                // console.log(option);
            },
            //搜索
            handleSearch () {
                this.pageInfo.pageNum = 1;
                this.init();
            },
            //编辑
            edit (params) {
                this.userModalShow = true;
                this.modalTitle = '编辑';
                this.disabled = true;
                params.row.enabled = params.row.enabled =='1' ? true :false;
                this.rl = params.row.roleId;
                this.addForm = params.row;
                this.addForm.jsDate = Number(params.row.jsDate)==0 ? 7 : Number(params.row.jsDate);
            },
            //删除
            del (params) {
                this.addForm = params.row;
                var qs = require('qs');
                http.post('?r=api/user/delete', qs.stringify(this.addForm)).then(res => {
                    if (res.data.errorCode === 0) {
                        // 登录成功
                        this.$Notice.success({
                            title: res.data.msg,
                        });
                        this.init();

                    } else {
                        this.$Notice.error({
                            title: res.data.msg,
                        });
                    }
                });
            },
            //改变页数
            changeNum (page){
                this.pageInfo.pageNum = page;
                this.init();
            },
            //改变显示数
            changeSize (size){
                this.pageInfo.numPerPage = size;
                this.init();
            },
            sort(column){
                if (column.order =='normal'){
                    this.orderInfo.orderField = '';
                    this.orderInfo.orderDirection = '';
                }else{
                    this.orderInfo.orderField = column.key;
                    this.orderInfo.orderDirection = column.order;
                }
                this.init();
            },
            //添加
            asyncOKUser () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addForm.roleList = this.rl;
                        this.addForm.enabled = this.addForm.enabled ? 1 : 0;
                        var qs = require('qs');
                        http.post('?r=api/user/edit', qs.stringify(Object.assign(this.addForm))).then(res => {
                            if (res.data.errorCode === 0) {
                                // 成功
                                this.$Notice.success({
                                    title: res.data.msg,
                                });
                                this.userModalShow = false;
                                this.init();
                                this.addForm = this.defalutAddForm;
                                this.rl = [];

                                this.loading = false;
                            } else {
                                this.loading = false;
                                this.$Notice.error({
                                    title: res.data.msg,
                                });
                            }
                        });
                    } else {
                        if (this.addForm.username=='' || this.addForm.username==undefined){
                            this.$Notice.error({
                                title: '用户名不能为空!',
                            });
                        }
                        if (this.addForm.name=='' || this.addForm.name==undefined){
                            this.$Notice.error({
                                title: '姓名不能为空!',
                            });
                        }
                        this.loading = false;
                        this.userModalShow = true;
                    }
                });

            },
            //点击添加
            clickAdd (){
                this.userModalShow = true;
                this.modalTitle='添加';
                this.addForm = {};
            }
        },
        mounted () {
            this.init();
            //获取数据(角色,营销顾问,销售)
            http.post('?r=api/user/get-role-list').then(res => {
                if (res.data.errorCode === 0) {
                    // 登录成功
                    this.roleList = res.data.data.role;
                }
            });
            //获取权限
            let media_list = JSON.parse(localStorage.getItem('funList'));
            let msg = media_list[`menu_${this.$route.path.split('/')[1]}`];
            msg.forEach(val => {
                if(val.name == 'user_edit'){
                    showEditBtn = true;
                }else if(val.name == 'user_add'){
                    this.isAdd = true;
                }else if(val.name == 'user_del'){
                    showdelBtn = true;
                }
            });
            
        },
        activated(){
            this.init();
        },
        
    };
</script>

<style lang="less">
    .ivu-page{
        margin-top:20px;
    }
</style>