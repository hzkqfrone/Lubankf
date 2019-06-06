<template>
    <div class="accreditWrap">
        <div class="titleTop">
            <div class="configTitle">
                <router-link to="/config">
                    <Icon type="md-arrow-round-back" />
                    <h2>会话邀请</h2>
                </router-link>
            </div>
        </div>
        <div class="configTop websiteWrap clearfix">
            <div class="websiteLeft">
                <div class="websiteLeftWrap elementScroll">
                    <div class="websitStyle">
                        <!-- <p>客服人员可以在 实时访客  中，手动向顾客发出对话邀请</p> -->
                        <Form :label-width="160" label-position="left">
                            <FormItem label="是否启用会话邀请">
                                <i-switch size="large" v-model="inviteBoxData.showInviteBox" true-value="1" false-value="0">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </FormItem>
                            <Divider orientation="left">邀请框设置</Divider>
                            <FormItem label="邀请语">
                                <Input v-model="inviteBoxData.inviteWords"></Input>
                            </FormItem>
                            <FormItem label="水平方向">
                                <Select v-model="inviteBoxData.positionX" @on-change="chatboxLocationAndSize" class="chatBoxSize">
                                    <Option value="right">向右对齐</Option>
                                    <Option value="center">居中对齐</Option>
                                    <Option value="left">向左对齐</Option>
                                </Select>
                                <ButtonGroup>
                                    <InputNumber :max="200" :min="0" v-model="inviteBoxData.distanceX" @on-change="chatboxLocationAndSize" class="chatBoxSize chatBoxPx"></InputNumber>
                                    <Button class="fontSize">像素</Button>
                                </ButtonGroup>
                            </FormItem>
                            <FormItem label="垂直方向">
                                <Select v-model="inviteBoxData.positionY" @on-change="chatboxLocationAndSize" class="chatBoxSize">
                                    <Option value="top">向上对齐</Option>
                                    <Option value="center">居中对齐</Option>
                                    <Option value="bottom">向下对齐</Option>
                                </Select>
                                <ButtonGroup>
                                    <InputNumber :max="200" :min="0" v-model="inviteBoxData.distanceY" @on-change="chatboxLocationAndSize" class="chatBoxSize chatBoxPx"></InputNumber>
                                    <Button class="fontSize">像素</Button>
                                </ButtonGroup>
                            </FormItem>
                            <FormItem label="邀请框皮肤" class="chatBoxColor">
                                <div>
                                    <span v-for="(item,index) in chatskin" @click="selcetSkin(index)" :style="{background: item}"><Icon type="md-checkmark" v-if="inviteBoxData.backColor == item" /></span>
                                </div>
                                <ColorPicker v-model="chatskin[0]" @on-change="selcetColorPicker"/>
                            </FormItem>
                            <FormItem label="当用户拒绝邀请后">
                                <RadioGroup v-model="inviteBoxData.invitationStatus" vertical>
                                    <Radio label="0">
                                        <span>本次访问不允许再手动邀请</span>
                                    </Radio>
                                    <Radio label="1">
                                        <span>间隔 <InputNumber :max="20" :min="0" class="jiange" v-model="inviteBoxData.countdown"></InputNumber>秒后可再次手动邀请</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                
                <!-- 保存设置 -->
                <div class="saveSetting">
                    <Button @click="cancelSetting">取消</Button>
                    <Button type="success" @click="saveSetting" :loading="saveLoading">保存设置</Button>
                </div>
            </div>
            <div class="websiteRight">
                <div class="previewWrap invitePreview">
                    <Divider orientation="left">预览效果</Divider>
                </div>
                <div class="inviteBox">
                    <div class="inviteWrap" :style="chatLocation">
                        <div class="inviteWrapIcon iconfont">&#xe631;</div>
                        <div class="inviteRight">
                            <div class="title">{{inviteBoxData.inviteWords}}</div>
                            <div class="btnBox">
                                <a href="javascript:;">立即咨询</a>
                                <a href="javascript:;">以后再说</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {evaluationList, editEvaluation} from '@/libs/api';
export default {
    data(){
        return {
            chatskin: ['rgb(87, 163, 243)','rgb(25, 202, 166)','rgb(181, 14, 3)','rgb(244, 147, 0)','rgb(158, 193, 0)','rgb(0, 204, 205)','rgb(91, 121, 154)','rgb(135, 31, 120)'], //对话框皮肤
            saveLoading:false,
            chatLocation:{},  //对话框位置
            inviteBoxData:{
                showInviteBox: '0',                             //是否启用会话邀请
                inviteWords:'欢迎咨询，请问有什么可以帮您的吗？', //邀请语
                positionX:'right',                             //水平方向
                distanceX:10,                                  //水平方向像素
                positionY:'bottom',                            //垂直方向
                distanceY:10,                                  //垂直方向像素
                backColor:'rgb(87, 163, 243)',                 //邀请框皮肤
                invitationStatus: '0',                          //是否可手动邀请
                countdown:2,                                  //间隔几秒后可再次邀请
            },    
            params:{}
        }
    },
    mounted() {
        this.init();
    },
    methods:{    
        init(){
            evaluationList({type: 'inviteBoxData'}).then(res => {
                if(res.code == 0){
                    if(res.data){
                        this.params = res.data;
                        if(res.data){
                            this.inviteBoxData = res.data;
                            this.inviteBoxData.distanceX = Number(this.inviteBoxData.distanceX);
                            this.inviteBoxData.distanceY = Number(this.inviteBoxData.distanceY);
                            this.inviteBoxData.countdown = Number(this.inviteBoxData.countdown);
                        } 
                    } 
                    this.$nextTick(() => {
                        this.chatboxLocationAndSize();
                    })
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //选择皮肤
        selcetSkin(index){
            this.inviteBoxData.backColor = this.chatskin[index];
            this.chatLocation.background = this.inviteBoxData.backColor;
        },
        
        selcetColorPicker(color){
            this.inviteBoxData.backColor = color;
            this.chatLocation.background = this.inviteBoxData.backColor;
        },

        //监听邀请框位置
        chatboxLocationAndSize(){
            this.chatLocation = {};
            var positionX = this.inviteBoxData.positionX;     //水平方向
            var distanceX = this.inviteBoxData.distanceX; //水平方向像素
            var positionY = this.inviteBoxData.positionY;            //垂直方向
            var distanceY = this.inviteBoxData.distanceY;                //垂直方向像素 
            switch (positionX) {
                case 'right':
                    this.chatLocation.right = distanceX + 'px';    
                    break;
                case 'center':
                    this.chatLocation.left = "50%";
                    this.chatLocation.transform = "translateX(-50%)";   
                    break;
                case 'left':
                    this.chatLocation.left = distanceX + 'px';    
                    break;
                default:
                    break;
            }
            if(positionY == "top"){
                this.chatLocation.top = distanceY + 'px';  
                this.chatLocation.bottom = 'auto';  
            }else if(positionY == "center"){
                this.chatLocation.bottom = "50%";    
                this.chatLocation.transform = "translateY(50%)" 
            }else if(positionY == "bottom"){
                this.chatLocation.bottom = distanceY + 'px';    
                this.chatLocation.top = 'auto';  
            }
            if(positionY == "center" && location == 'center'){
                this.chatLocation.transform = "translate(-50%,50%)" 
            }
            this.chatLocation.background = this.inviteBoxData.backColor;
        },

        //取消设置
        cancelSetting(){
            this.$router.push({
                path: '/config'
            })
        },

        //保存设置
        saveSetting(){
            var data = {
                type: 'inviteBoxData',
                data: this.inviteBoxData
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
    @import '../../../../static/font/iconfont.css';
    @import '../../accredit/pc/pcStyle.less';
    .jiange{
        width:60px;
        margin:0 5px;
    }
    .inviteBox{
        position: relative;
        height:80%;
        border:1px solid #e7e7e7;
        margin:0 10px;
    }
    .inviteWrap{
        background:rgb(87, 163, 243);
        position: absolute;
        bottom:10px;
        right:10px;
        width:320px;
        box-shadow: 0 0 14px 0 rgba(0,0,0,.16);
        color: #fff;
        border-radius: 3px;
        .inviteWrapIcon{
            width:69px;
            font-size:45px;
            text-align: center;
            float:left;
            padding-top:25px;
        }
        .inviteRight{
            width:250px;
            float: left;
            border-left: 1px solid #e7e7e7;
            .title{
                max-height: 75px;
                overflow: hidden;
                line-height:24px;
                padding:20px 10px;
            }
            .btnBox{
                text-align: center;
                padding-bottom:10px;
                a{
                    display: inline-block;
                    width:68px;
                    height:30px;
                    border:1px solid #fff;
                    border-radius: 3px;
                    line-height: 30px;
                    text-align: center;
                    margin:0 10px;
                    color:#fff;
                }
            }
        }
    }
</style>
