<template>
    <div class="highFrequency elementScroll">
        <div class="batchDel"><Button type="error" @click="del" icon="md-trash">删除</Button></div>
        <Table :loading="showLoading" :columns="columnsData" :data="resData" @on-selection-change="selectChange"></Table>
        <Page class="isPage" :page-size="20" :total="totalCount" show-elevator show-total @on-change="changeNum"></Page>
    </div>
</template>
<script>
import {getHighFrequencyList, deleteMark} from '@/libs/api';
export default {
    data(){
        return {
            showLoading:false,
            resData:[],
            totalCount:0,
            page:1,
            columnsData:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    key: 'title',
                    title: '问题',
                    minWidth: 300
                },
                {
                    key: 'mark_times',
                    title: '次数',
                },
                {
                    key: 'title',
                    title: '操作',
                    render: (h, params) => {
                        return (h('div',[
                            h('Button', {
                                props: {
                                    icon: 'md-add',
                                    type: 'primary',
                                    size: 'small',
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.$emit('addWord', params.row);
                                    }
                                }
                            }, '添加到知识库'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.ids = [params.row.id];
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
                            ]),
                        ])
                        )
                    }
                },
            ],
            ids:[],   //选中要删除的id
        }
    },
    methods: {
        init(){
            getHighFrequencyList({page: this.page}).then(res => {
                if(res.code == 0){
                    this.totalCount = Number(res.data.totalCount);
                    this.resData = res.data.list;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },
        changeNum(page){
            this.page = page;
            this.init();
        },

        //删除高频问题
        del(){
            if(this.ids.length < 1){
                this.$Notice.warning({title: '请选中要删除的问题'});
                return
            }
            deleteMark({ids: this.ids}).then(res => {
                if(res.code == 0){
                    this.ids = "";
                    this.$Notice.success({title:res.msg});
                    this.init();
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //删除 - 多选
        selectChange(row){
            this.ids = [];
            row.forEach(e => {
                this.ids.push(e.id);
            });
        },

        getList(){
            this.page = 1;
            this.init();
        }
    },
}
</script>
<style lang="less" scoped>
    .highFrequency{
        height: 100%;
        overflow-y: auto;
        padding-bottom:10px;
        .batchDel{
            text-align:right;
            margin:0 20px 10px 0;
        }
    }
</style>
