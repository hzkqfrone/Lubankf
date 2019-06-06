<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>角色列表</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <Button type="primary" icon="md-add" @click="addRoles">添加新角色</Button>
        </div>
        <div class="accreditList">
            <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
        </div>
        <Spin fix size="large" v-if="showSpin"></Spin>
    </div>
</template>

<script>
import { getRoleList, deleteRole } from '@/libs/api';
export default {
    data(){
        return {
            searchContent:'',  //搜索关键字
            showSpin:false,
            showLoading:false,
            resData:[],
            columnsData:[
                {
                    key: 'groupName',
                    title: '名称'
                },
                {
                    key: 'remarks',
                    title: '描述'
                },
                {
                    title: '操作',
                    key: 'action',
                    width:200,
                    render: (h, params) => {
                        return h('div',[
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
                                        this.$router.push({
                                            path:`/config/roles/add?id=${params.row.id}`
                                        })
                                    }
                                }
                            }, '编辑'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除此角色吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.delete(params.row.id)
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
        }
    },
    mounted() {
        this.getRolesList();
    },
    methods:{    
        //加载角色列表
        getRolesList(){
            getRoleList().then(res => {
                if(res.code == 0){
                    this.resData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //添加角色
        addRoles(){
            this.$router.push({
                path: '/config/roles/add'
            })
        },


        //删除
        delete(id){
            deleteRole({id: id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.getRolesList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
    },
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
</style>
