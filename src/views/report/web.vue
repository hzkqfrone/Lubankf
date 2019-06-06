<template>
    <Card style="height:100%;" class="robotSetup">
        <Spin size="large" fix v-if="showovSpin"></Spin>
        <div slot="title" class="title">
            <router-link to="/report">
                <Icon type="md-arrow-round-back" />
                <h2>{{titleName}}统计</h2>
            </router-link>
        </div>
        <div slot="extra">
            <DatePicker :value="webTimeRe" @on-change="selectDate" type="daterange" placement="bottom-end" placeholder="请选择时间" format="yyyy-MM-dd" style="width: 200px"></DatePicker>       
        </div>
        <div>
            <ButtonGroup class="section">
                <Button v-for="(item,index) in dateButton" :type="item.isCheck"  @click="trendchangeDate(item.type,index)" :key="index">{{item.label}}</Button>
            </ButtonGroup>
            <div id="webReportChart" class="canvasWrap" :style="{width: '100%',height: '500px'}"></div>
        </div>
        <Table :loading="showLoading" stripe :columns="columnsData" :data="tableData" class="dataTable"></Table>
    </Card>
</template>
<script>
    import { webSourceReport } from '@/libs/api';
    // 引入基本模板
    let echarts = require('echarts/lib/echarts')
    // 引入饼状图组件
    require('echarts/lib/chart/pie')
    // 引入提示框和title组件
    require('echarts/lib/component/tooltip')
    require('echarts/lib/component/title')
    require('echarts/lib/component/legend')
    import  'echarts/theme/macarons.js'
    import  'echarts/theme/shine.js'
    import { formDate, formDate02 } from '@/mixins/mixin';

    export default{
        mixins:[formDate, formDate02],
        data(){
            return{
                params:{
                    format:'day',
                    type:'browser',
                    startTime: this.formatDate(new Date(),"yyyy-MM-dd 00:00"),
                    endTime: this.formatDate(new Date(),"yyyy-MM-dd 23:59")
                },
                webSourceData:{},
                webTimeRe:[this.formatDate(new Date(),"yyyy-MM-dd 00:00"),this.formatDate(new Date(),"yyyy-MM-dd 23:59")],       //默认今天日期
                dateButton:[
                    {type: 'hour',label:'小时',isCheck:'dashed'},
                    {type: 'day',label:'天',isCheck:'primary'},
                    {type: 'month',label:'月',isCheck:'dashed'},
                ],
                showovSpin:true,
                titleName:'',
                showLoading:true,
                columnsData:[],
                tableData:[],
            }
        },
        mounted() {
            if(this.$route.params.type){
                switch (this.$route.params.type) {
                    case 'browser':
                    this.titleName = "搜索引擎"
                        break;
                    case 'os':
                    this.titleName = "操作系统"
                        break;
                    case 'source':
                    this.titleName = "搜索来源"
                        break;
                    case 'seoKeyword':
                    this.titleName = "搜索关键词"
                        break;
                    case 'city':
                    this.titleName = "城市"
                        break;
                    default:
                        break;
                }
                this.params.type = this.$route.params.type;
                this.getReport();
            }
        },
        methods:{
            getReport(){
                this.showovSpin = true;
                this.showLoading = true;
                webSourceReport(this.params).then(res => {
                    this.showovSpin = false;
                    this.showLoading = false;
                    if(res.code == 0){
                        this.webSourceData = res.data;
                        this.columnsData = res.data.tableHeader;
                        this.tableData = res.data.tableData;
                        this.initWebCharts();
                    }else{
                        this.$Notice.error({title: res.msg});
                    }
                })
            },

            //加载会话趋势
            initWebCharts(){
                var myChart = echarts.init(document.getElementById('webReportChart'),'macarons')
                // 绘制图表
                myChart.setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'horizontal',
                        type: 'scroll',
                        y: 30,
                        data: this.webSourceData.lineValue || []
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
                            data : this.webSourceData.lineKey
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
                    series : this.webSourceData.lineValue
                })
            },

            //选择日期
            selectDate(date){
                this.params.startTime = date[0];
                this.params.endTime = date[1];
                this.getReport();
            },
            trendchangeDate(type,index){
                this.params.format = type;
                this.dateButton.forEach(e => {
                    e.isCheck = "dashed";
                })
                this.dateButton[index].isCheck = "primary";
                this.getReport();
            }
        }
    }
</script>
<style lang="less" scoped>
    .robotSetup{
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

