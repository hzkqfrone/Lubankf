<template>
    <div class="service">
        <div v-show="$route.path=='/report'">
            <Card class="serviceWrap">
                <p slot="title">
                    概况
                </p>
                <div slot="extra">
                    <DatePicker :value="ovCreateTime" @on-change="ovSearchTime" type="daterange" placement="bottom-end" placeholder="请选择时间" format="yyyy-MM-dd" style="width: 200px"></DatePicker>
                    <ButtonGroup>
                        <Button @click="changeDate(0,'overview')">今天</Button>
                        <Button @click="changeDate(1,'overview')">昨天</Button>
                        <Button @click="changeDate(2,'overview')">本周</Button>
                    </ButtonGroup>
                </div>
                <div class="interviewData">
                    <Spin size="large" fix v-if="showovSpin"></Spin>
                    <Row class="clearfix">
                        <Col span="3" class="left_title">
                            <Icon type="md-contact" />
                            <span>访问</span>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">总访客</p>
                            <p class="count">{{overviewData.totalUser}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">有效访客</p>
                            <p class="count">{{overviewData.effectiveUser}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">总浏览量</p>
                            <p class="count">{{overviewData.view_count}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">排队访客数</p>
                            <p class="count">{{overviewData.wait_count}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">排队流失访客数</p>
                            <p class="count">{{overviewData.wait_nojoin_count}}</p>
                        </Col>
                    </Row>
                    <Row class="clearfix">
                        <Col span="3"  class="left_title">
                            <Icon type="md-chatbubbles" />
                            <span>会话</span>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">总对话数</p>
                            <p class="count">{{overviewData.msgTotalNum}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">接入平均时间</p>
                            <p class="count date">{{overviewData.avgSignInTime}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">聊天平均时间</p>
                            <p class="count date">{{overviewData.avgTalkTime}}</p>
                        </Col>
                        <Col span="4"  class="item">
                            <p class="title">排队平均接入时间</p>
                            <p class="count date">{{overviewData.waitSignInTime}}</p>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Card class="serviceWrap">
                <div class="report_tab clearfix">
                    <Row class="clearfix">
                        <Col span="3"  class="left_title">
                            <Icon type="ios-chatbubbles" />
                            <span>会话</span>
                        </Col>
                        <Col span="3"  class="item">
                            <router-link to="/report/task">访客</router-link>
                        </Col>
                        <Col span="3"  class="item">
                            <router-link to="/report/taskTendency">会话趋势</router-link>
                        </Col>
                    </Row>
                    <Row class="clearfix">
                        <Col span="3"  class="left_title">
                            <Icon type="md-desktop" />
                            <span>网站</span>
                        </Col>
                        <Col span="3"  class="item">
                            <a href="javascript:;" @click="pcStatistics('browser')">搜索引擎统计</a>
                        </Col>
                        <Col span="3"  class="item">
                            <a href="javascript:;" @click="pcStatistics('os')">操作系统统计</a>
                        </Col>
                        <Col span="3"  class="item">
                            <a href="javascript:;" @click="pcStatistics('source')">搜索来源统计</a>
                        </Col>
                        <Col span="3"  class="item">
                            <a href="javascript:;" @click="pcStatistics('seoKeyword')">搜索关键词统计</a>
                        </Col>
                        <Col span="3"  class="item">
                            <a href="javascript:;" @click="pcStatistics('city')">城市统计</a>
                        </Col>
                    </Row>
                    <Row class="clearfix">
                        <Col span="3"  class="left_title">
                            <Icon type="md-person" />
                            <span>客服</span>
                        </Col>
                        <Col span="3"  class="item">
                            <router-link to="/report/eavluation">客服评价</router-link>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
        <div v-show="$route.path!='/report'">
            <router-view></router-view>
        </div>
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
import { overview } from '@/libs/api.js';
import { formDate, formDate02 } from '@/mixins/mixin';

export default {
    mixins:[formDate, formDate02],
    data(){
        return {
            overviewData:{},  //概况
            showovSpin:true,
            overviewParams:{
                startTime: this.formatDate(new Date(),"yyyy-MM-dd 00:00"),
                endTime: this.formatDate(new Date(),"yyyy-MM-dd 23:59")
            },
            ovCreateTime:[this.formatDate(new Date(),"yyyy-MM-dd 00:00"), this.formatDate(new Date(),"yyyy-MM-dd 23:59")],  //概况初始时间
            isLoadPage:false,
        } 
    },
    mounted(){
        if(this.$route.path=='/report'){
            // this.reportInit();          //概况
            // this.getChatMsgTrendList(); //会话趋势
            // this.webReportList();       //web统计
            // this.getEvaluationList();   //评价统计
            this.getOverview();         //概况
        }
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
            if(type == "overview"){
                this.ovCreateTime = [t1,t2];
                this.overviewParams.startTime = t1;
                this.overviewParams.endTime = t2;
                this.getOverview();
            }
        },

        //概况 - 选择日期
        searchTime(date){
            this.paramsData.startTime = date[0];
            this.paramsData.endTime = date[1];
            this.reportInit();
        },

        //概况
        getOverview(){
            this.showovSpin = true;
            overview(this.overviewParams).then(res => {
                this.showovSpin = false;
                if(res.code == 0){
                    this.overviewData = res.data[0];
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
        ovSearchTime(date){
            this.overviewParams.startTime = date[0];
            this.overviewParams.endTime = date[1];
            this.getOverview();
        },

        // WEB端系统，搜索引擎等数据分析
        pcStatistics(type){
            this.$router.push({
                path:`/report/web/${type}`
            })
        }
    },
    watch: {
        '$route'(){
            if(this.$route.path == '/report' && !this.isLoadPage){
                this.getOverview();         //概况
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .addBtn{
        margin-bottom:10px;
    }
    .service{
        padding:10px;
        .serviceWrap{
            background: #fff;
            margin-bottom:20px;
            .interviewData{
                display: block;
                .left_title,.item{
                    height:100px;
                }
                .left_title{
                    font-size:18px;
                    line-height: 100px;
                    text-indent: 12px;
                    i{
                        margin-top:-4px;
                    }
                }
                .item{
                    p.title{
                        color:#999;
                        padding-top:20px;
                    }
                    p.count{
                        font-size:26px;
                        line-height: 60px;
                    }
                    p.date{
                        font-size:20px;
                    }
                }
            }
            .report_tab{
                display: block;
                .left_title,.item{
                    line-height: 90px;
                }
                .left_title{
                    font-size:18px;
                    text-indent: 12px;
                    i{
                        margin-top:-4px;
                    }
                }
            }
        }
    }
</style>
