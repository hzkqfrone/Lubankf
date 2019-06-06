<template>
    <div class="payWrap">
        <Card>
            <p slot="title">
                购买坐席
            </p>
            <div class="content">
                <Form :label-width="100" label-position="left">
                    <Form-item label="购买周期">
                        <RadioGroup v-model="params.limit" type="button" @on-change='changeLimit'>
                            <Radio v-for="(item, index) in payConfig.limit" :label="item.key" :key="index">{{item.value}}</Radio>
                        </RadioGroup>
                        <p class="remark" v-if="payConfig.buy_remarks">{{payConfig.buy_remarks}}</p>
                    </Form-item>
                    <Form-item label="在线坐席">
                        <Input style="width: 200px" @on-keyup="changeCount" v-model="params.agent_num"><span slot="append">位</span></Input> 
                    </Form-item>
                    <Form-item label="支付方式：">
                        <RadioGroup v-model="params.pay_type">
                            <Radio v-for="(item, index) in payConfig.pay_list" :key="index" :label="index">{{item}}</Radio>
                        </RadioGroup>
                    </Form-item>
                    <Form-item label="商品总价">
                        <span class="highlight">{{totalPrice}}</span>元
                    </Form-item>
                    <Form-item label="有效期至">
                        <span class="highlight">{{deadline}}</span>
                    </Form-item>
                     <Form-item label=" ">
                        <Button type="primary" :disabled="submintDisabled" :loading="submitLoading" @click="submitOrderBtn">提交订单</Button>
                    </Form-item>
                </Form>
            </div>
        </Card>

        <!-- 购买明细 -->
        <Card class="pay_log">
            <h4>购买明细</h4>
            <Table stripe :columns="columns" :data="resData"></Table>
            <Page class="isPage" :page-size="30" :total="totalCount" show-total show-elevator  @on-change="changeSize"/>
        </Card>
        
        <!-- 确认订单支付 -->
        <Modal v-model="confirmOrder" class="tapeOutMoadl" 
            title="确认订单支付"
            :mask-closable="false">
            <Form :label-width="100" label-position="left">
                <Form-item label="订单编号：">
                    {{orderInfo.order_sn}}
                </Form-item>
                <Form-item label="订单创建时间：">
                    {{orderInfo.created_at}}
                </Form-item>
                <Form-item label="购买周期：">
                    {{orderInfo.limit}}
                </Form-item>
                <Form-item label="在线坐席：">
                    {{orderInfo.agent_num}}
                </Form-item>
                <Form-item label="折扣：">
                    {{orderInfo.rate}}
                </Form-item>
                <Form-item label="支付金额：">
                    {{orderInfo.pay_amount}} 元
                </Form-item>
            </Form>
            <div slot="footer">
                <Button @click="resetPay">重新购买</Button>
                <Button type="primary" @click="surePay">确认并支付</Button>
            </div>
        </Modal>

        <!-- 充值中提示 -->
        <Modal
            v-model="rechargeModal"
            title="支付提示"
            width="500"
            :mask-closable="false">
            <p>正在支付中，请根据您支付的情况点击下面按钮</p>
            <div slot="footer">
                <Button @click="rechargeModal=false">取消</Button>
                <Button type="primary" @click="rechargeSure">支付完成</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import { initPayData, imputedPrice, submitOrder, orderList, cancelOrder } from '@/libs/api';
import { url } from '@/mixins/mixin';
export default {
    mixins:[url],
    data(){
        return{
            params: {
                pay_type: 0
            },
            confirmOrder: false,            //确认订单modal
            rechargeModal: false,    
            submitLoading: false,           //提交订单loading
            submintDisabled: true,
            payConfig: {},                  //支付配置 
            totalPrice: 0,                  //商品总价
            deadline: '',                   //有效期
            orderInfo: {},                  //提交的订单详情
            totalCount: 0,
            page: 1,
            columns: [
                {
                    title: '订单编号',
                    key: 'order_sn'
                },
                {
                    title: '支付方式',
                    key: 'pay_type'
                },
                {
                    title: '订单标题',
                    key: 'body'
                },
                {
                    title: '总价格',
                    key: 'total_fee'
                },
                {
                    title: '实付金额',
                    key: 'amount'
                },
                {
                    title: '订单状态',
                    key: 'pay_status_label',
                    render(h, params) {
                        var color = 'default';
                        if(params.row.pay_status == 0){
                            color = 'orange';
                        }
                        return h('Tag', {
                            props:{
                                color: color
                            }
                        },params.row.pay_status_label);
                    },
                },
                {
                    title: '创建时间',
                    key: 'created_at'
                },
                {
                    title: '操作',
                    key: 'hint',
                    render: (h, params) => {
                        if(params.row.pay_status == 0){
                            return h('div',[
                                h('Button',{
                                    props:{
                                        size: 'small'
                                    },
                                    style:{
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: ()=> {
                                            this.cancelOrder(params.row.order_sn);
                                        }
                                    }
                                }, '取消订单'),
                                h('Button',{
                                    props:{
                                        size: 'small',
                                        type: 'primary'
                                    },
                                    on: {
                                        click: ()=> {
                                            this.orderInfo = params.row;
                                            this.surePay();
                                        }
                                    }
                                }, '去支付')
                            ])
                        }
                    },
                },
            ],
            resData: [],
            timer: '',
            payType: '1',                //支付方式  默认微信支付
        }
    },
    created() {
        this.getPayConfig();
        this.getOrderList();
    },
    methods: {
        //获取支付配置
        getPayConfig(){
            initPayData().then(res =>{
                if(res.code == 0){
                    this.payConfig = res.data;
                    if(res.data.limit.length > 0){
                        this.params.limit = res.data.limit[0].key;
                    }
                    this.actualTotalPrice();
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //提交订单
        submitOrderBtn(){
            this.confirmOrder = true;
            submitOrder(this.params).then(res => {
                if(res.code == 0){
                    this.orderInfo = res.data;
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //确认并支付
        surePay(){
            this.rechargeModal = true;
            this.confirmOrder = false;
            window.open(`${url}api/payment/buy/submit.htm?Access-Token=${this.$store.state.app.access_token}&order_sn=${this.orderInfo.order_sn}`);
        },

        //支付完成
        rechargeSure(){
            this.rechargeModal = false;
            this.getOrderList();
            location.reload();
        },

        //在线坐席限制
        changeCount(){
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                var num = this.params.agent_num;
                if(num < 1 || num > 10000 || isNaN(num) || num % 1 !== 0){
                    this.$Notice.destroy();
                    this.$Notice.warning({title: '坐席数必须是大于0且小于10000的整数'});
                    this.$nextTick(()=>{
                        this.params.agent_num = '';
                        this.submintDisabled = true;
                        this.totalPrice = 0;
                    })
                }else{
                    this.actualTotalPrice();
                    this.submintDisabled = false;
                }
            }, 500);
        },

        //计算商品总价
        actualTotalPrice(){
            imputedPrice(this.params).then(res => {
                if(res.code == 0){
                    this.totalPrice = res.data.price;
                    this.deadline = res.data.deadline;
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //选择购买周期
        changeLimit(e){
            this.actualTotalPrice();
        },

        //重新购买 
        //再次提交订单时 多传订单编号
        resetPay(){
            this.confirmOrder = false;
            this.params.order_sn = this.orderInfo.order_sn;
        },

        //订单列表
        getOrderList(){
            orderList({page: this.page}).then(res => {
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.totalCount = Number(res.data.totalCount);
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //下一页
        changeSize(page){
            this.page = page;
            this.getOrderList();
        },

        //取消订单
        cancelOrder(id){
            cancelOrder({order_sn: id}).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                    this.getOrderList();
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        }
    },
}
</script>
<style lang="less" scoped>
    .payWrap{
        padding:10px;
        .link{
            margin-top:10px;
            width: 500px;
            display: inline-block;
            padding: 10px 15px;
            resize: none;
            background-color: #edf5fc;
            border: 0;
            border-radius: 5px;
            color: #555;
            font-family: Menlo,Monaco,Consolas,Courier New,monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        h4{
            font-size:15px;
            line-height: 40px;
        }
        .content{
            p.remark{
                line-height: 26px;
                color:#ff4e00;
                display: inline-block;
                margin-left:10px;
            }
            .highlight{
                color:#ff4e00;
                margin-right:5px;
                font-weight: bold;
            }
        }
        .pay_log{
            margin-top:20px;
        }
    }
</style>


