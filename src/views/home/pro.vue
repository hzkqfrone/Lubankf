<template>
    <div class="proWrap">
        <Card class="waitaccessWrap">
            <p slot="title">
                好友推荐
            </p>
            <div class="content">
                <div class="info">
                    <h4>温馨提示</h4>
                    <Alert type="warning">
                        <p>将专属您的邀请链接发送给好友,好友通过该链接完成注册,且状态为购买成功后,您将获得推荐奖励。</p>
                        <p><span style="color:red">*</span>注：推荐并购买成功后，我们的工作人员将会主动联系您支付佣金</p>
                    </Alert>
                    <h4>邀请奖励</h4>
                    <p>每邀请成功一位好友,邀请者获得推荐奖励</p>
                    <p>快点击邀请链接@越多好友,奖励越大哦!</p>
                </div>
            </div>
        </Card>
        <Card class="linkWrap">
            <h4>邀请链接</h4>
            <div class="link">{{url}}</div>
            <Button class="copylink" type="info" @click="clipboard" :data-clipboard-text="url"> 复 制 </Button>
            <div class="obtained">
                <p>
                    已获得推荐奖励: <span class="obtainedMoney">{{obtainedMoney}}</span>元
                    <a href="javascript:;" class="detail" @click="lookDetail">详情</a>
                </p>
            </div>
        </Card>
        <Card class="linkWrap awardLog">
            <h4>邀请列表</h4>
            <Table stripe :columns="columns":data="resData"></Table>
        </Card>

        <!-- 奖励明细 -->
        <Modal
            v-model="obtainedModal"
            title="奖励明细"
            @on-click="obtainedModal=false"
            width="1000">
            <Table stripe :columns="detailColumns" :loading="detailLoading" :data="DetailData"></Table>
        </Modal>

    </div>
</template>
<script>
import { getPro, recommendList, obtainedDetailList } from '@/libs/api';
import Clipboard from 'clipboard';   //拷贝
export default {
    data(){
        return{
            url: '',
            obtainedMoney: 0,
            obtainedModal: false,
            detailLoading: false,
            columns: [
                {
                    title: '用户名',
                    key: 'r_username'
                },
                {
                    title: '手机号',
                    key: 'r_username'
                },
                {
                    title: '来源',
                    key: 'r_username'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '邀请时间',
                    key: 'created_at'
                },
            ],
            resData: [],               //邀请明细
            detailColumns: [
                {
                    title: '邮箱号',
                    key: 'i_email',
                },
                {
                    title: '金额',
                    key: 'money',
                },
                {
                    title: '客户消费时间',
                    key: 'created_at',
                },
                {
                    title: '奖励时间',
                    key: 'payed_at',
                },
                {
                    title: '状态',
                    key: 'status',
                },
                {
                    title: '备注',
                    key: 'remarks',
                    minWidth: 120,
                }
            ],
            DetailData:[],             //奖励明细
        }
    },
    created() {
        this.url = `https://www.lubankf.com/admin/#/register?id=${this.$store.state.app.serviceInfo.invite_code}`;
        this.getRecommendList();
    },
    methods: {
        //复制
        clipboard(){
            var clipboard = new Clipboard('.copylink')
            clipboard.on('success', e => {
                this.$Message.success('复制成功');
                // 释放内存
                clipboard.destroy()
            })
        },

        //查看奖励明细
        lookDetail(){
            this.detailLoading = true;
            this.obtainedModal = true;
            obtainedDetailList().then(res => {
                this.detailLoading = false;
                if(res.code == 0){
                    this.DetailData = res.data.list;
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //加载邀请列表
        getRecommendList(){
            recommendList().then(res => {
                if(res.code == 0){
                    this.resData = res.data.list;
                    this.obtainedMoney = res.data.money;
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },
        
    },
}
</script>
<style lang="less" scoped>
    .proWrap{
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
            p{
                line-height: 26px;
                text-indent: 20px;
            }
        }
        .linkWrap{
            margin-top:20px;
            .obtained{
                line-height: 50px;
                .obtainedMoney{
                    font-size:16px;
                    color:orange;
                    font-weight: bold;
                }
            }
            .detail{
                margin-left:10px;
            }
        }
    }
</style>


