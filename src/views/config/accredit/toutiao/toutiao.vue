<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>今日头条接入</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div>
            <div class="binding">
                <h3>绑定今日头条</h3>
                <p>绑定后你可以使用鲁班客服统一接收与回复顾客咨询</p>
                <p>对接头条有两种方式，一种是在头条上加鲁班客服聊天链接，访客可以点击咨询打开鲁班客服对话框，还一种是嵌入鲁班客服网页插件代码</p>
                <Button type="success" @click="toutiaoAccredit">绑定今日头条</Button>
            </div>
        </div>
    </div>
</template>

<script>
import {accreditList} from '@/libs/api';
export default {
    data(){
        return {
            showLoading:false,
            resData:[], 
            params:{},
            columnsData:[
                {
                    key: 'nickname',
                    title: '今日头条名称'
                },
                {
                    key: 'createTime',
                    title: '接入时间'
                },
                {
                    key: 'status',
                    title: '授权',
                    render:(h,params) => {
                        var status = "已授权",
                            color = "success";
                        if(params.row.status == 0){
                            status = "未授权";
                            color = "error";
                        }
                        return h('Tag',{
                            props:{
                                color:color
                            }
                        },status)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width:200,
                    render: (h, params) => {
                        return h('div',[
                            h('Poptip', {
                               props: {
                                   confirm: true,
                                   title: '您确定要删除吗?',
                                   transfer: true
                               },
                               on: {
                                   'on-ok': () => {
                                       this.del(params.row.appToken)
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
                                        if(this.$store.state.app.LUBAN_auth.indexOf("assign/:id")>-1){
                                            this.$router.push({
                                                path:`/config/assign/${params.row.appToken}`
                                            })
                                        }else{
                                            this.$Notice.warning({title: '您暂无操作权限~'});
                                        }
                                    }
                                }
                            }, '指定客服'),
                        ]) 
                    }
                }
            ]
        }
    },
    mounted() {

    },
    methods:{
        toutiaoAccredit(){
            window.open('https://ad.toutiao.com/','_blank');
        },
    },
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
        .accreditList{
            margin-top:20px;
        }
    }
    .binding{
        padding:20px;
        p{
            line-height: 50px;
        }
    }
</style>
