<template>
    <div class="home">
        <Card class="homeWrap">
            <p slot="title">
                今日数据
            </p>
            <ul class="dataContent">
                <li class="dataItem">
                    <p class="title">今日总访客</p>
                    <p class="count">{{resData.todayUser}}</p>
                </li>
                <li class="dataItem">
                    <p class="title">今日消息数</p>
                    <p class="count">{{resData.todayMessageNum}}</p>
                </li>
                <li class="dataItem">
                    <p class="title">处理中会话数</p>
                    <p class="count">{{resData.tasking}}</p>
                </li>
                <li class="dataItem">
                    <p class="title">在线客服数</p>
                    <p class="count">{{resData.onlineNum}}</p>
                </li>
            </ul>
        </Card>
        <Card class="homeWrap serviceReport">
            <p slot="title">
                工单
            </p>
            <ul class="dataContent tickets">
                <li class="dataItem" v-for="(item,index) in ticketsData" :key="index" @click="skipTicktes(index)">
                    <p class="title">{{item.name}}</p>
                    <p class="count">{{item.num}}</p>
                </li>
            </ul>
        </Card>
        <Card class="serviceReport">
            <Table :loading="showLoading" stripe :columns="columnsData" :data="resData.kefuInfo" class="dataTable"></Table>
        </Card>
    </div>
</template>

<script>
import {homeReport, homeTicketsReport} from '@/libs/api';
export default {
    data(){
       return {
            createTime:[],
            params:{},
            showLoading:false,
            resData:[],
            ticketsData:[],
            columnsData:[
                {   
                    title: '客服',
                    key: 'username'
                },
                {   
                    title: '状态',
                    key: 'status',
                    render: (h, params) => {
                        var num = Number(params.row.active || params.row.onlines)
                        return h('Badge',{
                            props:{
                                status: this.sArr[num].s,
                                text: this.sArr[num].label
                            }
                        })
                    }
                },
                {   
                    title: '好评 / 好评率',
                    key: 'pj0'
                },
                {   
                    title: '中评 / 中评率',
                    key: 'pj1'
                },
                {   
                    title: '差评 / 差评率',
                    key: 'pj2'
                },
                {   
                    title: '无评价',
                    key: 'no_pj'
                },
                {   
                    title: '已接待人数 / 最大接待人数',
                    key: 'nickname',
                    render: (h, params) => {
                        return h('div',params.row.task.service_num + ' / '+  params.row.task.max_service_num)
                    },
                }
           ],
           sArr:[
                {s:'default',label:'离线',value:'0'},
                {s:'success',label:'空闲',value:'1'},
                {s:'error',label:'忙碌',value:'2'},
                {s:'warning',label:'隐身',value:'3'},
                {s:'processing',label:'离开',value:'4'}
            ],
       } 
    },
    mounted() {
        this.init();
    },
    methods:{
        init(){
            homeReport().then(res => {
                if(res.code == 0){
                    this.resData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
            homeTicketsReport().then(res => {
                if(res.code == 0){
                    this.ticketsData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //跳到工单
        skipTicktes(type){
            this.$router.push({
                path: `/tickets?type=${type}`
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .home{
        padding:10px;
        .dataContent{
            .dataItem{
                text-align: center;
                background: aliceblue;
                margin: 0 10px;
                padding: 20px 0;
                .title{
                    font-size:18px;
                }
                .count{
                    font-size:20px;
                    font-weight: bold;
                    line-height: 40px;
                    padding-top:10px;
                }
            }
        }
        .tickets .dataItem{
            cursor: pointer;
            &:hover{
                background: #cfe5fb;
            }
        }
        ul.dataContent{
            display: flex;
            li{
                flex: 1;
            }
        }
        .serviceReport{
            margin-top:10px;

        }
    }
</style>

