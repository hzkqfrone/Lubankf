<template>
    <div id="mainContainer" @keydown.enter.top.prevent="sendMessage('normal')" :class="{'serviceChat': chatUserInfo && chatUserInfo.ts,'customerChat': !chatUserInfo || !chatUserInfo.ts}">
        <div v-if="!chatUserInfo" class="noChatMsg">
             <div class="noChatBg"></div>
            <p>从左侧列表打开对话~</p>
        </div>
        <div v-else @click="showReply=false">
            <Spin size="large" fix v-if="showSpin"></Spin>
            <div class="headInfo">
                <div class="head clearfix">
                    <div class="func" v-if="!chatUserInfo.ts">
                        <a href="javascript:;" @click="stickBtn" class="stick">
                            <span v-if="!chatUserInfo.is_top"><i class="iconfont">&#xe624;</i>会话置顶</span>
                            <span v-else><i class="iconfont">&#xe627;</i>取消置顶</span>
                        </a>
                        <a href="javascript:;" @click="createTicketBtn" class="tickets gutter"><i class="iconfont">&#xe623;</i>创建工单</a>
                        <Poptip placement="bottom" width="300" @on-popper-show="getServiceList" v-model="visible">
                            <a href="javascript:;" class="gutter"><i class="iconfont">&#xe61e;</i>转接</a>
                            <div class="api" slot="content">
                                <Form :label-width="30">
                                    <FormItem label="客服">
                                        <Select v-model="transfer.transfer_id" filterable transfer>
                                            <OptionGroup v-for="(item,index) in kfList" :key="index" :label="item.name + '('+ item.active_num +')'">
                                                <Option v-for="(list, lIndex) in item.list" :value="list.id" :label="list.username" :key="lIndex">
                                                    <span>{{ list.username }}</span>
                                                    <span style="float:right"><Badge :status="sArr[list.active].s" :text="sArr[list.active].label" /></span>
                                                </Option>
                                            </OptionGroup>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="备注">
                                        <Input v-model="transfer.transfer_note" type="textarea" :rows="4" placeholder="备注信息" />
                                    </FormItem>
                                </Form>
                                <div class="btn">
                                    <Button @click="visible=false">取消</Button>
                                    <Button type="primary" @click="transferService">确定</Button>
                                </div>
                            </div>
                        </Poptip>
                        <Poptip
                            confirm
                            title="确定要结束服务吗?"
                            width="156"
                            @on-ok="closeTask">
                            <a class="gutter" href="javascript:;"><i class="iconfont">&#xe620;</i>结束服务</a>
                        </Poptip>
                    </div>
                    <div class="head_left">
                        <div class="headInfo">
                            <img v-if="chatUserInfo.headImg" :src="chatUserInfo.headImg">
                            <svg v-else-if="chatUserInfo.ts" class="icon" aria-hidden="true"><use xlink:href="#icon-morentouxiang"></use></svg>
                            <img v-else src="../../../images/program.png">
                            <h3 v-if="chatUserInfo.task" :title="chatUserInfo.nickname">{{chatUserInfo.nickname}}  <span v-if="chatUserInfo.source==2 && chatUserInfo.task.nickname"> ({{chatUserInfo.task.nickname}})</span></h3>
                            <h3 v-else :title="chatUserInfo.username">{{chatUserInfo.username}}  <span> ({{chatUserInfo.role}})</span></h3>
                        </div>
                    </div>
                </div>
                <div class="userSource clearfix" v-if="!chatUserInfo.ts">
                    <div v-if="chatUserInfo.source==2 || chatUserInfo.source==4">
                        <div class="sourceLeft">
                            <span>{{webUserInfo.os}}</span>
                            <span>{{webUserInfo.browser}}</span>
                            <span>{{webUserInfo.source}}</span>
                        </div>
                        <div class="sourceIp">
                            IP：{{webUserInfo.ip}}
                        </div>
                    </div>
                    <div class="sourceLeft" v-else>
                        <span>{{chatUserInfo.source_name}} - {{chatUserInfo.task.nickname}}</span>
                    </div>
                </div>
                <div class="track" v-if="!chatUserInfo.ts">
                    <div class="isTrack">
                        <div v-if="webUserInfo.fromUrl" @click="callerTrack">
                            <p>正在访问 <a href="javascript:;">{{webUserInfo.fromUrl}}</a></p>
                            <Icon type="ios-arrow-down" />
                        </div>
                        <p v-else class="empty">无访问轨迹~</p>
                    </div>
                    <div class="trackList" v-if="showTrackList">
                        <div class="trackTop clearfix" @click="showTrackList=false">
                            <span>访问轨迹</span>
                            <span class="close">收起 <Icon type="ios-arrow-up" /></span>
                        </div>
                        <Spin size="large" fix v-if="showTrack"></Spin>
                        <ul class="elementScroll historyTrack">
                            <li v-for="(item,index) in trackData" :key="index">
                                <span>{{item.createTime}}</span>
                                <a :href="item.address" target="_blank">{{item.address}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Scroll :on-reach-top="handleReachTop" :distance-to-edge="[5,5]" :height="srcollHeight" id="chatScroll">
                <div class="msgContent">
                    <ul>
                        <li class="chatList clearfix" v-for="(item,index) in chatData" :key="index">
                            <!-- 用户评价 -->
                            <div class="tsInfo" v-if="item.msgType=='systemEvaluation'">
                                <p class="info">收到用户评价  {{item.Content.content}}</p>
                                <div class="evaluationWrap">
                                    <div class="evaluation ev1" v-if="item.Content.evaluation==0"><i class="iconfont">&#xe6a0;</i><span>好评</span></div>
                                    <div class="evaluation ev2" v-if="item.Content.evaluation==1"><i class="iconfont">&#xe6a1;</i><span>中评</span></div>
                                    <div class="evaluation ev3" v-if="item.Content.evaluation==2"><i class="iconfont">&#xe69f;</i><span>差评</span></div>
                                </div>
                            </div>
                            <div :class="item.fromUser==1?'right':'left'" v-else-if="item.msgType!='system'">
                                <div class="chatContent">
                                    <div class="message">
                                        <div class="title">
                                            <span>{{item.CreateTime || item.time}}</span>
                                            <span class="serviceName" v-if="item.fromUser==1">{{item.self || item.agent}}</span>
                                        </div>
                                        <div class="msgText">
                                            <a href="javascript:;" title="点击重新发送" v-if="item.is_send==1" class="error" @click="redistribute(index)"></a>
                                            <i v-if="item.sedLoading" class="sendLoading"></i>
                                            <div v-if="item.msgType=='image'">
                                                <img class='imageMsg' v-if="item.Content.indexOf('luban_img_')>-1" src='../../../images/uploading.gif'/>
                                                <img class='imageMsg' v-else :src='item.Content' @click="msgImg=item.Content,lookBigImg=true"/>
                                            </div>
                                            <div v-else-if="item.msgType=='file'">
                                                <img class='imageMsg' v-if="typeof(item.Content)=='string' && item.Content.indexOf('luban_img_')>-1" src='../../../images/uploading.gif'/>
                                                <a :href="item.Content" v-else-if="item.msgType=='file'" target="_blank">{{item.Content}}</a>
                                            </div>
                                            <div class="voice" v-else-if="item.msgType=='voice'">
                                                <div v-if="typeof(item.Content)=='object'">
                                                    <div class="voiceWrap" @click="playVoice(index)">
                                                        <img :src="voiceImg" v-if="!item.isVoice">
                                                        <img :src="playVoiceImg" v-if="item.isVoice">
                                                        <span v-if="item.Content.duration">{{item.Content.duration}}”</span>
                                                    </div>
                                                    <p v-if="item.Content.text">{{item.Content.text}}</p>
                                                </div>
                                                <div v-else>
                                                    <p>{{item.Content}}</p>
                                                </div>
                                            </div>
                                            <div class="video" v-else-if="item.msgType=='video'" @click="showVideoMsg(index)">
                                                <img :src="item.Content.Thumb" v-if="item.Content.Thumb">
                                                <span v-if="item.Content.duration">{{videoTime(item.Content.duration)}}</span>
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
                                            <div class="position" v-else-if="item.msgType=='position' || item.msgType=='location'">
                                                <span>{{item.Content.text}}</span>
                                                <a :href="item.Content.url" target="_blank">显示地图</a>
                                            </div>
                                            <div v-else class="msg" v-html="item.Content"></div>
                                        </div><div class="clearfix"></div>
                                        <!-- is_send==1  发送失败的消息 -->
                                        <div v-if="item.is_send==1" class="errorInfo">{{item.reason}}</div>
                                    </div>
                                </div>
                            </div>
                            <!-- 系统消息 -->
                            <div class="tsInfo" v-if="item.msgType=='system'">
                                <p class="info">{{item.Content}}</p>
                            </div>
                        </li>

                        <!-- 预知消息 -->
                        <li class="chatList clearfix" v-if="isNotice && noticeContent">
                            <div class="notice left">
                                <div class="chatContent">
                                    <div class="message">
                                        <div class="title">
                                            <span>对方正在输入...</span>
                                        </div>
                                        <div class="msgText">
                                            <div class="msg" v-html="noticeContent"></div>
                                        </div></br>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </Scroll>
            <div class="textareaBox">
                <!-- 客户已等待时间 -->
                <div class="reminderTimeWrap" v-if="userWaitTime && !chatUserInfo.ts">
                    <Tag class="reminderTime" color="warning">访客已等待{{userWaitTime}}</Tag>
                </div>
                <div>
                    <div class="func">
                        <Tooltip content="表情" placement="top" class="funcHint">
                            <a href="javascript:;" class="emoji iconfont" @click="showEmoji">
                                &#xe630;
                                <div class="emojiWrap" v-show="isShowIcon">
                                    <a href="javascript:;" v-for="(item,index) in emojiJson" :title="item.cn" @click="selectIcon(index)"><em :style="{backgroundPositionY:''+index * -24+'px'}"></em></a>
                                </div>
                            </a>
                        </Tooltip>
                        <Tooltip content="图片" placement="top" class="funcHint">
                            <Upload :action="action"
                                ref="upload_img"
                                :format="['jpg','jpeg','png','gif']"
                                :max-size="10240"
                                :show-upload-list="false"
                                :on-format-error="uploadFormatError"
                                :on-success="imageSuccess"
                                :on-error="imageError"
                                :before-upload="beforeUpload"
                                :data="upLoadData"
                                name="image"
                                style="display:inline-block;">
                                <a href="javascript:;" class="image iconfont">&#xe6e6;</a>
                            </Upload>
                        </Tooltip>
                        <Tooltip content="上传文件" placement="top" v-if="(chatUserInfo.source!=1) || chatUserInfo.ts" class="funcHint">
                            <Upload :action="fileAction"
                                ref="upload_file"
                                :show-upload-list="false"
                                :format="AllowExtensions"
                                :max-size="10240"
                                :on-format-error="uploadFormatError"
                                :on-success="fileSuccess"
                                :before-upload="beforeUpload"
                                :data="upLoadFileData"
                                name="file"
                                style="display:inline-block;">
                                <a href="javascript:;" class="file iconfont">&#xe676;</a>
                            </Upload>
                        </Tooltip>
                        <Tooltip content="快捷回复" placement="top" class="funcHint">
                            <a href="javascript:;" class="reply iconfont" @click.stop="showfastReply">&#xe619;</a>
                        </Tooltip>
                        <Tooltip content="评价" placement="top" class="funcHint" v-if="(chatUserInfo.source==2 || chatUserInfo.source==4) && !chatUserInfo.ts">
                            <a href="javascript:;" class="evaluate iconfont" @click="sendEvaluation">&#xe614;</a>
                        </Tooltip>
                        <Poptip placement="top" class="funcHint" width="300" v-model="showRobot" word-wrap v-if="!chatUserInfo.ts" transfer>
                            <a href="javascript:;"><i class="iconfont">&#xe6ae;</i></a>
                            <div class="api robotAssist" slot="content">
                                <div>
                                    <p>机器人推荐回答</p>
                                    <div class="answer elementScroll" v-if="robotAnswerMsg" v-html="robotAnswerMsg"></div>
                                    <div class="answer elementScroll" v-else-if="!robotStatus">未启用辅助回答~</div>
                                    <div class="answer elementScroll" v-else>暂无推荐回答~</div>
                                </div>
                                <div class="btn">
                                    <Button type="success" long  @click="robotAnswer" v-if="robotAnswerMsg && robotStatus">立即回复</Button>
                                </div>
                            </div>
                        </Poptip>
                        <Tooltip content="勾选后,机器人将辅助你回答" placement="top" class="robotAssistCheck" v-if="!chatUserInfo.ts">
                            <Checkbox :true-value="1" :false-value="0" v-model="robotStatus" @on-change="changeRobot">辅助回答</Checkbox>
                        </Tooltip>
                    </div>
                    <div contenteditable="true" class="textarea" id="editText"
                        ref="textarea"
                        v-html="msgContent"
                        @focus="isLocked = true,isShowIcon = false"
                        @blur="isLocked = false"
                        @paste="pasteMsg"
                        @input="changeText"></div> 
                    <Button type="primary" class="sendBtn" @click="sendMessage('normal')">发送</Button>
                </div>
            </div>

            <!-- 查看大图 -->
            <Modal v-model="lookBigImg" class="imgModal" :footer-hide="true" width='800'>
                <img :src="msgImg">
            </Modal>

            <!-- 查看视频 -->
            <Modal v-model="lookVideo" class="videoModal" :footer-hide="true" @on-visible-change="hideVideo">
                <video :poster="video.Thumb" :src="video.url || video" controls></video>
            </Modal>

            <!-- 创建工单 -->
            <create-tickets :token="chatUserInfo.taskToken" ref="createTicketRef"></create-tickets>
        </div>

        <!-- 快捷回复 -->
        <div :class="{replyWrap:true, showReply:showReply}" class="elementScroll">
            <Tabs class="tabs" value="0" @on-click="searchReply">
                <TabPane label="企业回复" name="0">
                    <Input style="width:210px;margin: 0 20px;" search placeholder="搜索快捷回复" v-model="replyContent" @on-enter="searchReply(0)" @on-click="searchReply(0)"></Input>
                    <Collapse simple v-if="enterprise_reply.length>0 && replyListDatas.length==0">
                        <Panel :name="JSON.stringify(index)" v-for="(item,index) in enterprise_reply" :key="index">
                            {{item.name}}
                            <ul slot="content" class="replyGroup" v-if="item.sub_item">
                                <li v-for="(sub,subindex) in item.sub_item" :key="subindex">
                                    <span @click="sendMsgPush(sub.content)" :title="sub.content">{{sub.content}}</span>
                                    <Tooltip content="发送" placement="top">
                                        <Icon type="md-paper-plane" @click="sendReply(sub.content)"/>
                                    </Tooltip>
                                </li>
                            </ul>
                        </Panel>
                    </Collapse>
                    <search-reply-content :data="replyListDatas" @replyItem="sendReply" @selectReply="sendMsgPush"></search-reply-content>
                    <div v-if="enterprise_reply.length==0 && replyListDatas.length == 0" class="emptyReply">
                        暂无快捷回复~
                    </div>
                </TabPane>
                <TabPane label="个人回复" name="1">
                    <Input style="width:210px;margin: 0 20px;" search placeholder="搜索快捷回复" v-model="replyContent" @on-enter="searchReply(1)" @on-click="searchReply(1)"></Input>
                    <Collapse simple v-if="self_reply.length>0">
                        <Panel :name="JSON.stringify(index)" v-for="(item,index) in self_reply" :key="index">
                            {{item.name}}
                            <ul slot="content" class="replyGroup" v-if="item.sub_item">
                                <li v-for="(sub,subindex) in item.sub_item" :key="subindex">
                                    <span @click="sendMsgPush(index,subindex)" :title="sub.content">{{sub.content}}</span>
                                    <Tooltip content="发送" placement="top">
                                        <Icon type="md-paper-plane" @click="sendReply"/>
                                    </Tooltip>
                                </li>
                            </ul>
                        </Panel>
                    </Collapse>
                    <search-reply-content :data="replyListDatas" @replyItem="sendReply" @selectReply="sendMsgPush"></search-reply-content>
                    <div v-if="replyListDatas.length == 0 && self_reply.length == 0" class="emptyReply">
                        暂无快捷回复~
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
import { url, beyondSize, getNowFormatDate } from '@/mixins/mixin';
import { smohanFace } from '@/views/my-components/emoji/emoji';
import searchReplyContent from '@/views/chat/components/searchReply';
import { mapState } from 'vuex';
import { chatLog, getColleaguChatLog, closeTask, getService, transferService, getChatReply, sendTaskMessage,
         colleaguSendMsg, getUserList, evaluation, getTraceList, openRobot, setTop } from '@/libs/api';
import Cookies from 'js-cookie';
import createTickets from '@/views/chat/components/createTickets';
import '../../../static/font/iconfont.css'; 
export default {
    mixins:[url, beyondSize, getNowFormatDate],
    props:["chatUserInfo"],
    data(){
        return{
            srcollHeight:'',   //聊天框高度
            chatData:[],       //消息列表
            isShowIcon:false,  //显示表情框
            showReply:false,   //显示快捷回复s
            isLocked: false,
            innerText: '',
            action:'',         //上传图片接口路径
            fileAction:'',     //上传文件路径
            transverter:'',    //输入框转换过的消息
            emojiJson:[],      //表情对应json
            msgContent:'',
            emojiCode:[], 
            upLoadData:{},      //上传图片参数
            upLoadFileData:{},  //上传文件
            page:1,             //消息分页
            totalCount:0,       //消息总页数
            chatMore:false,     //加载更多消息  more：1
            lookBigImg:false,
            lookVideo:false,
            msgImg:'',
            video:'',
            showSpin:true,
            kfList:[],          //可转接客服列表
            transfer:{},        //转接客服
            access_token: this.$store.state.app.access_token,
            chatLoding:true,
            reaceTop:'',
            userWaitTime:0,     //客户等待时间
            timer:'',
            replyArr:[],        //快捷回复列表
            enterprise_reply:[],//企业回复
            self_reply:[],      //|| 个人回复
            voiceImg: require('../../../images/voice.png'),          //语音消息图
            playVoiceImg: require('../../../images/voice_play.gif'), //播放语音消息gif
            audio:'',
            replyContent:'',    //搜索快捷回复
            replyListDatas:[],
            visible:false,      //转接弹窗
            sArr:[
                {s:'default',label:'离线',value:'0'},
                {s:'success',label:'空闲',value:'1'},
                {s:'error',label:'忙碌',value:'2'},
                {s:'warning',label:'隐身',value:'3'},
                {s:'processing',label:'离开',value:'4'}
            ],
            isNotice:false,       //预知消息
            noticeContent:"",
            noticeOne:true,
            trackData:[],         //访问轨迹
            showTrackList:false,  //是否显示访问轨迹
            showTrack:true,
            showRobot:false,      //显示机器人辅助回答
            robotStatus:0,        //是否开启机器人
            robotAnswerMsg:'',    //机器人辅助消息
            formatSuccess:true,   //上传格式不正确
        }
    },
    computed:{
        comText(){
            var obj={};
            obj=JSON.parse(JSON.stringify(this.innerText));
            this.editEmoji(obj);
        },
        ...mapState({
            chatMsgList: state => state.app.chatMsgList,   //消息列表
            webUserInfo: state => state.app.webUserInfo,   //web用户信息
            AllowExtensions: state => state.app.lubanConfg.AllowExtensions
        }),
        comWaitTime(){
            var obj = {};
            clearInterval(this.timer);
            if(this.chatUserInfo && this.chatUserInfo.task){
                obj=JSON.parse(JSON.stringify(this.chatUserInfo));
                if(obj.task.fromUser==0){
                    this.timer = setInterval(() => {
                        try {
                            if(this.chatUserInfo.task.waitTime) this.userWaitTime =  this.chatUserInfo.task.waitTime
                        } catch (error) {
                            clearInterval(this.timer)
                        }
                        
                    }, 500);   
                }
            }
        }
    },
    methods:{
        //上传之前
        beforeUpload(file){
            var type = file.type.indexOf('image') >-1 ? 'image' : 'file';
            if(file.size / 1024 > 10000){
                this.$Notice.warning({
                    title: '文件或图片大小不能超过10M！'
                });
                return
            }
            setTimeout(() => {
                if(this.formatSuccess){
                    if(this.$refs.upload_img.fileList.length>0) this.$refs.upload_img.fileList[this.$refs.upload_img.fileList.length-1].index = this.chatData.length;
                    if(this.$refs.upload_file.fileList.length>0) this.$refs.upload_file.fileList[this.$refs.upload_file.fileList.length-1].index = this.chatData.length;
                    this.innerText = 'luban_img_';
                    this.pushResDataMessage(type);
                }
                this.formatSuccess = true;
            }, 300);

            this.upLoadData = {
                taskToken: this.chatUserInfo.taskToken || '',
                userToken: this.chatUserInfo.userToken || '',
                'Access-Token':this.access_token
            }  
            this.upLoadFileData = {
                taskToken: this.chatUserInfo.taskToken || '',
                'Access-Token':this.access_token
            }
            let promise = new Promise((resolve) => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
            this.chatWindBottom();
            return promise;
        },
        handleReachTop () {
            this.page += 1;
            if(this.chatLoding){
                this.reaceTop = document.querySelector('.ivu-scroll-container').scrollHeight;
                this.getHistoryChatMsg();
            }else{
                this.$Message.warning('已加载全部');
            }
        },

        //窗口高度
        windowSize(){
            var that = this;
            let fullHeight = document.documentElement.clientHeight - (that.chatUserInfo && that.chatUserInfo.ts ? 280 : 351);
            that.srcollHeight = fullHeight;
            this.$emit('chatUserSize');
        },

        //历史记录
        getHistoryChatMsg(){
            if(!this.chatUserInfo.ts){
                //客户聊天记录
                this.customerChatLog();
            }else {
                //同事聊天记录
                this.colleagueChatLog();
            }
        },

        //客户聊天记录
        customerChatLog(){
            var data = {
                taskToken: this.chatUserInfo.taskToken,  //用户openId
                page: this.page
            }
            if((this.totalCount && this.page > this.totalCount) || this.chatMore){
                data.more = 1;
                if(!this.chatMore){
                    data.page = 1;
                    this.page = 1;
                } 
                this.chatMore = true;
            }
            chatLog(data).then(res => {
                if(this.page == 1 && !this.chatMore){
                    this.chatData = [];
                    this.chatLoding = true;
                } 
                this.initChatLog(res, data);
            })
        },

        //同事聊天记录
        colleagueChatLog(){
            var data = {
                accept_id: this.chatUserInfo.id,  //用户openId
                page: this.page
            }
            if(this.page == 1){
                this.chatData = [];
                this.chatLoding = true;
            } 
            getColleaguChatLog(data).then(res => {
                this.initChatLog(res, data);
            })
        },

        //加载聊天记录接口
        initChatLog(res, data){
            if(res.code == 0){
                var that = this;
                this.showSpin = false;
                this.totalCount = res.data.totalPage;
                if(res.data.list.length < 1){
                    this.chatLoding = false;
                }
                res.data.list.forEach(function(e,index){
                    e.voiceImg = that.voiceImg;
                    //语音消息voice  
                    //视频消息video   
                    //评价消息systemEvaluation
                    //robot  机器人消息
                    //position 位置
                    if(e.msgType == "voice" || e.msgType == "video" || e.msgType == "systemEvaluation" || e.msgType == "robot" || e.msgType == "position" || e.msgType == "location"){   
                        try {
                            e.Content  = JSON.parse(e.Content);
                        } catch(e) {

                        }
                    }else{
                        if(e.Content){
                            e.Content = that.html2Escape(e.Content);
                            that.replaceCode(e,index);
                        }
                    }
                    that.chatData.unshift(e);
                })
                this.$nextTick(function(){
                    var h = document.querySelector('.ivu-scroll-container');
                    h.scrollTop = h.scrollHeight - this.reaceTop;
                    if(this.page == 1 && !data.more){
                        this.chatWindBottom();
                    }
                })
            }else{
                this.$Notice.warning({title:res.msg});
            }
        },

        //发送消息
        sendMessage(type, mediaId, index, fileIndex){
            this.comText;
            this.$nextTick(() => {
                if(!type) type = "normal";
                var msgId = Math.round(new Date().getTime()) + String(Math.random()).substring(2, 8);
                this.innerText = this.innerText.replace(/&nbsp;/ig, "");
                this.transverter = this.transverter.replace(/&nbsp;/ig, "");
                if(!this.robotAnswerMsg){
                    this.innerText = this.html2Escape(this.innerText);
                    this.transverter = this.html2Escape(this.transverter);
                }
                if(this.transverter.trim() || mediaId){
                    if(type == 'normal' || index){
                        this.pushResDataMessage(type, msgId);
                    }
                    if(fileIndex){
                        this.chatData[fileIndex.index || fileIndex].MsgId = msgId;
                    }
                    //同事会话发送消息
                    if(this.chatUserInfo.ts){
                        var data = {
                            Content: mediaId || this.transverter,  //图片传mediaId  
                            accept_id: this.chatUserInfo.id,
                            type: type,   //消息类型
                            MsgId: msgId
                        }
                        data.isFrom="1";
                        this.colleaguMessage(data);
                    }else{
                        //客户会话发送消息
                        var data = {
                            content: mediaId || this.transverter,  //图片传mediaId  
                            taskToken: this.chatUserInfo.taskToken,
                            type: type,   //消息类型
                            MsgId: msgId,
                            appToken: this.chatUserInfo.appToken,  //小程序  公众号唯一id
                            userToken: this.chatUserInfo.userToken
                        }
                        
                        //重发的消息
                        if(index){
                            var reMsg = this.chatData[index];
                            data.OriginalMsgId = reMsg.MsgId;
                            this.chatData.splice(index,1);
                        }
        
                        data.isFrom="1";
                        eventBus.$emit('eventeSendMsg', this.chatUserInfo.taskToken);
                        //发送成功 清除客户等待时间
                        this.chatUserInfo.task.startWaitTimer = 0;
                        this.userWaitTime = 0;
                        clearInterval(this.timer);
        
                        this.taskMessage(data);
                    }
                    try {
                        this.$refs.textarea.innerText = "";
                    } catch (error) {
                        
                    }
                    this.innerText = "";
                    this.msgContent = "";
                    if(this.chatUserInfo.ts){
                        // this.$emit("receiveColleaguMsg",data);
                    }else{
                        data.CreateTime = this.getNowFormatDate();
                        data.msgType = type;
                        this.$nextTick(() => {
                            this.$emit("receiveMsg", data, "onmessage");
                        })
                    }
    
                    try {
                        this.innerText = JSON.parse(this.innerText);
                    } catch (error) {
                        
                    }
                }
            })
        },

        //发送消息成功 - resData push 数据
        pushResDataMessage(type, msgId){
            var chat = {};
            chat.Content = this.innerText;
            chat.CreateTime = this.getNowFormatDate();
            chat.msgType = type;
            chat.sedLoading = true;
            chat.is_send = "0";
            chat.fromUser = "1";
            if(msgId) chat.MsgId = msgId;
            if(sessionStorage.login_data){
                var n = JSON.parse(sessionStorage.login_data);
                chat.agent = n.username
            }
            this.chatData.push(chat);
            this.$nextTick(() => {
                this.chatWindBottom();
            })
            //机器人初始化
            if(this.robotStatus){
                this.robotAnswerMsg = "";
                this.showRobot = false;
            }
        },

        //客户发送消息 接口
        taskMessage(data){
            sendTaskMessage(data).then(res => {
                this.chatSendStatus(res);
            })
        },

        //同事发送消息
        colleaguMessage(data){
            colleaguSendMsg(data).then(res => {
                this.chatSendStatus(res);
            })
        },


        html2Escape(sHtml) {
            return sHtml.replace(/<(?![^sendIcon]).*?>/g, '')
            // return sHtml.replace(/<(?!img).*?>/g, '')
            // return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
        },
        pasteEscape(sHtml) {
            return sHtml.replace(/<.*?>/g, '')
        },


        //发送失败  重新发送
        redistribute(index){
            this.innerText = this.chatData[index].Content;
            this.sendMessage(this.chatData[index].msgType,null,index);
        },

        //图片上传成功
        imageSuccess (res, file, type) {
            if(type == 'paste'){
                res = res.target.response;
                res = JSON.parse(res);
            }
            if(res.code == 0){
                //同事会话
                if(this.chatUserInfo.ts){
                    this.innerText = res.data.url;
                    setTimeout(() => {
                        this.sendMessage('image',res.data.url, null, file.index || file);
                        this.chatData[file.index || file].Content = res.data.url;
                        this.chatData[file.index || file].sedLoading = false;
                    }, 200);
                }else{
                    this.innerText = res.data.pic;
                    setTimeout(() => {
                        this.sendMessage('image',res.data.media_id, null, file.index || file);
                        this.chatData[file.index || file].Content = res.data.pic;
                        this.chatData[file.index || file].sedLoading = false;
                    }, 200);
                }
            }else{
                this.$Notice.error({title: res.msg});
            }
        },

        //图片上传失败
        imageError(res, file){
            this.$Notice.error({title: '上传异常'});
            this.chatData[file.index || file].Content = '';
            this.chatData[file.index || file].sedLoading = false;
        },  

        //文件上传成功
        fileSuccess(res,file) {
            if(res.code == 0){
                if(res.data.type == 'voice' || res.data.type == 'video'){
                    this.innerText = JSON.stringify({
                        duration: res.data.duration,
                        url: res.data.pic
                    })
                    setTimeout(() => {
                        this.chatData[file.index].msgType = res.data.type;
                        this.chatData[file.index].Content = {
                            duration: res.data.duration,
                            url: res.data.pic
                        };
                        this.chatData[file.index].sedLoading = false;
                    }, 400);
                }else{
                    this.innerText = res.data.pic;
                    setTimeout(() => {
                        this.chatData[file.index].Content = res.data.pic;
                        this.chatData[file.index].sedLoading = false;
                    }, 400);
                }
                this.sendMessage(res.data.type, res.data.media_id, null, file.index);
            }else{
                this.$Notice.error({title: res.msg});
            }
        },

        //上传文件类型错误
        uploadFormatError(){
            this.formatSuccess = false;
            this.$Notice.warning({title: '不支持该文件类型'});
        },

        //聊天窗口滚动条到底部
        chatWindBottom(){
            setTimeout(() => {
                this.$nextTick(() => {
                    if(document.querySelector('.ivu-scroll-container')){
                        var h = document.querySelector('.ivu-scroll-container');
                        h.scrollTop  = h.scrollHeight;
                    }
                })
            }, 50);
        },
        
        //显示表情
        showEmoji(){
            this.isShowIcon = !this.isShowIcon;
        },

        //显示快捷回复
        showfastReply(){
            this.showReply = !this.showReply;
        },

        //选中快捷回复  添加到输入框中
        sendMsgPush(content){
            this.$refs.textarea.innerText = content;
            this.innerText = content;
            this.showReply = false;
        },

        //发送快捷回复
        sendReply(content){
            this.innerText = content;
            this.sendMessage("normal",null);
            this.showReply = false;
        },


        //获取快捷回复列表
        getReplyList(){
            getChatReply().then(res => {
                if(res.code == 0){
                    this.enterprise_reply = res.data.enterprise_reply;
                    this.self_reply = res.data.self_reply;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //聊天框输入
        changeText(){
            this.innerText = this.$refs.textarea.innerHTML;
        },
        
        //选择表情
        selectIcon(index){
            this.msgContent = this.innerText + `<img class="sendIcon" src="${this.loadImg(index)}">`;
            this.innerText  = this.msgContent;
        },

        //emoji表情
        loadImg(index){
            return require(`../../../images/face/${index}.png`)
        },
        

        //表情图片转换 code
        editEmoji(obj){
            if(typeof(obj)!='object'){
                for (let i = 0; i < 70; i++) {
                    var reg = `<img class="sendIcon" src=${this.loadImg(i)}>`,regs = `<img class="sendIcon" src="${this.loadImg(i)}">`;
                    obj = obj.replace(reg,this.emojiJson[i].en);
                    obj = obj.replace(regs,this.emojiJson[i].en);
                }
                if(obj.indexOf('class="sendIcon"')> -1 && obj.indexOf('style') == -1){
                    this.editEmoji(obj)
                }else{
                    this.transverter = obj;
                }
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
        


        //	获取客服列表
        getServiceList(){
            getService().then(res => {
                if(res.code == 0){
                    this.kfList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //创建工单
        createTicketBtn(){
            this.$refs.createTicketRef.createTickets();
        },

        //会话置顶
        stickBtn(){
            var data = {
                taskToken: this.chatUserInfo.taskToken,
                is_top: this.chatUserInfo.is_top ? 0 : 1
            }
            setTop(data).then(res => {
                // this.chatUserInfo.is_top = data.is_top;
                if(res.code == 0){
                    // this.$emit('receiveMsg', this.chatUserInfo);
                }else{
                   this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //转接客服
        transferService(){
            this.transfer.taskToken = this.chatUserInfo.taskToken;
            transferService(this.transfer).then(res => {
                if(res.code == 0){
                    this.visible = false;
                    this.transfer = {};
                    this.$emit("closeTask",'close'); 
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
        
        //结束服务
        closeTask(){
            closeTask({taskToken:this.chatUserInfo.taskToken}).then(res =>{
                if(res.code == 0){
                    this.$emit("closeTask",'close');
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //发送消息  返回状态
        chatSendStatus(n){
            this.chatData.forEach((v,index) => {
                if(v.MsgId == n.data.MsgId){
                    var s = this.chatData[index];
                    if(n.code != 0){
                        s.is_send = "1";
                        s.reason = n.msg
                    }
                    s.sedLoading = false;
                    this.$set(this.chatData,index,s);
                    this.chatWindBottom();
                }
            });
        },

        //playVoice 播放语音消息
        playVoice(index){
            clearTimeout(timer);
            if(this.audio){
                this.audio.pause()
            }
            this.chatData.forEach((e,index) => {
                e.isVoice = false;
            });
            var v = this.chatData[index];
            v.isVoice = true;
            this.$set(this.chatData,index,v);
            this.audio = new Audio(this.chatData[index].Content.url);
            this.audio.play();
            var timer = setTimeout(() => {
                this.chatData[index].isVoice = false;
            }, this.chatData[index].Content.duration * 1000);
        },


        //搜索快捷回复
        searchReply(type){
            if(!this.replyContent) this.replyContent = "";
            var obj={};
            this.replyListDatas = [];
            if(type == 0){
                obj=JSON.parse(JSON.stringify(this.enterprise_reply));
            }else{
                obj=JSON.parse(JSON.stringify(this.self_reply));
            }
            if(this.replyContent){
                obj.forEach(e => {
                    if(e.sub_item.length > 0){
                        e.sub_item.forEach(v => {
                            if(v.content.indexOf(this.replyContent) > -1){
                                this.replyListDatas.push(v);
                            }   
                        });
                    }
                });
            }
        },

        //加载待接入列表
        getWaitList(){
            //待接入 0    会话 1     历史会话 2
            getUserList({tag:0}).then(res => {
                this.showLoading = false;
                if(res.code ==0 ){
                    if(res.data.list) this.waitMsg = res.data.list;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        pushWaitMsg(n){
            var handel = true;
            //待接入已被领取
            if(n.type == "cancel_waiting"){
                this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum - 1);
                return false;
            }
            //收到待接入消息
            if(this.waitMsg){
                this.waitMsg.forEach((e,index) => {
                    if(e.taskToken == n.taskToken){
                        handel = false;
                    }
                })
                if(handel){
                    handel = false;
                    this.waitMsg.push(n);
                    this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum + 1);
                }
            }else{
                this.waitMsg.push(n);
                this.$store.commit("updatedWaitNum",this.$store.state.app.waitMsgNum + 1);
            }
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

        //发送邀请评价
        sendEvaluation(){
            var data = {
                taskToken: this.chatUserInfo.taskToken,
                appToken: this.chatUserInfo.appToken
            }
            evaluation(data).then(res => {
                if(res.code == 0){
                    this.$Notice.success({title: res.msg});
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //实时访客轨迹
        callerTrack(){
            this.trackData = [];
            this.showTrackList = true;
            this.showTrack = true;
            getTraceList({userToken: this.chatUserInfo.userToken}).then(res => {
                this.showTrack = false;
                if(res.code == 0){
                    this.trackData = res.data;
                }else{
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //机器人推荐回答消息
        robotAnswer(){
            this.innerText = this.robotAnswerMsg;
            this.sendMessage('normal');
            this.showRobot = false;
        },

        //打开 || 关闭 机器人辅助
        //1开启 0关闭）
        changeRobot(){
            openRobot({is_robot_sup: this.robotStatus}).then(res => {
                if(res.code == 0){
                    var serviceInfo = this.$store.state.app.serviceInfo;
                    serviceInfo.is_robot_sup = this.robotStatus;
                    this.$store.commit('updateUserInfo',serviceInfo);
                }else{
                    this.robotStatus = 0;
                    this.$Notice.error({title: res.msg}); 
                }
            })
        },

        //机器人辅助回答消息
        robotAssistAnswer(data){
            if(this.chatUserInfo && this.chatUserInfo.taskToken == data.taskToken){
                this.robotAnswerMsg = data.content;
                if(this.$route.path=='/chat'){
                    this.showRobot = true;
                }
            }
        },
        pasteMsg(e){
            this.innerText = this.html2Escape(this.innerText);
        },

        /**
         * base64  to blob二进制
         */
        dataURItoBlob(dataURI) {
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
            var byteString = atob(dataURI.split(',')[1]); //base64 解码
            var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
            var intArray = new Uint8Array(arrayBuffer); //创建视图

            for (var i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            return new Blob([intArray], {type: mimeString});
        },

        //输入框粘贴内容后  光标位置移到最后
        getC(){
            var that = document.getElementById('editText');
			if(document.all){
				that.range=document.selection.createRange();
				that.range.select();
				that.range.moveStart("character",-1); 
			}else{
                that.range=window.getSelection().getRangeAt(0);
				that.range.setStart(that.range.startContainer, that.range.startContainer.length);
			}
        },

    },
    components:{
        searchReplyContent,
        createTickets
    },
    activated: function () {
        this.chatWindBottom();
    },
    deactivated: function () {
        var poptip = document.querySelectorAll('.ivu-poptip-popper');
        if(poptip.length>0){
            poptip.forEach((e, index) => {
                e.style.display = "none";
            })
        } 
    },
    mounted(){
        var that = this;
        this.action = `${url}api/task/upload-image.htm`;
        this.fileAction = `${url}api/task/upload-file.htm`;
        this.robotStatus = sessionStorage.login_data? JSON.parse(sessionStorage.login_data).is_robot_sup : 0;  //是否开启机器人辅助
        this.emojiJson = smohanFace;
        this.emojiJson.forEach((e,index) => {
            this.emojiCode.push(`<img src=${this.loadImg(index)}>`)
        });
        this.windowSize();
        this.getReplyList();
        this.getWaitList();
        // 截图上传图片
        // window.addEventListener('paste', pasteHandler);   pasteHandler= fun...
        window.addEventListener('paste', function (e) {
            var items;
            if (e.clipboardData && e.clipboardData.items) {
                items = e.clipboardData.items;
                if (items) {
                    items = Array.prototype.filter.call(items, function (element) {
                        return element.type.indexOf("image") >= 0;
                    });
                    if(items.length == 0){
                        setTimeout(() => {
                            that.$refs.textarea.innerHTML = that.pasteEscape(that.$refs.textarea.innerHTML);
                            that.innerText = that.pasteEscape(that.innerText);
                            that.getC();
                        }, 30);
                    }
                    Array.prototype.forEach.call(items, function (item) {
                        var file = item.getAsFile();
                        var blob = file;
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            try {
                                that.$refs.textarea.innerText = "";
                            } catch (error) {
                                
                            }
                            that.innerText = "";
                            that.msgContent = "";
                            var imgBase64 = e.target.result;  //    event.target.result.split(",")  [0]=data:image/png;base64  [1]=data
                            var dataURI = imgBase64;
                            var blob = that.dataURItoBlob(dataURI); // blob
                            that.innerText = 'luban_img_';
                            that.pushResDataMessage('image');

                            var xhr = new XMLHttpRequest();
                            var fd = new FormData();
                            fd.append('taskToken', that.chatUserInfo.taskToken);
                            fd.append('userToken', that.chatUserInfo.userToken);
                            fd.append('Access-Token', that.access_token);
                            fd.append('image', blob, file.name);
                            xhr.addEventListener('load',  function(){ that.imageSuccess(event, that.chatData.length-1, 'paste') }, false);
                            xhr.addEventListener('error', function(){ that.uploadError() }, false);
                            xhr.addEventListener('abort', function(){ that.uploadError() }, false);
                            xhr.open('POST', that.action);
                            xhr.send(fd);
                            xhr.getAllResponseHeaders()

                        };
                        reader.readAsDataURL(blob);

                    });
                }
            }
        });
    },
    watch:{
        chatMsgList(n,o){
            if(n){   
                var obj={};
                obj=JSON.parse(JSON.stringify(n));
                //colleague_active -   同事状态更新  
                //transfer -           转接会话消息
                //close_task -         结束会话消息
                //reader               已读消息
                //sup_robot            机器人辅助消息
                //set_top              会话置顶
                if(n.type && (n.type == "colleague_active" || n.type == "transfer" || n.type == "close_task" || n.type == "reader" || n.type == "set_top")){
                    this.$emit("receiveMsg", obj);
                    return
                }else if(n.type == "sup_robot"){
                    this.robotAssistAnswer(obj);
                    return
                }
                //待接入消息
                if(n.type == "waiting" || n.type == "cancel_waiting"){
                    this.pushWaitMsg(n);
                    return false;
                }else if(n.type == "notice" && this.chatUserInfo && n.taskToken == this.chatUserInfo.taskToken){
                //消息预知
                    if(!n.Content){
                        this.isNotice = false;
                        return false;
                    }
                    this.isNotice = true;
                    this.noticeContent = n.Content;
                    this.$nextTick(()=>{
                        if(this.noticeOne){
                            this.chatWindBottom();
                            this.noticeOne = false;
                        }
                    })
                    return false;
                }else if(this.chatUserInfo && (n.taskToken && n.taskToken == this.chatUserInfo.taskToken || (n.identity && n.identity.id == this.chatUserInfo.id && this.chatUserInfo.ts))){
                    this.isNotice = false;
                    this.noticeOne = true;
                    var _n = n.task;
                    if(n.taskToken){
                        if(n.task){
                            this.chatUserInfo.startWaitTimer = n.task.startWaitTimer;
                            this.chatUserInfo.task.fromUser = n.task.fromUser;
                            this.comWaitTime;
                        } 
                    }
                    if(_n && _n.msgType){
                        //voice收到语音消息
                        //video收到视频消息
                        //systemEvaluation用户评价消息
                        if(_n.msgType == "voice" || _n.msgType == "video" || _n.msgType == "systemEvaluation"){
                            try {
                                if(Number(_n.Content)>-1){
                                    return
                                }
                                _n.Content = JSON.parse(_n.Content);
                            } catch(e) {

                            }
                        } else if(_n.msgType == "systemEvaluation" || _n.msgType == "robot"){
                        //robot  机器人消息
                            try {
                                _n.Content = JSON.parse(n.Content);
                            } catch(e) {

                            }
                        }
                    } 
                    if(_n){
                        if(typeof(_n.Content)=='string'){
                            this.replaceCode(_n)
                        }
                        this.chatData.push(_n);
                        setTimeout(()=>{
                            this.chatWindBottom();
                        },50)
                    }
                }else if(n.errcode != 0 && n.errmsg){
                    //消息发送失败 回执消息
                    this.chatSendStatus(n);
                }else if(n.errcode == 0 && n.MsgId){
                    //消息发送成功 回执消息
                    this.chatSendStatus(n);
                }

                //收到消息同步到会话列表 最后一条聊天记录
                if(n.task){
                    if(n.task.Content && n.taskToken){
                        this.$emit("receiveMsg", obj, "onmessage");
                        this.robotAnswerMsg = "";
                        this.showRobot = false;
                    } else{
                        this.$emit("receiveColleaguMsg",obj);
                    } 
                }
                
            }
        },
        //用户信息
        chatUserInfo(n,o){
            if(this.chatUserInfo){
                this.showTrackList = false;
                this.page = 1;
                this.chatMore = false;
                this.chatData = [];
                this.windowSize();
                this.getHistoryChatMsg();
                this.innerText = "";
                this.msgContent = "";
                this.noticeOne = true;
                this.isNotice = false;
                this.showSpin = true;
                if(this.chatUserInfo.task) this.chatUserInfo.task.viewCount = 0;
                if(this.$refs.textarea) this.$refs.textarea.innerText = " ";
                if(this.chatUserInfo.ts == 1){
                    // 同事会话
                    // console.log('ts');
                }else {
                    //我的会话
                    this.userWaitTime = 0;
                    this.chatMore = false;
                    this.comWaitTime;
                }
                if(this.chatUserInfo.ts){
                    this.action = `${url}api/upload/image.htm`;
                }else{
                    this.action = `${url}api/task/upload-image.htm`;
                }
            }
        },
    }
}
</script>
