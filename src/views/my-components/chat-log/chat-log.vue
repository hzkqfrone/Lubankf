<template>
    <div>
        <Drawer width="878" v-model="showDrawer" class="showDrawer historyDrawer">
            <div class="userChatLog">
                <Spin fix v-if="showSpin"></Spin>
                <div class="chatLogTop">
                    <img v-if="chatUserInfo.source!=1 && chatUserInfo.headImg" :src="chatUserInfo.headImg">
                    <img v-else src="../../../images/program.png">
                    <h3>{{chatUserInfo.nickname || chatUserInfo.username}}  <span v-if="chatUserInfo.AppNickName"> ({{chatUserInfo.AppNickName}})</span></h3>
                    <Button type="primary" size="small" @click="startTaskBtn" v-if="chatUserInfo.history && is_start_task">发起会话</Button>
                    <Button type="primary" size="small" @click="createTicketBtn" v-if="chatUserInfo.history">创建工单</Button>
                </div>
                <Scroll :on-reach-top="handleReachTop" :distance-to-edge="[5,5]" :height="srcollHeight" id="chatScroll">
                    <div class="msgContent">
                        <ul>
                            <li class="chatList clearfix" v-for="(item,index) in chatData" :key="index">
                                <div class="tsInfo" v-if="item.msgType=='systemEvaluation'">
                                    <p class="info">收到用户评价  {{item.Content.content}}</p>
                                </div>
                                <div :class="item.fromUser==0?'left':'right'" v-else-if="item.msgType!='system'">
                                    <div class="chatContent">
                                        <div class="message">
                                            <div class="title">
                                                <span>{{item.CreateTime || item.time}}</span>
                                            </div>
                                            <div class="msgText">
                                                <a href="javascript:;" v-if="item.is_send==1" class="error"></a>
                                                <i v-if="item.sedLoading" class="sendLoading"></i>
                                                <img class='imageMsg' v-if="item.msgType=='image'" :src='item.Content' @click="msgImg=item.Content,lookBigImg=true"/>
                                                <div class="voice" v-else-if="item.msgType=='voice'">
                                                    <div class="voiceWrap" @click="playVoice(index)">
                                                        <img :src="item.voiceImg">
                                                        <span v-if="item.Content.duration">{{item.Content.duration}}”</span>
                                                    </div>
                                                    <p>{{item.Content.text}}</p>
                                                </div>
                                                <div class="video" v-else-if="item.msgType=='video'" @click="showVideoMsg(index)">
                                                    <img :src="item.Content.Thumb">
                                                    <span>{{videoTime(item.Content.duration)}}</span>
                                                    <i class="iconfont">&#xe608;</i>
                                                </div>
                                                <div v-else-if="item.msgType=='robot'" class="robotMsg">
                                                    <div v-if="typeof(item.Content)=='object'">
                                                        <p v-html="item.Content.message"></p>
                                                        <div class="otherQuestions" v-if="item.Content.questions.length>0">
                                                            <p>{{item.Content.text}}</p>
                                                            <ul>
                                                                <li v-for="(qs, qindex) in item.Content.questions"><a href="javascript:;">{{qs}}</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div v-else v-html="item.Content"></div>
                                                </div>
                                                <div v-else class="msg" v-html="item.Content"></div>
                                            </div></br>
                                            <!-- is_send==1  发送失败的消息 -->
                                            <div v-if="item.is_send==1" class="errorInfo">{{item.reason}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tsInfo" v-if="item.msgType=='system'">
                                    <p class="info">{{item.Content}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </Scroll>
            </div>
            <div class="userTag">
                <user-tag :chatUserInfo="chatUserInfo"></user-tag>
            </div>
        </Drawer>
        <!-- 查看大图 -->
        <Modal v-model="lookBigImg" class="imgModal" :footer-hide="true">
            <img :src="msgImg">
        </Modal>

        <!-- 查看视频 -->
        <Modal v-model="lookVideo" class="imgModal" :footer-hide="true" @on-visible-change="hideVideo">
            <video :poster="video.Thumb" :src="video.url" controls></video>
        </Modal>

        <!-- 创建工单 -->
        <create-tickets :token="chatUserInfo.taskToken" ref="createTicketRef"></create-tickets>
        
    </div>
</template>
<script>
import {smohanFace} from '@/views/my-components/emoji/emoji';
import {chatLog, startTask} from '@/libs/api.js';
import userTag from '@/views/my-components/user-tag/usertag';
import createTickets from '@/views/chat/components/createTickets';
export default {
    props:['chatUserInfo'],
    data(){
        return {
            showDrawer:false,
            showSpin:true,
            chatLoding:true,
            chatLogParams:{ page:1 },
            chatData:[],
            voiceImg: require('../../../images/voice.png'), //语音消息
            emojiJson:[],            //表情对应json
            lookBigImg:false,
            lookVideo:false,
            video:{},
            msgImg:'',
            srcollHeight:500, //聊天框高度
            totalCount:0,
            chatMore:false,
            is_start_task:0,
        }
    },
    created() {
        this.emojiJson = smohanFace;
    },
    mounted() {
        var that = this;
        that.srcollHeight = document.documentElement.clientHeight - 50;
        window.onresize = () => {
            that.srcollHeight = document.documentElement.clientHeight - 50;
        }
    },
    methods:{
        //会话记录
        getChatLog(){
            this.$nextTick(() => {
                this.chatLogParams.taskToken = this.chatUserInfo.taskToken;
                if(this.chatLogParams.page == 1 && !this.chatMore) this.chatData = [];
                this.showSpin = true;
                chatLog(this.chatLogParams).then(res => {
                    if(res.code == 0){
                        var that = this;
                        this.showSpin = false;
                        this.totalCount = res.data.totalPage;
                        if(res.data.list.length < 1){
                            this.chatLoding = false;
                        }
                        this.is_start_task = res.data.is_start_task;
                        res.data.list.forEach(function(e,index){
                            if(e.msgType == "voice" || e.msgType == "video" || e.msgType == "systemEvaluation"){   //语音消息
                                e.voiceImg = that.voiceImg;
                                e.Content = JSON.parse(e.Content);
                            }else if(e.msgType == "robot"){
                                try {
                                    e.Content = JSON.parse(e.Content);
                                } catch(e) {
    
                                }
                            }else{
                                that.replaceCode(e,index);
                            }
                            that.chatData.unshift(e);
                        })
                        this.$nextTick(function(){
                            var h = document.querySelector('.ivu-scroll-container');
                            h.scrollTop = h.scrollHeight - this.reaceTop;
                        })
                    }else{
                        this.$Notice.warning({title:res.msg});
                    }
                })
            })
        },


        //下一页
        handleReachTop () {
            this.chatLogParams.page += 1;
            if((this.totalCount &&  this.chatLogParams.page > this.totalCount) || this.chatMore){
                this.chatLogParams.more = 1;
                if(!this.chatMore){
                    this.chatLogParams.page = 1;
                } 
                this.chatMore = true;
            }
            if(this.chatLoding){
                this.reaceTop = document.querySelector('.ivu-scroll-container').scrollHeight;
                this.getChatLog();
            }else{
                this.$Notice.warning({title:'已加载全部'});
            }
        },

        //表情 转换成图片
        replaceCode(n,index){
            //  system  为系统消息
            if(n.msgType != "system" && n.msgType != "voice" && n.Content ){
                for(let m = 0; m < 70; m++){
                    var e = this.emojiJson[m];
                    n.Content = n.Content.replace(e.sym,`<img src=${this.loadImg(m)}>`);
                    n.Content = n.Content.replace(e.en,`<img src="${this.loadImg(m)}">`);
                    n.Content = n.Content.replace(e.cn,`<img src="${this.loadImg(m)}">`);
                    if(n.Content.indexOf(e.sym)>-1 || n.Content.indexOf(e.en)>-1 || n.Content.indexOf(e.cn)>-1){
                        this.replaceCode(n);
                        return;
                    }
                }
            }
        },
        //emoji表情
        loadImg(index){
            return require(`../../../images/face/${index}.png`)
        },

        //发起会话
        startTaskBtn(){
            startTask({taskToken: this.chatUserInfo.taskToken}).then(res => {
                if(res.code == 0){
                    this.showDrawer = false;
                    this.$router.push({
                        path:`/chat?type=startTask`,
                    })
                }else{
                    this.$Notice.warning({title: res.msg});
                }
            })
        },

        //视频消息时间
        videoTime(date){
            var s = date%60;
            if(s < 10){
                s = "0" + s;
            }
            return Math.floor(date/60) + ':' + s;
        },

        //查看视频消息
        showVideoMsg(index){
            this.lookVideo = true;
            this.video = this.chatData[index].Content;
        },

        //关闭视频
        hideVideo(status){
            if(!status){
                var videos = document.getElementsByTagName('video')[0];
                videos.pause();
                this.video = {};
            }
        },

        //playVoice 播放语音消息
        playVoice(index){
            clearTimeout(timer);
            if(this.audio){
                this.audio.pause()
            }
            this.chatData.forEach((v,index) => {
                if(v.voiceImg){
                    v.voiceImg = require('../../../images/voice.png');
                }
            });
            var v = this.chatData[index];
            v.voiceImg = require('../../../images/voice_play.gif');
            this.$set(this.chatData,index,v);
            this.audio = new Audio(this.chatData[index].Content.url);
            this.audio.play();
            var timer = setTimeout(() => {
                this.chatData[index].voiceImg = require('../../../images/voice.png');
            }, this.chatData[index].Content.duration * 1000);
        },

        //加载会话记录
        loadChatLog(status){
            if(status){
                this.showDrawer = true;
                this.chatMore = false;
                this.chatLoding = true;
                delete this.chatLogParams.more; 
                this.chatLogParams.page = 1
                this.getChatLog()
            }else{
                this.showDrawer = false;
                this.chatData = [];
            }
        },

        //创建工单
        createTicketBtn(){
            this.$refs.createTicketRef.createTickets();
        },

    },
    components:{
        userTag,
        createTickets
    }
}
</script>
<style lang="less">
    .showDrawer{
        .ivu-drawer-close{
            margin-top:-10px;
        }
        .userChatLog{
            width:592px;
            float:left;
            position: relative;
        }
        .userTag{
            float:right;
            height:100%;
        }
        .ivu-drawer-wrap{
            z-index: 99999;
            width:640px;
            left:inherit;
            .ivu-drawer-body{
                padding:0 16px 16px;
            }
        }
        .chatLogTop{
            line-height: 32px;
            border-bottom:1px solid #e5e5e5;
            padding-bottom:13px;
            position: fixed;
            background:#fff;
            width: 592px;
            z-index:99;
            padding-top:13px;
            img{
                width:32px;
                height:32px;
                display: inline-block;
                float: left;
            }
            h2{
                font-size:14px;
                i{
                    float: right;
                    line-height:32px;
                    font-size:18px;
                }
            }
            h3{
                display: inline-block;
                margin-left:10px;
                font-weight:400;
                max-width:200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                float: left;
            }
            button{
                margin-left:10px;
            }
        }
        .ivu-scroll-wrapper{
            margin-top:55px;
        }
        .msgContent{
            width:100%;
            ul{
                margin:0 10px;
                li{
                    margin-top:10px;
                    width:100%;
                    display: inline-block;
                    & .right{
                        float: right;
                        width:90%;
                        .chatContent{
                            float:right;
                            .title{
                                text-align: right;
                                margin-left:5px;
                            }
                            .msgText{
                                float: right;
                                background:#f0f1f3;
                                .error,.sendLoading{
                                    position: absolute;
                                    top:50%;
                                    left:-22px;
                                    margin-top:-8px;
                                    width:16px;
                                    height:16px;
                                    display: inline-block;
                                    background:url(../../../images/error.png) no-repeat center;
                                    cursor: pointer;
                                }
                                .sendLoading{
                                    background:url(../../../images/loading_status.gif) no-repeat center;
                                }
                            }
                        }
                    }
                    & .left{
                        width:90%;
                        display: inline-block;
                        .msgText{
                            float: left;
                            background:#e7f4ff;
                            //语音
                            .voice .voiceWrap{
                                cursor: pointer;
                                img{
                                    width:15px;
                                    height:15px;
                                    vertical-align: middle;
                                    margin-top:-3px;
                                }
                                span{
                                    float:right;
                                }
                            }
                            //视频
                            .video{
                                width:150px;
                                height:auto;
                                text-align: center;
                                position: relative;
                                cursor: pointer;
                                i{
                                    position: absolute;
                                    font-size: 50px;
                                    line-height: 50px;
                                    color:#fff;
                                    top:50%;
                                    left:50%;
                                    margin-top:-25px;
                                    margin-left:-25px;
                                }
                                span{
                                    position: absolute;
                                    bottom:5px;
                                    right:5px;
                                    color:#fff;
                                }
                                img{
                                    min-height: 50px;
                                }
                            }
                        }
                    }
                    .message{
                        float:left;
                        .title{
                            font-size:12px;
                            color:#b2b2b2;
                        }
                        .errorInfo{
                            font-size:12px;
                            color:#f43e0b;
                            display: inline-block;
                        }
                        .msgText{
                            // overflow: hidden;
                            text-overflow: hidden;
                            padding:5px 10px;
                            line-height: 24px;
                            border-radius:3px;
                            position: relative;
                            em{
                                width:24px;
                                height:24px;
                                display: inline-block;
                                background:url(../../../images/face/emoji.png);
                                background-position-x:0px;
                                vertical-align: bottom;
                            }
                            .msg>img{
                                width:24px;
                                height:24px;
                                margin:0;
                                float:none;
                                vertical-align: middle;
                            }
                            img.imageMsg{
                                width:100%;
                                max-width: 100px;
                                height:auto;
                                cursor: pointer;
                            }
                            .emoji{
                                display: inline-block;
                                width:22px;
                                height:22px;
                                background:url(../../../images/face/emoji.png);
                                background-position: -2px 0px;
                            }
                            .robotMsg{
                                .otherQuestions{
                                    padding-top:10px;
                                    ul{
                                        margin:0;
                                    }
                                    i{
                                        font-style: normal;
                                        padding-right:5px;
                                    }
                                    p.qsTips{
                                        color:#999;
                                        font-size:13px;
                                    }
                                }
                                img{
                                    width:100%;
                                    max-width: 100px;
                                }
                            }
                        }
                    }
                    & .tsInfo{
                        text-align: center;
                        color:#b2b2b2;
                        p.info{
                            display:inline-block;
                            background: #f5f5f5;
                            padding:0 5px;
                            border-radius:5px;
                        }
                        p.dashed{
                            width:100%;
                            border-top:1px dashed #e7e7e7;
                            margin-top:-10px;
                        }
                    }
                }
            }
        }
        .ivu-drawer-body,.ivu-scroll-container{
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 3px;    
                height: 1px;
            }
            &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                background: #e0e0e0;
            }
        }
        .ivu-drawer-body{
            overflow: hidden;
        }
    } 
    .historyDrawer .ivu-drawer-wrap .ivu-drawer-body{
        padding:0 0 0 16px;
    }
    .imgModal{
            width: 100%;
            max-width:800px;
            height:auto;
            img,video{
                width:100%;
            }
            .ivu-modal-wrap{
                z-index: 99999 !important;
            }
        }
</style>
