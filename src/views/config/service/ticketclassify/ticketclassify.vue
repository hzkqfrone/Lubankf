<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>工单分类</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <Button type="primary" icon="md-add" @click="addClassify">添加新分类</Button>
        </div>
        <div class="accreditList">
            <Table stripe :loading="showLoading" :columns="columnsData" :data="resData"></Table>
        </div>
        
        <Modal
            v-model="addTagModal"
            title="添加新分类">
            <Form :label-width="100" label-position="left">
                <FormItem label="分类名称">
                    <Input type="text" v-model="params.ticket_name" :maxlength="50"></Input>
                </FormItem>
            </Form>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="createBtn">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {ticketsClassify, createClassify, editClassify, deleteClassify} from '@/libs/api';
export default {
    data(){
        return {
            showSpin:false,
            showLoading:false,
            addTagModal:false,
            resData:[],
            totalCount:0,
            columnsData:[
                {
                    key: 'ticket_name',
                    title: '分类名称',
                    render: (h,params) => {
                        return h("Tag",{
                            props:{
                                color:"default"
                            }
                        },params.row.ticket_name)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
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
                                        this.api = editClassify;
                                        this.params = params.row;
                                        this.params.category_id = params.row.id;
                                        this.addTagModal = true;
                                    }
                                }
                            }, '编辑'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除此标签吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.delete(params.row.id);
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
            params:{},    //分类名称
            api: createClassify,  //接口地址
            page: 1,
        }
    },
    mounted() {
        this.initClassifylist();
    },
    methods:{    
        //加载工单分类
        initClassifylist(){
            ticketsClassify({page: this.page}).then(res => {
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        addClassify(){
            this.api = createClassify;
            this.addTagModal = true;
            this.params = {};
        },

        //创建工单分类
        createBtn(){
            if(!this.params.ticket_name){
                this.$Notice.warning({title: "请填写分类名称"});
                return false;
            } 
            this.api(this.params).then(res => {
               if(res.code == 0){
                   this.name = "";
                   this.$Notice.success({title: res.msg});
                   this.addTagModal = false;
                   this.initClassifylist();
               }else{
                   this.$Notice.error({title: res.msg});
               }
            }) 
        },

        //取消创建
        cancel(){
            this.params = "";
            this.addTagModal = false;
        },

        //删除
        delete(id){
            deleteClassify({category_id: id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.initClassifylist();
                }else{
                   this.$Notice.error({title: res.msg}); 
                }
            })
        }
    }
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
