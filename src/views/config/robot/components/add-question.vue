<template>
    <!-- 关联问题 -->
    <Modal
        class="addRepository"
        v-model="showRelevanceList"
        width="800"
        title="添加关联问题">
        <Form :label-width="60">
            <FormItem label="选择分类" prop="email">
                <Select v-model="addForm.role_id" class="reInput" @on-change="changeCate" clearable>
                    <Option value="0">默认分类</Option>
                    <Option v-for="(item, index) in group" :value="item.id" :key="index">{{ item.title }}</Option>
                </Select>
            </FormItem>
        </Form>
        <Table :loading="showloading_q" :columns="relevanceData" :data="glData" @on-selection-change="selectChange_gl" ref="table"></Table>
        <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeReleNum"></Page>
        <div slot="footer">
            <Button @click="showRelevanceList=false">取消</Button>
            <Button type="primary" @click="addRelevance">确定</Button>
        </div>
    </Modal>
</template>

<script>
    import { getKnowledge, getCateList } from '@/libs/api';
    export default {
        props:['selectInData'],
        data(){
            return {
                showRelevanceList:false,    //show关联问题列表
                repositoryParams_q:{page:1},//关联问题列表参数
                showloading_q:true,         //loading关联问题列表
                addForm:{},
                group:[],
                glData:[],       //关联知识库列表
                //关联问题
                relevanceData: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        key: 'title',
                        title: '问题',
                        minWidth: 100,
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
                        title: '归属分类'
                    },
                    {
                        key: 'createTime',
                        title: '创建时间'
                    },
                    {
                        key: 'hit_times',
                        title: '命中次数'
                    },
                ],
                totalCount:0,
                select_wt:[],  //选中的相关问题
            }
        },
        methods:{
            //知识库列表接口
            getQsList(){
                getKnowledge(this.repositoryParams_q).then(res => {
                    this.showloading_q = false;
                    if(res.code == 0){
                        this.glData = res.data.list;
                        this.totalCount = Number(res.data.totalCount);
                        this.$nextTick(()=>{
                            this.updatedList();   //选中的关联问题
                        })
                    }else{
                        this.$Notice.error({title:res.msg});
                    }
                })
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

            //关联问题 - 下一页
            changeReleNum(page){
                this.repositoryParams_q.page = page;
                this.getQsList();
            },

            //关联问题 - 选择分类
            changeCate(value){
                this.repositoryParams_q.qid = value;
                this.getQsList();
            },

            //关联问题 - 选中关联问题
            selectChange_gl(row){
                this.select_wt = [];
                row.forEach(e => {
                    this.select_wt.push(e);
                });
            },

            //关联问题 - 添加关联问题
            addRelevance(){
                this.$emit('addQs',this.select_wt);
                this.showRelevanceList = false;
            },

            updatedList() {
                var data = this.selectInData;
                if(data){
                    for(var j = 0;j < data.length;j++){
                        for(var i = 0;i < this.glData.length;i++){
                            var _i = i;
                            let r_lth = this.glData[i];
                            if(r_lth.id == data[j].id){
                                this.$refs.table.objData[_i]._isChecked=true;
                            }
                        }
                    }
                }
            },

            //显示添加关联问题
            showAddQs(){
                this.showRelevanceList = true;
                this.repositoryParams_q.page = 1;
                this.getQsList();
                this.getGroupList();
            }
        },
    }
</script>
<style lang="less">
    .addRepository{
        .reInput{
            width:300px;
            display: block;
        }
        .similarity{
            margin-top:10px;
            display:inline-block;
        }
        .delRes{
            color:#f1025f;
            font-size:18px;
            cursor: pointer;
        }
    }
</style>