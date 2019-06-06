<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>标签管理</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <Button type="primary" icon="md-add" @click="addTagModal=true,tagData={color:'#57a4f5'}">添加新标签</Button>
        </div>
        <div class="accreditList">
            <Table stripe :loading="showLoading" :columns="columnsData" :data="resData"></Table>
        </div>
        
        <Modal
            v-model="addTagModal"
            title="添加标签">
            <Form :label-width="100" label-position="left">
                <FormItem label="标签颜色">
                    <div class="tagBoxColor">
                        <span v-for="(item,index) in chatskin" @click="selcetSkin(index)" :style="{background: item}"><Icon type="md-checkmark" v-show="tagData.color==item" /></span>
                    </div>
                    <ColorPicker v-model="tagData.color" @on-change="selcetColorPicker"/>
                </FormItem>
                <FormItem label="标签名称">
                    <Input type="text" v-model="tagData.name" :maxlength="50"></Input>
                </FormItem>
            </Form>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="addNewTag">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { addEditTag, getTagInfo, deleteTag } from '@/libs/api.js';
export default {
    data(){
        return {
            showSpin:false,
            showLoading:true,
            addTagModal:false,
            resData:[],
            tagData:{
                color: '#57a4f5'
            },  
            chatskin:['#57a4f5','#19caa6','#b50e03','#f49300','#9ec100','#00cccd','#5b799a','#871f78'],
            columnsData:[
                {
                    key: 'name',
                    title: '标签',
                    render:(h, params) => {
                        return h("Tag",{
                            props:{
                                color:params.row.color
                            }
                        },params.row.name)
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
                                        var obj={};
                                        obj=JSON.parse(JSON.stringify(params.row));
                                        this.tagData = obj;
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
        this.getTagList();
    },
    methods:{    
        //加载标签列表
        getTagList(){
            this.showLoading = true;
            getTagInfo().then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //添加新标签
        addNewTag(){
            if(!this.tagData.name){
                this.$Notice.error({title: "请填写标签名称"});
                return false;
            }
            addEditTag(this.tagData).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.addTagModal = false;
                    this.getTagList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //取消
        cancel(){
            this.tagData = {
                color: '#57a4f5'
            };
            this.addTagModal = false;
        },

        //删除
        delete(id){
            deleteTag({id: id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.getTagList();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
        
        //选择标签颜色
        selcetSkin(index){
            this.tagData.color = this.chatskin[index];
        },
        selcetColorPicker(color){
            this.tagData.color = color;
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
    .tagBoxColor {
        span{
            display: inline-block;
            width: 26px;
            height: 26px;
            border-radius: 3px;
            margin-right: 16px;
            position: relative;
            cursor: pointer;
        }
        i {
            position: absolute;
            top: 2px;
            left: 2px;
            color: #fff;
            font-size: 20px;
        }
    }
</style>
