<template>
    <div class="settingWrap">
        <div class="setting">
            <Card>
                <div class="configTitle">
                    <router-link to="/config/wechat">
                        <Icon type="md-arrow-round-back" />
                        <h2>自动回复</h2>
                    </router-link>
                </div>
            <!-- <h3 class="wechatTitle">{{infoData.nickname}}</h3> -->
                <Form :label-width="100" style="margin-top:10px">
                    <FormItem label="欢迎语">
                        <div style="margin-bottom:10px;">
                            <Button type="primary" ghost size="small" icon="md-add" @click="pushNickname">访客名称:nickName</Button>
                            <span class="markedWords">点击“+”即可将占位符填充到您输入内容的后方。</span>
                        </div>
                        <Input type="textarea" :rows="3" style="width:400px;" v-model="infoData.first_focused_info"></Input>
                    </FormItem>
                    <FormItem label="客户排队提示语">
                        <Input type="textarea" :rows="3" style="width:400px;" placeholder="客服忙碌中,请您耐心等待" v-model="infoData.waiting_info"></Input>
                    </FormItem>
                </Form>
                <div class="infoBtn">
                    <Button type="primary" @click="infoSave">保存</Button>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import { wechatInfo, wechatInfoEdit } from '@/libs/api';
export default {
    data(){
        return{
            infoData:'',   //公众号信息
        }
    },
    mounted() {
        this.getWechatInfo();  // 获取公众号信息
    },
    methods:{
        // 获取公众号信息
        getWechatInfo(){
            wechatInfo({appToken:this.$route.params.token}).then(res => {
                if(res.code == 0){
                    this.infoData = res.data;
                }else{
                    this.$Notice.error({title:res.msg});
                }
            })
        },

        //添加访客名称
        pushNickname(){
            this.infoData.first_focused_info = this.infoData.first_focused_info + "{nickName}";
        },

        //基本信息保存
        infoSave(){
            wechatInfoEdit(this.infoData).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title:res.msg});
                }else{
                   this.$Notice.error({title:res.msg}); 
                }
            })
        }
    }

}
</script>
<style lang="less">
    @import '../css/customMenu.less';
    .demo-upload-list{
        display: block;
    }
</style>