<template>
    <div class="service">
        <Card class="serviceWrap">
            <div slot="title" class="title">
                <router-link to="/report">
                    <Icon type="md-arrow-round-back" />
                    <h2>客服评价</h2>
                </router-link>
            </div>
            <div slot="extra">
                <DatePicker :value="eavCreateTime" @on-change="serviceSearchTime" type="daterange" placement="bottom-end" placeholder="请选择时间" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
                <ButtonGroup>
                    <Button @click="changeDate(0,'eav')">今天</Button>
                    <Button @click="changeDate(1,'eav')">昨天</Button>
                    <Button @click="changeDate(2,'eav')">本周</Button>
                </ButtonGroup>
            </div>
            <Table :loading="evaLoading" stripe :columns="evaData" :data="resEavData" class="dataTable"></Table>
        </Card>
    </div>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import  'echarts/theme/macarons.js'
import  'echarts/theme/shine.js'
import { evaluationData } from '@/libs/api.js';
import { formDate, formDate02 } from '@/mixins/mixin';

export default {
    mixins:[formDate, formDate02],
    data(){
        return {
            eavParams:{         //好评数统计
                startTime: this.formatDate(new Date(),"yyyy-MM-dd 00:00"),
                endTime: this.formatDate(new Date(),"yyyy-MM-dd 23:59")
            },
            eavCreateTime:[this.formatDate(new Date(),"yyyy-MM-dd 00:00"),this.formatDate(new Date(),"yyyy-MM-dd 23:59")],
            evaLoading:true,
            evaData:[
                {   
                    title: ' ',
                    key: 'username',
                    minWidth: 120
                },
                {   
                    title: '无评价',
                    key: 'no_pj'
                },
                {   
                    title: '好评',
                    key: 'pj0'
                },
                {   
                    title: '中评',
                    key: 'pj1'
                },
                {   
                    title: '差评',
                    key: 'pj2'
                },
                {   
                    title: '总计',
                    key: 'total'
                },
            ],
            resEavData:[],    //客服好评数统计
        }
    },
    mounted(){
        this.getEvaluationList();   //评价统计
    },
    methods:{
        //选择日期 
        changeDate(value, type){
            let t1,t2;
            if(value == 0){
                t1 = this.formatDate(new Date(),"yyyy-MM-dd 00:00");
                t2 = this.formatDate(new Date(),"yyyy-MM-dd 23:59");
            }else if(value == 1){
                t1 = this.formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 00:00");
                t2 = this.formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 23:59");
            }else if(value == 2){
                //本周
                t1 = this.getWeekStartDate();
                t2 = this.getWeekEndDate();
            }
            this.eavCreateTime = [t1, t2];
            this.eavParams.startTime = t1;
            this.eavParams.endTime = t2;
            this.getEvaluationList();
        },
        //客服评价统计
        getEvaluationList(){
            this.evaLoading = true;
            evaluationData(this.eavParams).then(res => {
                if(res.code == 0){
                    this.evaLoading = false;
                    this.resEavData = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //客服评价选择时间
        serviceSearchTime(date){
            this.eavParams.startTime = date[0];
            this.eavParams.endTime = date[1];
            this.getEvaluationList();
        },

    },
}
</script>

<style lang="less" scoped>
    .service{
        .serviceWrap{
            background: #fff;
            margin-bottom:20px;
            .dataTable{
                margin-bottom:20px;
            }
            .canvasWrap{
                overflow: hidden;
                margin-top:40px;
                .web_report{
                    border-right:1px solid #e7e7e7;
                    margin-right:50px;
                }
            }
        }
        .title{
            padding:0 20px;
            line-height: 35px;
            background: #fff;
            width: 100%;
            i{
                font-size:20px;
                vertical-align: text-bottom;
                margin-right:5px;
            }
            h2{
                font-size:14px;
                font-weight: 500;
                display:inline-block;
            }
        }
    }
</style>
