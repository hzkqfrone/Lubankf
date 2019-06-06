<template>
    <div class="sensitiveWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>敏感词</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="sensitiveWord">
            <Tabs :value="tabValue" @on-click="selectTabs">
                <TabPane label="客服敏感词" name="0"></TabPane>
                <TabPane label="客户敏感词" name="1"></TabPane>
            </Tabs>
            <div class="addSearchHint">
                <div class="template">
                    <p><Icon type="md-download" />下载<a href="javascript:;" @click="downLoadTemplate">敏感词数据导入模板</a></p>
                </div>
                <Button type="primary" class="addIpBlack" icon='md-add' @click="addModal=true">添加敏感词</Button>
                <Button class="delBtn" type="error" icon="md-trash" @click="batchDel">删除</Button>
                <div class="h_right">
                    <Input style="width:300px;" search placeholder="请输入关键字" v-model="params.word" @on-enter="init" @on-click="init"></Input>
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
                    <Button type="info" icon="md-arrow-down" @click="exportSensitive">导出</Button>
                </div>
            </div>
            <Table v-if="tabValue=='0'" stripe :loading="showLoading" :columns="columnsData" :data="resData" @on-selection-change="selectTable"></Table>
            <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
        </div>

        <!-- 添加敏感词 -->
        <Modal
            v-model="addModal"
            title="添加敏感词">
            <Form :label-width="60" class="userInfo">
                <FormItem label="敏感词">
                    <Alert type="error">请输入敏感词(一行一个)</Alert>
                    <Input type="textarea" :rows="10" v-model="sensitive"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="addModal=false">取消</Button>
                <Button type="primary" :loading="btnLoading" @click="sureAdd">确定</Button>
            </div>
        </Modal>

        <!-- 编辑敏感词 -->
        <Modal
            v-model="editModal"
            width="450"
            title="编辑敏感词">
            <Form :label-width="60" class="userInfo">
                <FormItem label="敏感词">
                    <Input v-model="editContent.word"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="editModal=false">取消</Button>
                <Button type="primary" :loading="editBtnLoading" @click="edit">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
var qs = require('qs');
import {beyondSize, url} from '@/mixins/mixin';
import {getSensitiveList, addSensitive, updateSensitive, delSensitive, exportTemplate} from '@/libs/api';
export default {
    mixins:[beyondSize, url],
    data(){
        return {
            tabValue: '0',
            showLoading: true,
            resData: [],
            params: {
                page: 1,
                type: 0,                     //0客服敏感词 1客户敏感词
            }, 
            importAction: '',                //上传地址
            uploadData: {},                  //上传所需参数
            addModal: false,
            editModal: false,
            btnLoading: false,               //添加敏感词loading
            editBtnLoading: false,           //编辑btn loading
            editParams: {},
            sensitive: '',                   //添加敏感词参数
            totalCount: 0,                   //总计
            delIds:[],                       //选中要删除的id
            columnsData: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    key: 'word',
                    title: '敏感词'
                },
                {
                    key: 'updateTime',
                    title: '更新时间'
                },
                {
                    key: 'hint',
                    title: '操作',
                    render: (h, params) => {
                        return h("div",[
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
                                        this.editModal = true;
                                        this.editParams = this.resData[params.index];
                                    }
                                }
                            }, '编辑'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.delIds = [params.row.id];
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
                            ])
                        ])
                    }
                }
            ],
        }
    },
    computed: {
        editContent(){
            var obj = JSON.parse(JSON.stringify(this.editParams));
            return obj;
        }
    },
    mounted() {
        this.init();
        this.importAction = `${url}api/settings/sensitive/import.htm`;    //导入接口
    },
    methods:{    
        init(){
            this.showLoading = true;
            getSensitiveList(this.params).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        selectTabs(name){
            this.params.type = name;
            this.init();
        },

        //上传前
        beforeUpload(){
            this.uploadData = {
                type: this.params.type,
                'Access-Token':this.$store.state.app.access_token
            };
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            return promise;
        },

        //导入成功
        uploadSuccess(res){
            if(res.code == 0){
                this.$Notice.success({title: res.msg}); 
                this.init();
            }else{
                this.$Notice.error({ title: res.msg});
            }
        },

        //导出
        exportSensitive(){
            if(this.resData.length == 0){
                this.$Notice.warning({title: '暂无要导出的数据'});
                return
            }
            var data = {
               'Access-Token':this.$store.state.app.access_token,
                type: this.params.type
            }
            window.open(`${url}api/settings/sensitive/export.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //编辑
        edit(){
            if(this.editParams.words == ''){
                this.$Notice.warning({title: '敏感词不能为空'});
                return 
            }
            this.editBtnLoading = true;
            this.editContent.type = this.params.type;
            updateSensitive(this.editContent).then(res => {
                this.editBtnLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.editModal = false;
                    this.init();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //删除
        del(){
            var data = {
                ids: this.delIds,
                type: this.params.type
            }
            delSensitive(data).then(res => {
                if(res.code == 0){
                    this.delIds = [];
                    this.$Notice.success({title: res.msg});
                    this.init();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //批量删除
        batchDel(){
            if(this.delIds.length < 1){
                this.$Notice.warning({title: '请选中要删除的敏感词'});
                return
            }
            this.del();
        },

        //添加敏感词
        sureAdd(){
            var content = this.sensitive.split(/[(\r\n)\r\n]+/);
            if(content.length == 0){
                this.$$Notice.warning({title: '敏感词不能为空'});
                return 
            }
            var data = {
                words: content,
                type: this.params.type
            }
            this.btnLoading = true;
            addSensitive(data).then(res => {
                this.btnLoading = false;
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.init();
                    this.addModal = false;
                    this.sensitive = '';
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //下载导入模板
        downLoadTemplate(){
            var data = {
                'Access-Token':this.$store.state.app.access_token
            }
            window.open(`${url}api/settings/sensitive/export-template.htm?${qs.stringify(Object.assign(data))}`,'_blank');
        },

        //下一页
        changeNum(page){
            this.params.page += 1;
            this.init();
        },

        //表格多选
        selectTable(selection){
            console.log(selection)
            this.delIds = [];
            selection.forEach(e => {
                this.delIds.push(e.id);
            });
        }
        // 充值总额  余额
    }
}
</script>


<style lang="less" scoped>
    .sensitiveWrap{
        background:#fff;
        padding:20px;
    }
    .sensitiveWord{
        margin-top:20px;
        .addSearchHint{
            margin-bottom:20px;
            .template{
                text-align: right;
            }
            .h_right{
                float: right;
            }
            .importReply{
                display: inline-block;
            }
        }
    }
    .ipWrap{
        display: inline-block;
        border: 1px solid #c5c8ce;
        border-radius: 4px;
        padding: 0px 8px;
        &:hover{
          border-color:#57a3f3;  
        }
        input{
            width: 30px;
            font-size: 12px;
            border: none;
            outline: none;
            text-align: center;
            font-weight: 400;
            line-height: 20px;
        }
    }
</style>
