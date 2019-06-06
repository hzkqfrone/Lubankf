<template>
    <Modal
        v-model="ticketsModal"
        class="createdTicketsModal"
        :title="title">
        <div style="padding:10px 0 30px 0">
            <Form :label-width="80">
                <FormItem label="标题">
                    <Input type="text" v-model="createParams.title" placeholder="标题"/>
                </FormItem>
                <FormItem label="工单分类">
                    <Select v-model="createParams.category_id">
                        <Option v-for="(item,index) in ticketsTag" :key="index" :value="item.id">{{item.ticket_name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="分配客服">
                    <Select v-model="createParams.transactor_id">
                        <OptionGroup v-for="(item,index) in kfList" :key="index" :label="item.name + '('+ item.active_num +')'">
                            <Option v-for="(list, lIndex) in item.list" :value="list.id" :label="list.username" :key="lIndex">
                                <span>{{ list.username }}</span>
                            </Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="优先级">
                    <RadioGroup v-model="createParams.level">
                        <Radio :label="0">低</Radio>
                        <Radio :label="1">中</Radio>
                        <Radio :label="2">高</Radio>
                        <Radio :label="3">紧急</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="内容">
                    <Input type="textarea" :rows="5" placeholder="内容" v-model="createParams.content"/>
                </FormItem>
                <FormItem label="附件">
                    <Upload :action="fileAction"
                        :show-upload-list="false"
                        :on-exceeded-size="exceededSize"
                        :on-format-error="handleFormatError"
                        :on-success="accessorySuccess"
                        :before-upload="beforeUpload"
                        :data="upLoadData"
                        name="file"
                        style="display:inline-block;">
                        <a href="javascript:;">上传附件</a>
                    </Upload>
                    <ul class="accessory" v-if="createParams.attachments.length>0">
                        <li v-for="(item,index) in createParams.attachments" :key="index"><a href="javascript:;">{{item}}<Icon type="md-close" @click="deleteAccessory(index)" title="删除" /></a></li>
                    </ul>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button @click="createCancel">取消</Button>
            <Button type="primary" :loading="createBtn" @click="createTicketsBtn">确定</Button>
        </div>
    </Modal>
</template>
<script>
import {ticketsClassify, getService, createTickets, editTickets} from '@/libs/api';
import { url, beyondSize } from '@/mixins/mixin';
export default {
    mixins:[url, beyondSize],
    props:['token', 'handle', 'ticketsData'],
    data(){
        return {
            createParams:{attachments:[]},  //创建工单参数 
            ticketsTag:[],   //工单分类
            kfList:[],  //客服列表
            upLoadData:{},
            fileAction:"",
            createBtn:false,
            ticketsModal:false,
            title:'新建工单',
            ticketsapi: createTickets,
        }
    },
    mounted() {
        this.fileAction = `${url}api/task/upload-file.htm`;
    },
    methods:{
        //上传之前
        beforeUpload(){
            this.upLoadData = {
                'Access-Token': this.$store.state.app.access_token,
            }  
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise;
        },


        //工单分类
        initTicketsTag(){
            ticketsClassify().then(res => {
                if(res.code == 0){
                    this.ticketsTag = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //	获取客服列表
        getServiceList(){
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //创建工单 - 附件上传成功
        accessorySuccess(res,file) {
            if(res.code == 0){
                this.createParams.attachments.push(res.data.url);
            }else{
                this.$Notice.error({title: res.msg});
            }
        },

        //取消创建工单
        createCancel(){
            this.ticketsModal = false;
            this.createParams = {attachments:[]};
        },

        //创建工单
        createTicketsBtn(){
            this.createParams.transactor = this.createParams.transactor_id;
            delete this.createParams.transactor_id;
            if(!this.createParams.title){
                this.$Notice.warning({title: "请填写工单标题"});
                return 
            }else if(!this.createParams.content){
                this.$Notice.warning({title: "请填写工单内容"});
                return
            }
            if(this.token) this.createParams.taskToken = this.token;
            this.createBtn = true;
            this.ticketsapi(this.createParams).then(res => {
                this.createBtn = false;
                if(res.code == 0){
                    this.ticketsModal = false;
                    this.$Notice.success({title: res.msg});
                    this.createParams = {attachments:[]};
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //删除附件列表
        deleteAccessory(index){
            this.createParams.attachments.splice(index,1);
        },

        //创建工单
        createTickets(data){
            if(!this.ticketsModal){
                this.ticketsModal = true;
                if(data){
                    this.title = "编辑工单";
                    this.createParams = data;
                    this.ticketsapi = editTickets;
                }
                if(this.ticketsTag.length==0) this.initTicketsTag();  //工单分类列表
                if(this.kfList.length==0) this.getServiceList();  //客服列表
            }
        }
    },
}
</script>
<style lang="less">

.accessory{
    margin:0;
    li{
        width:100%;
        margin-top:5px;
        a{
            display: inline-block;
            padding:0px 20px 0 10px;
            height:26px;
            background: #1ba8ed;
            border-radius: 3px;
            line-height: 26px;
            color:#fff;
            max-width:380px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
            i{
                margin:0 5px;
                font-size:16px;
                position: absolute;
                right:-2px;
                top:5px
            }
        }
    }
}
.createdTicketsModal{
    .ivu-modal-wrap{
        z-index: 99999 !important;
    }
}
</style>
