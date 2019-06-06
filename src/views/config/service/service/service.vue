<template>
    <div class="service">
        <div style="height:100%;padding:20px;">
            <div class="titleTop replyT">
                <div class="configTitle">
                    <router-link to="/config">
                        <Icon type="md-arrow-round-back" />
                        <h2>客服管理</h2>
                    </router-link>
                </div>
            </div>
            <div class="serviceContent clearfix configTop">
                <div class="group elementScroll">
                    <div class="addGroupBtn" @click="addGroupModal=true,groupTitle='添加技能组',addGroup={}"><Icon type="md-add" />添加技能组</div>
                    <div class="groupTitle">
                        <Spin size="large" fix v-if="showSpin"></Spin>
                        <ul class="clearfix">
                            <li :class="{selectGroup:serviceParams.group==0}">
                                <div>
                                    <span class="title" @click="group_userList(0)">默认分组</span>
                                </div>
                            </li>
                            <li v-for="(item,index) in group" :key="index" v-if="group.length>0" :class="{selectGroup:serviceParams.group==item.id}">
                                <div>
                                    <span class="title" @click="group_userList(item.id)">{{item.name}}</span>
                                    <div class="operation">
                                        <Icon class="edit" type="md-create" title="编辑" @click="editGroups(index)" />
                                        <Icon class="del" type="md-trash" title="删除" @click="confirm(item.id)"/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="listRight elementScroll">
                    <Button class="addBtn" type="primary" icon="md-add" @click="addService">添加客服</Button>
                    <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
                    <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
                </div>
            </div>

            <!-- 添加分组 -->
            <Modal
                v-model="addGroupModal"
                width="450"
                :title="groupTitle">
                <Form :label-width="80">
                    <FormItem label="分组名称">
                        <Input v-model="addGroup.name"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="addGroup.notes" type="textarea"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="closePoptip">取消</Button>
                    <Button type="primary" @click="addGroupBtn">确定</Button>
                </div>
            </Modal>

            <Modal
                v-model="ModalShow"
                :title="modalTitle">
                <Spin fix v-if="editModal"></Spin>
                <Form :model="addForm" ref="addForm" :rules="rules" :label-width="100">
                    <FormItem label="邮 箱" prop="email">
                        <Input v-model="addForm.email" :disabled="modalTitle=='编辑客服'" placeholder="邮箱(做为登录账号)" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="密 码" prop="password" v-if="!addForm.id">
                        <Input v-model="addForm.password" type="password" placeholder="密码" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="密 码" v-if="addForm.id">
                        <Input v-model="addForm.password" type="password" placeholder="密码" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="客服名" prop="username" required>
                        <Input v-model="addForm.username" placeholder="用户名" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="手机号" prop="mobile">
                        <Input v-model="addForm.mobile"  placeholder="手机号" style="width: 300px"/>
                    </FormItem>
                    <FormItem label="角色" prop="role_id">
                        <Select v-model="addForm.role_id" style="width:300px">
                            <Option :value="0">超级管理员</Option>
                            <Option v-for="(item, index) in roleArr" :value="item.id" :key="index">{{ item.groupName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="技能组">
                        <Select v-model="addForm.group" style="width:300px">
                            <Option v-for="(item,index) in group" :value="item.id" :key="index">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="备 注">
                        <Input v-model="addForm.remark" type="textarea" placeholder="备注" style="width: 300px"/>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button @click="ModalShow=false">取消</Button>
                    <Button type="primary" @click="asyncOKSevice">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import { getAllServiceList, getServiceInfo, addAndEditService, deleteService, getRoleList, getServiceGroup, addGroupInfo, deleteSkillGroup } from '@/libs/api'
export default {
    data(){
        const validateMobile = (rule, value, callback) => {
                var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if (!reg.test(value)) {
                    callback(new Error('邮箱格式有误'));
                } else {
                    callback();
                }
            };
        return {
            addGroupModal:false,
            addGroup:{},  // 添加组名
            editGroup:'',  //修改组名
            showSpin:false,
            group:[],
            ModalShow:false,
            modalTitle:'添加客服',
            groupTitle:'添加技能组',
            addForm:{},
            showLoading:true,
            editModal:false,
            resData:[],
            totalCount:0,
            serviceParams:{
                page:1,
                group:-2   //-2 全部
            },
            params:{},
            roleArr:[],  //角色列表
            columnsData: [
                {
                    key: 'username',
                    title: '姓名'
                },
                {
                    key: 'email',
                    title: '邮箱'
                },
                {
                    key: 'mobile',
                    title: '手机号'
                },
                {
                    key: 'role_name',
                    title: '角色'
                },
                {
                    key: 'status',
                    title: '状态',
                    render: (h, params) => {
                        var v = "", color = "";
                        switch (params.row.active) {
                            case 0:
                            v = "离线";color = "default";    
                                break;
                            case 1:
                            v = "空闲";color = "success";    
                                break;
                            case 2:
                            v = "忙碌";color = "error";    
                                break;
                            case 3:
                            v = "隐身";color = "warning";    
                                break;
                            case 4:
                            v = "离开";color = "primary";    
                                break;
                            default:
                                break;
                        }
                        return h("Tag",{
                            props:{
                                color:color
                            }
                        },v)
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
                                title: '您确定要删除此客服吗?',
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
                username: [
                    {required: true, message: '请输入客服名', trigger: 'blur'},
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: validateMobile, trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                ],
                role_id: [
                    {required: true, type: 'number', message: '请选择角色', trigger: 'blur'},
                ]
            },
        }
    },
    mounted(){
        this.getService();
        this.getServiceRoleList();
        this.getGroupList();
    },
    methods:{
        //获取客服列表
        getService(){
            this.showLoading = true;
            getAllServiceList(this.serviceParams).then(res => {
                if(res.code == 0){
                    this.showLoading = false;
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //获取组列表
        getGroupList(){
            getServiceGroup().then(res => {
                if(res.code == 0){
                    this.group = res.data;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        addService(){
            this.ModalShow = true;
            this.modalTitle = "添加客服";
            this.addForm = {};
            this.$refs.addForm.validate((valid) => {
                if(!valid){
                    this.$refs.addForm.resetFields();
                }
            })
        },

        //添加客服  ||   修改 多传id
        asyncOKSevice(){
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.editModal = true;
                    addAndEditService(this.addForm).then(res => {
                        this.editModal = false;
                        if(res.code == 0){
                            this.ModalShow = false;
                            this.$Notice.success({title:res.msg});
                            this.getService();
                            this.addForm = {};
                            this.serviceParams.page = 1;
                        }else{
                            this.$Notice.error({title:res.msg});
                        }
                    })
                }
            })
        },

        //编辑弹框
        edit(index){
            this.modalTitle = "编辑客服"
            this.ModalShow = true;
            this.editModal = true;
            this.$refs.addForm.validate((valid) => {
                if(!valid){
                    this.$refs.addForm.resetFields();
                }
            })
            getServiceInfo({id:this.resData[index].id}).then(res => {
                this.editModal = false;
                if(res.code == 0){
                    this.addForm = res.data;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //删除
        del(index){
            deleteService({id:this.resData[index].id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.getService();
                    this.serviceParams.page = 1;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //加载角色列表
        getServiceRoleList(){
            getRoleList().then(res => {
                if(res.code == 0){
                    this.roleArr = res.data;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },
        
        //改变页数
        changeNum (page){
            this.serviceParams.page = page;
        },

        //添加组
        addGroupBtn(){
           this.addAndEditGroup();
        },
        
        //取消添加组
        closePoptip(){
            this.addGroupModal = false;
            this.addGroup = {};
        },

        //点击编辑组
        editGroups(index){
            this.addGroup = this.group[index];
            this.addGroupModal = true;
            this.groupTitle = "编辑技能组";
        },  

        //删除组
        delGroup(id){
            deleteSkillGroup({id:id}).then(res => {
                if(res.code == 0){
                    this.getGroupList();
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

        //查看组成员
        group_userList(id){
            this.serviceParams.group = id;
            this.getService();
        },

        //编辑 - 添加 组
        addAndEditGroup(){
            if(!this.addGroup.name){
                this.$Notice.error({title:"请填写分组名称"});
                return false;
            }
            addGroupInfo(this.addGroup).then(res => {
                if(res.code == 0){
                    this.getGroupList();
                    this.addGroupModal = false;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        }

    }
}
</script>


<style lang="less" scoped>
    .service{
        height: 100%;
    }
    .addBtn{
        margin-bottom:10px;
    }
    .serviceContent{
        height:100%;
        margin-top:20px;
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
            padding-left:20px;
            border-left:1px solid #e7e7e7;
            height: 100%;
            overflow-y: auto;
        }
    }
</style>
