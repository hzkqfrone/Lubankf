<template>    
    <Card class="chatContent">
        <div class="chatMain">
            <!-- center -->
            <div class="chatWrap ct">
                <chat-msg :chatUserInfo="chatUserInfo" @receiveMsg="receiveMsg" @receiveColleaguMsg="receiveColleaguMsg" @closeTask="closeTask" @chatUserSize="chatUserSize" ref="chatMsg"></chat-msg>
            </div>

            <!-- left -->
            <div class="chatLeft">
                <div class="userListTxl ct">
                    <Spin size="large" fix v-if="showSpin"></Spin>
                    <Tabs :value="indexTag" :animated="false" @on-click="selectMenu">
                        
                        <div class="isTodoSearch clearfix" slot="extra">  
                            <!-- 待处理中  时间检索 和 会话排序 -->
                            <div class="pending" v-if="indexTag=='0'">
                                <div class="chatLimit">
                                    <span>最大接待人数</span>
                                    <Select v-model="chatLimit" @on-change="maxLimit" size="small" style="width:80px">
                                        <Option v-for="(item,index) in 100" :value="item" :key="index">{{ item }}</Option>
                                    </Select>
                                </div>
                                <span class="max_service_num">{{chatTotalCount}}/{{$store.state.app.max_service_num}}</span>
                                <div class="searchRight">
                                    <div class="sortable">
                                        <Dropdown trigger="click" placement="bottom" @on-click="chatSort" transfer>
                                            <Tooltip content="会话排序" placement="top" transfer>
                                                <i class="sort iconfont">&#xe6a2;</i>
                                            </Tooltip>
                                            <DropdownMenu slot="list" class="customerSort">
                                                <DropdownItem name="news" :class="{in:searchSort.sort=='news'}">
                                                    最新消息<Icon type="md-checkmark" v-if="searchSort.sort=='news'" />
                                                </DropdownItem>
                                                <DropdownItem name="sign_in" :class="{in:searchSort.sort=='sign_in'}">
                                                    接入顺序<Icon type="md-checkmark" v-if="searchSort.sort=='sign_in'" />
                                                </DropdownItem>
                                                <DropdownItem name="wait_timer" :class="{in:searchSort.sort=='wait_timer'}">
                                                    访客等待时长<Icon type="md-checkmark" v-if="searchSort.sort=='wait_timer'" />
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                    <div class="search">
                                        <Poptip placement="bottom" width="300" v-model="timeSort" transfer>
                                            <Tooltip content="时间检索" placement="top" transfer>
                                                <i class="time iconfont">&#xe62f;</i>
                                            </Tooltip>
                                            <div class="api chatDateSearch" slot="content">
                                                <div>
                                                    <p>访客最后回复时间</p>
                                                    <div class="chatDateTag">
                                                        <span @click="recoveryTime(5,1)" :class="{selectIn:isClick==1}">5分钟内</span>
                                                        <span @click="recoveryTime(10,2)" :class="{selectIn:isClick==2}">10分钟内</span>
                                                        <span @click="recoveryTime(30,3)" :class="{selectIn:isClick==3}">30分钟内</span>
                                                        <p><InputNumber @on-change="sortTime" v-model="searchSortTime" style="width:80px;margin-right:5px"></InputNumber >分钟内</p>
                                                    </div>
                                                </div>
                                                <div class="btn">
                                                    <Button @click="isClick=0,searchSortTime=0,searchSort.reply_timer=''">重置</Button>
                                                    <Button @click="timeSortSearch" type="primary">搜索</Button>
                                                </div>
                                            </div>
                                        </Poptip>
                                    </div>
                                </div>
                            </div>
                            <!-- 全部中的搜索用户和其他操作 -->
                            <div v-if="indexTag=='1'">
                                <Input search placeholder="请输入用户名" size="small" v-model="userKey" @on-search="searchUser" @on-change="searchUser"/>
                            </div>
                        </div>

                        <TabPane :label="myChat" name="0">
                            <div class="userWrap">
                                <div class="chatGroup" v-if="indexTag=='0'">
                                    <ul class="userList" v-if="chatDataUser.length>0" :style="{'padding-bottom':chatTotalCount>20?'38px':''}">
                                        <li v-for="(item,index) in chatDataUser" v-if="chatDataUser.length>0" :key="index" @click="sponsorChat(index)" :class="{clearfix:true,isIn:clickIn === index}" >
                                            <i class="iconfont isStick" v-if="item.is_top">&#xe62a;</i>
                                            <Badge :count="Number(item.task && item.task.viewCount)" class="image">
                                                <Avatar v-if="item.source=='1' || !item.headImg" shape="square" :src="xcxImg"/>
                                                <Avatar v-else shape="square" :src="item.headImg"/>
                                            </Badge>
                                            <div class="content">
                                                <div class="title">
                                                    <Tag color="success" v-if="item.is_online">在线</Tag>
                                                    <Tag color="#a3a3a3" v-else>离线</Tag>
                                                    {{item.nickname}}
                                                </div>
                                                <p class="text clearfix">
                                                    <span v-if="item.task.fromUser==1" class="from">我：</span>
                                                    <span v-else class="from">访：</span>
                                                    <span v-if="item.task.msgType=='voice'">[语音]</span>
                                                    <span v-else-if="item.task.msgType=='systemEvaluation'">[用户评价]</span>
                                                    <span v-else-if="item.task.msgType=='image'">[图片]</span>
                                                    <span v-else-if="item.task.msgType=='file'">[文件]</span>
                                                    <span v-else-if="item.task.msgType=='video'">[视频]</span>
                                                    <span v-else-if="item.task.msgType=='robot'">[机器人]</span>
                                                    <span v-else-if="item.task.msgType=='position' || item.task.msgType=='location'">[位置]</span>
                                                    <span v-else v-html="item.task.Content"></span>
                                                </p>
                                                <p class="isfrom">
                                                    <span v-if="item.source=='0'" title="微信"><i class="wechat iconfont">&#xe61a;</i></span>
                                                    <span v-if="item.source=='1'" title="微信小程序"><i class="xcx iconfont">&#xe616;</i></span>
                                                    <span v-if="item.source=='2'" title="桌面网站"><i class="pc iconfont">&#xe6a8;</i></span>
                                                    <span v-if="item.source=='3'" title="微博"><i class="weibo iconfont">&#xe6aa;</i></span>
                                                    <span v-if="item.source=='4'" title="移动网站"><i class="appWebsite iconfont">&#xe62b;</i></span>
                                                    <span v-if="item.source=='5'" title="企业微信"><i class="workWechat iconfont">&#xe6a6;</i></span>
                                                </p>
                                            </div>
                                            <div class="userRight">
                                                <div class="closeChat">
                                                    <time class="createTime">{{item.task.CreateTime}}</time>
                                                    <!-- 关闭服务 -->
                                                    <Tooltip content="关闭" placement="bottom" class="funcHint">
                                                        <Icon type="md-close" class="closeService" @click.stop="closeChat(index)" />
                                                    </Tooltip>
                                                </div>
                                                <span class="waitTime" v-if="item.task.fromUser == 0 && item.task.waitTime">等{{item.task.waitTime}}</span>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-if="chatDataUser.length == 0" class="emptyChat">暂无会话~</div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane :label="colleague" name="1">
                            <div class="userWrap">
                                <div class="chatGroup" v-if="indexTag=='1'">
                                    <ul class="userList" v-if="chatDataUser.length>0" :style="{'padding-bottom':totalCount>20?'38px':''}">
                                        <li :class="{clearfix:true,isIn:AllIn === index}" v-for="(item,index) in chatDataUser" :key="index"  @click="sponsorAllInChat(index)">
                                            <div>
                                                <Badge :count="Number(item.viewCount)" class="image">
                                                    <Avatar v-if="item.headImg" shape="square" :src="item.headImg"/>
                                                    <svg v-else class="icon" aria-hidden="true" style="width:40px;height:40px;"><use xlink:href="#icon-morentouxiang"></use></svg>
                                                </Badge>
                                                <div class="content colleagueContent">
                                                    <div class="title">
                                                        <Tag color="#a3a3a3" v-if="item.active == 0">离线</Tag>
                                                        <Tag color="success" v-if="item.active == 1">空闲</Tag>
                                                        <Tag color="error" v-if="item.active == 2">忙碌</Tag>
                                                        <Tag color="warning" v-if="item.active == 3">隐身</Tag>
                                                        <Tag color="primary" v-if="item.active == 4">离开</Tag>
                                                        <span>{{item.username}}</span>
                                                    </div>
                                                    <p class="isfrom">
                                                        {{item.role}}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-if="chatDataUser.length == 0" class="emptyChat">暂无会话~</div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    
                </div>
                <div class="chatPage" v-show="indexTag=='0' && chatTotalCount > 20">
                    <Page :total="chatTotalCount" show-total :page-size="20" size="small" @on-change="handleReachPage" />
                </div>
                <div class="chatPage" v-show="indexTag=='1' && totalCount > 20">
                    <Page :total="totalCount" show-total :page-size="20" size="small" @on-change="handleColleaguePage" />
                </div>
            </div>
            <!-- right 用户信息-->
            <user-tag :chatUserInfo="chatUserInfo" v-show="chatUserInfo && !chatUserInfo.ts" @updateUsername="updateUsername"></user-tag>       
        </div>
    </Card>
</template>
<script>
    import {smohanFace} from '@/views/my-components/emoji/emoji';
    import chatMsg from '@/views/chat/components/chatMsg';
    import userTag from '@/views/my-components/user-tag/usertag';
    import { getUserList, getColleaguList, changeReader, colleaguReader, getTagInfo, updatedUserInfo, setMaxService, editUserTag, deleteUserTag, closeTask } from '@/libs/api';
    import Cookies from 'js-cookie';
    import '../../static/font/iconfont.js'; 
    export default {
        data(){
            return{
                showSpin:true,
                tagDrawer:false,
                chatDataUser:[],
                clickIn:'',
                AllIn:'',
                chatUserInfo:"",   //正在聊天的用户信息
                indexTag:"0",      //0 - 未处理   1-全部  
                xcxImg:'',         //小程序头像 
                emojiJson:[],      //表情对应json
                userWrapHeight:0,  //用户列表高度
                page:1,  
                sponsorToken:'',   //主动发起会话的taskToken
                timer:'',
                searchSort:{
                    sort: 'news'
                },
                searchSortTime:0,  //访客自定义最后回复时间
                timeSort:false,
                isClick:0,
                checkIn:[],        //被选中的会话
                chatLimit:10,      //会话上限
                chatTotalCount:0,  //我的会话总数
                totalCount:0,      //同事列表总数
                userKey:'',        //搜索同事关键字
                chatViewContent:{},//未读会话数
                myChat: (h) =>{
                    return h('div', [
                        h('span','我的会话'),
                        h('Badge',{
                            props:{
                                count: this.chatViewContent.chat_view>0 ?this.chatViewContent.chat_view : 0
                            }
                        })
                    ])
                },
                colleague: (h) =>{
                    return h('div', [
                        h('span','同事会话'),
                        h('Badge',{
                            props:{
                                count: this.chatViewContent.inside_view>0 ? this.chatViewContent.inside_view : 0
                            }
                        })
                    ])
                }
            }
        },
        computed:{
            callerList () {
                return this.$store.state.app.callerData;
            }
        },
        created() {
            var data = sessionStorage.login_data;
            if(data){
                var d = JSON.parse(data)
                this.chatLimit = d.max_service_num;
            }
        },
        mounted() {
            this.emojiJson = smohanFace;
            if(this.$route.query.ts){
                //同事会话
                this.getColleagu();
            }else{
                //获取用户列表
                this.init();         
            }
            this.xcxImg = require('../../images/program.png');
            this.chatUserSize();
            window.onresize = () => {
                this.$nextTick(() => {
                    this.chatUserSize();   
                })
                this.$refs.chatMsg.windowSize();
            }
            this.$store.commit('setLoadChatBox', true);
        },
        methods:{
            //我的会话列表 
            init(){
                this.chatDataUser = [];
                this.showSpin = true;
                //浏览器消息通知跳转进来的
                var u = this.$route.query.u;
                var type = this.$route.query.type;
                if((type || u) && this.indexTag == "1"){
                    this.indexTag = "0";
                }
                getUserList(Object.assign({tag:1,page:this.page},this.searchSort)).then(res => {
                    this.chatDataUser = [];
                    this.$store.commit('updateIsLoadChat',true);
                    this.chatTotalCount = Number(res.data.totalCount);
                    this.showSpin = false;
                    if(!res.data) return false;
                    res.data.list.forEach((v,index) => {
                        this.chatDataUser.push(v);
                        this.replaceCode(v.task.Content,index);
                    });
                    //未读消息数
                    this.chatViewContent = res.data.view;
                    this.$store.commit('updatedUnreadMsg', res.data.view.total_view); //未读会话消息总数
                    this.$store.commit("updatedWaitNum",res.data.view.waiting_view); //待接入消息总数
                    //浏览器通知消息
                    this.$nextTick(()=>{
                        if(u){
                            this.chatDataUser.forEach((e,index) => {
                                if(u == e.taskToken){
                                    this.sponsorChat(index);
                                }
                            });
                        }else if(type == "startTask"){
                            this.sponsorChat(0);
                        }
                    })

                    //打开待处理正在会话客户
                    if(this.indexTag == 0 && this.clickIn>=0){
                        this.chatUserInfo = this.chatDataUser[this.clickIn];
                        if(this.chatUserInfo){
                            this.sponsorChat(this.clickIn);
                        }
                    }

                    this.startChat();
                    this.waitTime();  //等待时间
                })
            },

            //同事会话列表
            getColleagu(){
                this.chatDataUser = [];
                this.showSpin = true;
                var ts = this.$route.query.ts;
                getColleaguList({page: this.page, username: this.userKey}).then(res => {
                    this.showSpin = false;
                    if(res.code == 0){
                        this.chatDataUser = res.data.list;
                        this.totalCount = Number(res.data.totalCount);
                        if(ts){
                            this.indexTag = "1";
                            this.chatDataUser.forEach((e,index) => {
                                if(ts == e.id){
                                    this.sponsorAllInChat(index);
                                }
                            });
                        }
                    }else{
                       this.$Notice.error({title: res.msg}); 
                    }
                })
            },

            //主动发起会话
            startChat(){
                this.chatDataUser.forEach((e,index) => {
                    if(e.taskToken == this.sponsorToken){
                        this.clickIn = index;
                        this.chatUserInfo = e;
                    }
                })
            },

            //用户列表  加载下一页
            handleReachPage (page) {
                this.page = page;
                this.init();
            },

            //同事会话  加载下一页
            handleColleaguePage (page) {
                this.page = page;
                this.init();
            },

            //发起会话
            sponsorChat(index){
                this.clickIn = index;
                this.chatUserInfo = this.chatDataUser[index];
                this.$router.push({
                    query:{}
                })
                var count = this.chatDataUser[index];
                this.chatViewContent.chat_view = this.chatViewContent.chat_view - count.task.viewCount;
                this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view -= Number(count.task.viewCount));
                count.task.viewCount = "0";
                this.$set(this.chatDataUser,index,count)
            },

            //客服同事发起会话
            sponsorAllInChat(index){
                this.AllIn = index;
                this.$router.push({
                    query:{}
                })
                this.chatUserInfo = this.chatDataUser[index];
                this.chatViewContent.inside_view = this.chatViewContent.inside_view - this.chatUserInfo.viewCount;
                this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view -= Number(this.chatUserInfo.viewCount));
                this.chatDataUser[index].viewCount = "0";
                this.chatUserInfo.ts = 1;   //同事会话
            },

            //客户聊天修改未读消息
            changeReaderMsg(index){
                changeReader({taskToken:this.chatUserInfo.taskToken}).then(res => {
                    if(res.code == 0){
                        var count = this.chatDataUser[index];
                        count.task.viewCount = "0";
                        this.$set(this.chatDataUser,index,count)
                    }
                })
            },

            //同事聊天修改未读信息
            changeColleaguReaderMsg(index){
                colleaguReader({dispatch_id:this.chatUserInfo.id}).then(res => {
                    if(res.code == 0){
                        var count = this.chatDataUser[index];
                        count.viewCount = "0";
                        this.$set(this.chatDataUser,index,count)
                    }
                })
            },

            //收到客户消息
            receiveMsg(msg, type){
                var handle = true;
                this.$nextTick(() => {
                    //其他端关闭会话消息  把列表中的这条会话删除
                    //转接会话
                    if(msg.type == "close_task" || msg.type == "transfer"){
                       this.closeChatTask(msg);
                        return 
                    }else if(msg.type == "colleague_active"){
                    //同事在线状态
                        this.updatChatStatus(msg, 'colleague_active');
                    }else if(msg.type == "reader"){
                    //会话已读消息 将此条会话未读数清空
                        this.updatChatStatus(msg, 'reader');
                    }else if(msg.type == "set_top"){
                    //会话置顶
                        this.updatChatStatus(msg, 'isTop');
                    } else {
                        for(var index = 0;index < this.chatDataUser.length;index++){
                            var m = this.chatDataUser[index];
                            if(this.indexTag == 1){
                                this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view += 1)
                                this.chatViewContent.chat_view = this.chatViewContent.chat_view += 1;
                                return false;
                            }
                            if(m.taskToken == msg.taskToken){
                                //有新消息 位置排第一
                                var o = this.chatDataUser[index];
                                handle = false;
                                this.$nextTick(() => {
                                    if(msg.task && msg.task.fromUser == 0){
                                        o.is_online = "1";
                                    }
                                    if(msg.isFrom == 1){
                                        msg.task = "";
                                        o.task.fromUser = "1";
                                        o.task.Content = this.replaceCode(msg.content); 
                                        o.task.CreateTime = msg.CreateTime,
                                        o.task.msgType = msg.msgType;
                                        o.task.startWaitTimer = 0;
                                        o.task.waitTime = 0;
                                    }else if(msg.task){
                                        o.task = msg.task;
                                        if(msg.task.msgType!="voice"){
                                            this.replaceCode(msg.task.Content,index);
                                        } 
                                        if(this.indexTag == 0 && this.chatUserInfo && msg.taskToken == this.chatUserInfo.taskToken){   //处在正与此用户会话中
                                            o.task.viewCount = 0;
                                            this.changeReaderMsg(index);
                                        }else{
                                            if(o.task.msgType){
                                                this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view += 1)
                                                this.chatViewContent.chat_view = this.chatViewContent.chat_view += 1;
                                            }
                                        }
                                    }
                                    // msg = "";
                                    this.$set(this.chatDataUser,index,o);
                                    if(!o.is_top){
                                        this.chatTop(o, index);
                                    }
                                })
                                break;
                            }
                        };
                        if(handle && this.indexTag == 0){
                            var n = msg.task.viewCount ? Number(msg.task.viewCount) : 0;
                            this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view += n);
                            this.chatViewContent.chat_view = this.chatViewContent.chat_view += n;
                            // this.chatDataUser.unshift(msg);
                            this.chatTop(msg, null , 'newChat');
                            this.chatTotalCount += 1;
                            if(this.clickIn>0){
                                this.clickIn += 1;
                            }
                        }
                    }
                })
            },

            //当前会话位置
            updateChatIndex(){
                this.chatDataUser.forEach((e,index) => {
                    if(this.chatUserInfo && e.taskToken == this.chatUserInfo.taskToken){
                        this.clickIn = index;
                    }
                });
            },


            //会话置顶
            chatTop(msg, index, type){
                var handle = true;
                for(var i = 0; i < this.chatDataUser.length; i++){
                    var pos1 = !this.chatDataUser[i].is_top
                    if(type == "top") pos1 = !this.chatDataUser[i].is_top && this.chatDataUser[i].taskToken != msg.taskToken;
                    if(pos1 || msg.is_top || i == this.chatDataUser.length-1){
                        handle = false;
                        //新会话
                        if(type == "newChat"){
                            this.chatDataUser.splice((pos1 || msg.is_top)? i : i + 1, 0, msg);
                        }else{
                            // if(pos1) i = i ? i-1 : i;
                            var temp = this.chatDataUser[index];
                            this.chatDataUser.splice(index,1);
                            this.chatDataUser.splice(i, 0, temp);
                        }
                        this.$nextTick(() => {
                            this.updateChatIndex();
                        })
                        break;
                    }
                }
                this.$nextTick(() => {
                    if(handle && this.chatDataUser.length == 0){
                        this.chatDataUser.splice(this.chatDataUser.length, 0, msg);
                    }
                })
            },


            //收到同事消息
            receiveColleaguMsg(msg){
                var handle = true;
                for(var index = 0;index < this.chatDataUser.length;index++){
                    var m = this.chatDataUser[index];
                    if(m.id == msg.accept_id || (msg.identity && m.id == msg.identity.id)){
                        //有新消息 位置排第一
                        if(msg.isFrom == 1) this.AllIn = 0;
                        var temp = this.chatDataUser[index];
                        this.chatDataUser.splice(index,1);
                        this.chatDataUser.unshift(temp);
                        var index = 0;
                        var o = this.chatDataUser[index];
                        handle = false;
                        this.$nextTick(() => {
                            if(this.indexTag == 1 && this.chatUserInfo && (msg.accept_id == this.chatUserInfo.id || (msg.identity && msg.identity.id == this.chatUserInfo.id))){   //处在正与此用户会话中
                                o.viewCount = 0;
                                this.changeColleaguReaderMsg(index);
                            }else{
                                o.viewCount = msg.task.viewCount;
                                this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view += 1)
                                this.chatViewContent.inside_view = this.chatViewContent.inside_view += 1;
                            }
                            this.$set(this.chatDataUser,index,o);
                        })
                        break;
                    }
                };
                if(handle && this.indexTag == 1){
                    this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view += 1)
                    this.chatViewContent.inside_view = this.chatViewContent.inside_view += 1;
                    msg.identity.viewCount = msg.task.viewCount;
                    this.chatDataUser.unshift(msg.identity);
                }

                this.chatDataUser.forEach((e,index) => {
                    if(this.chatUserInfo && e.id == this.chatUserInfo.id){
                        this.AllIn = index;
                    }
                });
            },

            //会话状态
            updatChatStatus(msg, type){
                this.chatDataUser.forEach((e,index) => {
                    var _data = this.chatDataUser[index];
                    //同事在线状态更新
                    if(this.indexTag == "1" && type == "colleague_active"){
                        if(e.id == msg.colleague_id){
                            _data.active = msg.active;
                        }
                    }else if(type == "reader"){
                    //已读会话消息
                        if(e.taskToken == msg.taskToken){
                            this.chatViewContent.chat_view = this.chatViewContent.chat_view -= Number(_data.task.viewCount);
                            this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view -= Number(_data.task.viewCount));
                            _data.task.viewCount = 0;
                            this.$set(this.chatDataUser,index,_data);
                        }
                    }else if(type == "isTop"){
                    //会话置顶
                        if(e.taskToken == msg.taskToken){
                            _data.is_top = msg.is_top;
                            this.$set(this.chatDataUser,index,_data);
                            this.chatTop(_data, index, 'top');
                        }
                    }
                });
            },

            //表情 转换成图片
            replaceCode(n,index){
                if(n && typeof(n)!='object'){
                    for(let m = 0; m < 70; m++){
                        var e = this.emojiJson[m];
                        n = n.replace(e.sym,`<em class="emoji" style=background-position-y:${m * -20}px></em>`);
                        n = n.replace(e.en,`<em class="emoji" style=background-position-y:${m * -20}px></em>`);
                        n = n.replace(e.cn,`<em class="emoji" style=background-position-y:${m * -20}px></em>`);
                        if(n.indexOf(e.sym)>-1 || n.indexOf(e.en)>-1 || n.indexOf(e.cn)>-1){
                            return this.replaceCode(n,index);;
                        }
                    }
                    if(index>-1 && this.chatDataUser[index].task) this.chatDataUser[index].task.Content = n;
                }
                return n;
            },

            //切换菜单列表  0 待处理  1全部
            selectMenu(name){
                this.indexTag = name;
                this.page = 1;
                if(name == 1){
                    this.chatUserInfo = "";
                    this.AllIn = "";
                    this.getColleagu();
                    clearInterval(this.timer);
                }else{
                    this.init();
                }
            },

            //全部 - 搜索用户
            searchUser(){
                this.showSpin = true;
                this.AllIn = '';
                this.getColleagu();
            },
            
            closeTask(type,taskToken){
                //結束服務   转接客服
                if(type == "close"){
                    this.chatUserInfo = "";
                    this.clickIn = "";
                }else if(type == "getChat"){   
                    //主动发起会话 - 跳转待处理
                    this.indexTag = "0";
                    this.sponsorToken = taskToken;
                    this.page = 1;
                    this.init();
                }
            },

            chatUserSize(){
                var that = this;
                let fullHeight = document.documentElement.clientHeight - 172;
                that.userWrapHeight = fullHeight;
            },

            //等待时间
            waitTime(index,date){
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this.chatDataUser.forEach((e,index) => {
                        if(e.task && e.task.fromUser == 0){
                            e.task.startWaitTimer<0 ? e.task.startWaitTimer=0 : e.task.startWaitTimer;
                            e.task.startWaitTimer += 1;
                            var s = e.task.startWaitTimer%60;
                            if(s < 10){
                                s = "0" + s;
                            }
                            e.task.waitTime =  Math.floor(e.task.startWaitTimer/60) + ':' + s;
                            this.$set(this.chatDataUser,index,e)
                        }
                    });
                }, 1000);
            },


            // timeStamp( second_time ){

            //     var time = parseInt(second_time) + "秒";
            //     if( parseInt(second_time )> 60){

            //         var second = parseInt(second_time) % 60;
            //         var min = parseInt(second_time / 60);
            //         time = min + "分" + second + "秒";
                    
            //         if( min > 60 ){
            //             min = parseInt(second_time / 60) % 60;
            //             var hour = parseInt( parseInt(second_time / 60) /60 );
            //             time = hour + "小时" + min + "分" + second + "秒";

            //             if( hour > 24 ){
            //                 hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
            //                 var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
            //                 time = day + "天" + hour + "小时" + min + "分" + second + "秒";
            //             }
            //         }
                    

            //     }

            //     return time;		
            // },


            //时间检索  回复时间排序
            recoveryTime(n,index){
                this.isClick = index;
                if(this.searchSort.reply_timer == n){
                    this.isClick = 0;
                    this.searchSort.reply_timer = '';
                }else{    
                    this.searchSort.reply_timer = n;
                }
            },
            sortTime(){
                this.isClick = 0;
                this.searchSort.reply_timer = parseInt(this.searchSortTime) || 0;
            },

            timeSortSearch(){
                this.init();
                this.timeSort = false;
                this.clickIn = "";
                this.chatUserInfo = "";
            },

            //会话排序
            chatSort(name){
                this.searchSort.sort = name;
                this.init();
                this.clickIn = "";
                this.chatUserInfo = "";
            },

            exportChatLog(){
                this.showCheck = true;
            },


            //会话上限
            maxLimit(n){
                var d = JSON.parse(sessionStorage.login_data);
                d.max_service_num = n;
                setMaxService({max_service_num: n}).then(res => {
                    if(res.code == 0){
                        sessionStorage.login_data =JSON.stringify(d);
                        this.$store.commit('updatemax_service_num',n);
                    }else{
                        this.$Notice.error({title: res.msg});
                    }
                })
            },

            //关闭会话 - 结束服务接口
            closeChat(index){
                closeTask({taskToken:this.chatDataUser[index].taskToken}).then(res =>{
                    if(res.code == 0){
                        if(this.clickIn === index){
                            this.chatUserInfo = "";
                            this.clickIn = "";
                        }
                    }else{
                        this.$Notice.error({title: res.msg});
                    }
                })
            },

            //socket 推送关闭会话
            closeChatTask(msg){
                this.chatDataUser.forEach((e, index) => {
                   if(e.taskToken == msg.taskToken){
                        eventBus.$emit('eventeSendMsg', msg.taskToken);
                        var num = this.chatDataUser[index].task.viewCount;
                        if(num > 0){
                            this.$store.commit('updatedUnreadMsg',this.chatViewContent.total_view -= Number(num));
                            this.chatViewContent.chat_view = this.chatViewContent.chat_view -= Number(num);
                        }
                        this.updateChatIndex(index);
                        if(this.chatUserInfo && this.chatUserInfo.taskToken == msg.taskToken){
                            this.chatUserInfo = "";
                            this.clickIn = "";
                        }
                        this.chatTotalCount -= 1;
                        this.chatDataUser.splice(index,1);
                   }
               });
            },
            
            //更新用户名称
            updateUsername(name){
                if(name){
                    this.chatUserInfo.nickname = name;
                }
            }
        },
        components:{
            chatMsg,
            userTag
        },
        watch:{
            '$route' (to, from) {
                this.$Modal.remove();
                if(this.$route.query.u || this.$route.query.type){
                    this.init();
                }else if(this.$route.query.ts){
                    //浏览器消息通知跳转进来的 同事消息
                    this.getColleagu();
                }
            },  

            callerList(n,o){
                //temp_user_sign_in 用户进入页面
                //temp_user_leave   用户离开页面
                var status = 1;
                if(n.type == "temp_user_sign_in"){
                    status = 1;
                }else if(n.type == "temp_user_leave"){
                    status = 0;
                }
                this.chatDataUser.forEach((v,index) => {
                    if((n.user && v.userToken == n.user.userToken) || v.userToken == n.userToken){
                        v.is_online = status;
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    @import './chat.less';
    .waitTime{
        color:#ff8f00;
        font-size:14px;
        float:right;
    }
</style>