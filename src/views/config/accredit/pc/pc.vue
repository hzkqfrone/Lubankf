<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>网站插件接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="binding">
            <Button type="primary" icon="md-add" @click="addWebsite">添加</Button>
            <!-- <Input style="width:300px;float:right;" search placeholder="请输入内容" v-model="searchContent" @on-enter="searchReply" @on-click="searchReply"></Input> -->
        </div>
        <div class="accreditList">
            <Table :loading="showLoading" :columns="columnsData" :data="resData"></Table>
        </div>
        <Spin fix size="large" v-if="showSpin"></Spin>
    </div>
</template>

<script>
import {accreditList, deleteApp} from '@/libs/api';
export default {
    data(){
        return {
            searchContent:'',  //搜索关键字
            showSpin:false,
            showLoading:false,
            resData:[],
            columnsData:[
                {
                    key: 'nickname',
                    title: '网站名称'
                },
                {
                    key: 'createTime',
                    title: '最后更新时间'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 350,
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
                                            path:`/config/website/style?t=${params.row.appToken}`
                                        })
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            path: `/config/website/accessCode/${params.row.appToken}`
                                        })
                                    }
                                }
                            }, '接入代码'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        window.open(`${this.$store.state.app.LUBAN_URL}preview.html?accessId=${params.row.appToken}`)
                                    }
                                }
                            }, '预览效果'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px',
                                },
                                on: {
                                    click: () => {
                                        if(this.$store.state.app.LUBAN_auth.indexOf("assign/:id")>-1){
                                            this.$router.push({
                                                path: `/config/website/chatLink/${params.row.appToken}`
                                            })
                                        }else{
                                            this.$Notice.warning({title: '您暂无操作权限~'});
                                        }
                                    }
                                }
                            }, '聊天链接'),
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '您确定要删除吗?',
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => {
                                        this.delete(params.row.appToken,params.index);
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        marginRight: '5px',
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
            ]
        }
    },
    mounted() {
        this.initPcList();
    },
    methods:{    
        //绑定网站列表
        initPcList(){
            accreditList({source:2}).then(res => {
                if(res.code == 0){
                    if(res.data.list) this.resData = res.data.list;
                }else{
                    this.$Notice.warning({title:res.msg});
                }
            })
        },

        //添加网站插件接入
        addWebsite(){
            this.$router.push({
                path:'/config/website/style'
            })
        },

        //删除
        delete(token, index){
            var data = {
                appToken: token,
                source: 2
            }
            deleteApp(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                    this.initPcList();
                }else{
                    this.$Notice.warning({title:res.msg});
                }
            })
        },

        //搜索
        searchReply(){

        }
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
