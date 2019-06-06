<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>客服评价</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="eavluation">
            <div class="invite">
                <Form label-position="top">
                    <FormItem label="会话结束自动发送满意度评价邀请">
                        <i-switch size="large" :value="params.showEavluation" @on-change="changeSwitch" true-value="1" false-value="0">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="满意度邀请提示语">
                        <Input v-model="params.title" @on-blur="changeContent"></Input>
                    </FormItem>
                    <FormItem label="服务评价示例预览">
                        <div class="preview">
                            <div class="title">{{params.title}}</div>
                            <ul class="iconWrap">
                                <li>
                                    <svg class="icon" aria-hidden="true"><use xlink:href="#icon-haoping"></use></svg>
                                    <span>好评</span>
                                </li>
                                <li>
                                    <svg class="icon" aria-hidden="true"><use xlink:href="#icon-haoping1"></use></svg>
                                    <span>中评</span>
                                </li>
                                <li>
                                    <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chaping"></use></svg>
                                    <span>差评</span>
                                </li>
                            </ul>
                            <Input type="textarea" placeholder="请填写评价内容（选填）" :rows="2"></Input>
                            <Button type="primary" long>提交</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import '../../../../static/font/iconfont.js'; 
import {evaluationList, editEvaluation} from '@/libs/api';
export default {
    data(){
        return {
            params:{
                title:'请对我的服务做出评价',
                showEavluation:true,
            }
        }
    },
    mounted() {
        this.init();
    },
    methods:{    
        init(){
            evaluationList({type: 'evaluation'}).then(res => {
                if(res.code == 0){
                    if(res.data) this.params = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        changeSwitch(status){
            this.params.showEavluation = status;
            this.updatedEvaluation();
        },

        changeContent(){
            this.updatedEvaluation();
        },

        updatedEvaluation(){
            var data = {
                type: 'evaluation',
                data: this.params
            }
            editEvaluation(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }
        
    }
}
</script>


<style lang="less" scoped>
    .accreditWrap{
        background:#fff;
        padding:20px;
    }
    .eavluation{
        margin:20px;
        .invite{
            width:400px;
        }
        .preview{
            margin-top:20px;
            padding:20px;
            width:300px;
            box-shadow: 0 0 14px 1px rgba(0, 0, 0, 0.35);
            .title{
                text-align: center;
                white-space:wrap;
            }
            .iconWrap{
                display: flex;
                justify-content: space-around;
                li{
                    text-align: center;
                }
                .icon{
                    width:40px;
                    height:40px;
                    display: block;
                }
            }
            button{
                margin-top:10px;
            }
        }
    }
</style>
