<template>
    <div class="service">
        <Card class="serviceWrap">
            <div slot="title" class="title">
                <router-link to="/report">
                    <Icon type="md-arrow-round-back" />
                    <h2>会话统计</h2>
                </router-link>
            </div>
            <div slot="extra">
                <DatePicker :value="createTime" @on-change="searchTime" type="daterange" placement="bottom-end" placeholder="请选择时间" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
                <ButtonGroup>
                    <Button @click="changeDate(0)">今天</Button>
                    <Button @click="changeDate(1)">昨天</Button>
                    <Button @click="changeDate(2)">本周</Button>
                </ButtonGroup>
            </div>
            <div>
                <Table :loading="showLoading" stripe :columns="columnsData" :data="tableData" class="dataTable"></Table>
                <Row class="canvasWrap">
                    <Col span="7"><div id="luban_pie0" :style="{ height: '300px'}"></div></Col>
                    <Col span="1" :style="{ height: '300px'}"></Col>
                    <Col span="7"><div id="luban_pie1" :style="{ height: '300px'}"></div></Col>
                    <Col span="1" :style="{ height: '300px'}"></Col>
                    <Col span="7"><div id="luban_pie2" :style="{ height: '300px'}"></div></Col>
                    <!-- <Col span="5"><div id="luban_pie3" :style="{ height: '250px'}"></div></Col> -->
                </Row>
                <div class="canvasWrap">
                    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
                </div>
                
                
            </div>
            <Spin size="large" fix v-if="showSpin"></Spin>
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
import { report } from '@/libs/api.js';
import { formDate, formDate02 } from '@/mixins/mixin';

export default {
    mixins:[formDate, formDate02],
    data(){
        return {
            showSpin:true,
            resData:{},
            createTime:[this.formatDate(new Date(),"yyyy-MM-dd 00:00"),this.formatDate(new Date(),"yyyy-MM-dd 23:59")],  //选择概况日期
            paramsData:{
                startTime: this.formatDate(new Date(),"yyyy-MM-dd 00:00"),
                endTime: this.formatDate(new Date(),"yyyy-MM-dd 23:59")
            },
            showLoading:false,
            columnsData:[
                {   
                    title: ' ',
                    key: 'n',
                    width: 120
                },
                {   
                    title: '总访客数',
                    key: 't'
                },
                {   
                    title: '有效访客数',
                    key: 'yt'
                },
                {   
                    title: '对话条数',
                    key: 'dt'
                },
                {   
                    title: '排队访客数',
                    key: 'waitTotal'
                },
                {   
                    title: '排队流失访客数',
                    key: 'waitNojoinTotal'
                },
                {   
                    title: '排队平均接入时间',
                    key: 'waitAvgTime'
                },
                {   
                    title: '接入平均时长',
                    key: 'pj'
                },
                {   
                    title: '会话平均时长',
                    key: 'pjt'
                }
            ],
            tableData:[],
            isLoadPage:false,
        } 
    },
    mounted(){
        this.reportInit();          
    },
    methods:{
        //加载数据概况
        reportInit(){
            report(this.paramsData).then(res => {
                this.isLoadPage = true;
                if(res.code == 0){
                    this.resData = res.data;
                    var key = {
                        type: 'scroll',
                        orient: 'horizontal',
                        y: 30,
                        data: this.resData.bingKey0,
                    }
                    this.drawPie(this.resData.bingTitle0,null,this.resData.bingValue0,document.getElementById('luban_pie0'));
                    this.drawPie(this.resData.bingTitle1,null,this.resData.bingValue1,document.getElementById('luban_pie1'));
                    this.drawPie(this.resData.bingTitle2,null,this.resData.bingValue2,document.getElementById('luban_pie2'));
                    this.drawLine();
                    this.tableData = res.data.tableData;
                    // this.evaluation();
                    this.showSpin = false;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },


        //概况
        drawPie(title, key, value, id) {
            var myChart = echarts.init(id,'macarons')
            myChart.setOption({
                title : {
                    text: title,
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: key,
                toolbox: {
                    show : true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center'
                },
                calculable : true,
                series : [
                    {
                        // name:'访问来源',
                        name:'',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: value
                    }
                ]
            });
        },

        

        //概况  柱状图
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('myChart'),'macarons')
            myChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    data: this.resData.bingKey0
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data: this.resData.zhuKey
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.resData.zhuValue
            });
        },

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
            this.createTime = [t1, t2];
            this.paramsData.startTime = t1;
            this.paramsData.endTime = t2;
            this.reportInit();
        },

        //概况 - 选择日期
        searchTime(date){
            this.paramsData.startTime = date[0];
            this.paramsData.endTime = date[1];
            this.reportInit();
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
