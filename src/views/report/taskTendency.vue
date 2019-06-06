<template>
    <div class="service">
        <Card class="serviceWrap">
            <div slot="title" class="title">
                <router-link to="/report">
                    <Icon type="md-arrow-round-back" />
                    <h2>会话趋势</h2>
                </router-link>
            </div>
            <div slot="extra">
                <DatePicker :value="trendTime" @on-change="searchTimeTrend" type="daterange" placement="bottom-end" placeholder="请选择时间" format="yyyy-MM-dd" style="width: 200px"></DatePicker>       
            </div>
            <div>
                <ButtonGroup class="section">
                    <Button v-for="(item,index) in dateButton" :type="item.isCheck"  @click="trendchangeDate(item.type,index)" :key="index">{{item.label}}</Button>
                </ButtonGroup>
                <div id="chatChart" class="canvasWrap" :style="{width: '100%', height: '400px'}"></div>
            </div>
            <Table :loading="showLoading" stripe :columns="columnsData" :data="tableData" class="dataTable"></Table>
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
import { chatMsgTrend } from '@/libs/api.js';
import { formDate, formDate02 } from '@/mixins/mixin';

export default {
    mixins:[formDate, formDate02],
    data(){
        return {
            trendParams:{  //会话趋势参数
                type: 'log',
                format: 'day',
                startTime: this.getMonthStartDate(),
                endTime:this.getMonthEndDate()
            },  
            trendData:{},    //趋势数据
            trendTime:[this.getMonthStartDate(),this.getMonthEndDate()],  // 会话趋势默认初始日期
            trendButton:[
                {type: 'fangke',label:'总访客',isCheck:'dashed'},
                {type: 'youxiaofangke',label:'有效访客',isCheck:'dashed'},
                {type: 'log',label:'对话条数',isCheck:'primary'},
            ],
            dateButton:[
                {type: 'hour',label:'小时',isCheck:'dashed'},
                {type: 'day',label:'天',isCheck:'primary'},
                {type: 'month',label:'月',isCheck:'dashed'},
            ],
            showLoading:true,
            columnsData:[],
            tableData:[],
        } 
    },
    mounted(){
        this.getChatMsgTrendList();          
    },
    methods:{
        //会话趋势 - 选择会话趋势日期 小时，天，月
        trendchangeDate(type,index){
            this.trendParams.format = type;
            this.dateButton.forEach(e => {
                e.isCheck = "dashed";
            })
            this.dateButton[index].isCheck = "primary";
            this.getChatMsgTrendList();
        },

        //选择会话趋势 - 类型
        trendchangeType(type, index){
            this.trendParams.type = type;
            this.trendButton.forEach(e => {
                e.isCheck = "dashed";
            })
            this.trendButton[index].isCheck = "primary";
            this.getChatMsgTrendList();
        },

        //会话趋势 - 选择时间
        searchTimeTrend(date){
            this.trendParams.startTime = date[0];
            this.trendParams.endTime = date[1];
            this.getChatMsgTrendList();
        },

        //会话趋势接口
        getChatMsgTrendList(){
            this.showLoading = true;
            chatMsgTrend(this.trendParams).then(res => {
                this.showLoading = false;
                if(res.code == 0){
                    this.trendData = res.data;
                    this.columnsData = res.data.tableHeader;
                    this.tableData = res.data.tableData;
                    this.sessionTrend();
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //加载会话趋势
        sessionTrend(){
            var myChart = echarts.init(document.getElementById('chatChart'),'macarons')
            // 绘制图表
            myChart.setOption({
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    // data:['小程序','微信','pc']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.trendData.lineKey
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                dataZoom: [
                    {
                        start: 0,
                        end: 100
                    }, 
                    {
                        type: 'inside'
                    }
                ],
                series : this.trendData.lineValue
            })
        },
    },
}
</script>

<style lang="less" scoped>
    .service{
        .serviceWrap{
            background: #fff;
            margin-bottom:20px;
            .section{
                margin-left:20px;
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
        .dataTable{
            margin-top:20px;
        }
    }
</style>
