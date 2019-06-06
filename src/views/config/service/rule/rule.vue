<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>会话规则</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop"></div>
        <div class="eavluation">
            <h3>自动结束会话</h3>
            <div class="rule">
                <Form label-position="top">
                    <FormItem label="当对话在一段时间内没有新消息产生后，系统将自动将其结束。">
                        <i-switch size="large" :value="params.is_auto_close" @on-change="changeSwitch" :true-value="1" :false-value="0">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="">
                        <InputNumber :min="0" style="width:50px" v-model="params.close_times" @on-blur="changeNum" :max="300"></InputNumber>
                        分钟后无消息自动结束
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script>
import {getTaskRole, setTaskRole} from '@/libs/api';
export default {
    data(){
        return {
            params:{
                is_auto_close:0,
                close_times:5,
            }
        }
    },
    mounted() {
        this.init();
    },
    methods:{    
        init(){
            getTaskRole().then(res => {
                if(res.code == 0){
                    if(res.data) this.params = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        changeSwitch(status){
            // this.params.showEavluation = status;
            // this.updatedRule();
        },

        changeNum(){
            if(this.params.close_times< 5){
                this.$Notice.warning({title: '最少为5分钟'});
                this.$nextTick(()=>{
                    this.params.close_times = 5;
                })
                return;
            }
            this.updatedRule();
        },

        updatedRule(){
            setTaskRole(this.params).then(res => {
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
        .rule{
            width:400px;
            padding-top:20px;
        }
    }
</style>
