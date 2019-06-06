<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'160px', overflowY:'auto' }">
            <!-- <scroll-bar ref="scrollBar"> -->
                <shrinkable-menu 
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme" 
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                    <div slot="top" class="logo-con">
                        <img v-show="!shrink" src="../images/logo_white.svg" key="max-logo" />
                        <img v-show="shrink" src="../images/logo_min.svg" style="width:45px;height:45px;" key="min-logo" />
                    </div>
                </shrinkable-menu>
            <!-- </scroll-bar> -->
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'160px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="ios-menu" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :serviceStatus="serviceStatus"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <div class="hader-right">
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                        <!-- <theme-switch></theme-switch> -->
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ userName }}</span>
                                        <Icon type="ios-arrow-down"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="loginout">退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown> 
                                <img v-if="headIMg" :src="headIMg" style="width:32px;height:32px;border-radius:32px">
                                <svg class="icon" v-else aria-hidden="true" style="width:32px;height:32px;"><use xlink:href="#icon-morentouxiang"></use></svg>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div> -->
        </div>

        <!-- 新消息提示 -->
        <div class="single-page-con" :style="{left: shrink?'60px':'160px'}">
            <div class="single-page">
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </div>
        <div :class="{msgOut:isNewMsg,msgDiog:true}" @mouseover="mouseoverMsg" @mouseout="mouseoutMsg" @click="openNewMsg">
            <div class="clearfix">
                <div class="headImg">
                    <img :src="lbMsg.headImg">
                </div>
                <div class="content">
                    <div class="title">{{lbMsg.title}}</div>
                    <div class="txt"><p>{{lbMsg.Content}}</p></div>
                </div>
                <Icon class="close" type="md-close" @click.stop.prevent="closeInform" />
            </div>
        </div>
        
        <!-- 下线提示 -->
        <Modal v-model="tapeOut" class="tapeOutMoadl" 
            :mask-closable="false"
            width=350
            @on-ok="tapeOutBtn"
            @on-cancel="tapeOutBtn">
             <p slot="header" style="color:#f60;text-align:center">
                <span>鲁班客服提示:</span>
            </p>
            <p class="title">您的账号已在其他地方登陆~</p>
        </Modal>

        <!-- 新版本更新提示 -->
        <Alert banner type="success" class="updateVersion" v-if="isVersion">
            很高兴的通知您,我们网站刚刚发布了新版本! 为了保证您的正常使用,我们需要您立即保存当前的工作,然后刷新页面。非常感谢您的配合!
            <Button type="primary" size="small" @click="reload">刷新</Button>
        </Alert>
        <audio id="warning-tone" muted>
            <source src="https://www.lubankf.com/uploads/video/audio.mp3"></source>
        </audio>

        <!-- 客服账号试用期到期提醒 -->
        <expire-modal @loginOut='tapeOutBtn'></expire-modal>
    </div>
</template>
<script>
    import '../static/font/iconfont.js'; 
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars';
    import expireModal from '@/views/my-components/expire-modal/expire-modal';
    import { mapState } from 'vuex';
    import { userLogout, getVersion } from "@/libs/api";
    import {windowPopup, url, getUnreadTask} from '@/mixins/mixin';
    var step=0;
    export default {
        mixins:[windowPopup, url, getUnreadTask],
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            themeSwitch,
            scrollBar,
            expireModal
        },
        data () {
            return {
                shrink: false,
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                spinShow:true,
                lbMsg:{},  //左下角提醒消息
                isNewMsg:false, //有新消息
                timer:'',
                limit:1,
                showWindow:true,
                titleTimer:'',
                tapeOut:false,
                msgArry:[],  //收到的消息
                remindTimer:'',  //20秒未恢复 二次提醒
                serviceStatus:1,   //客服状态
                startTime:0,  //开始时间
                isVersion:false, //是否新版本
                openOneIndex:false,
            };
        },
        computed: {
            ...mapState({
                menuList: state => state.app.menuList,   //菜单列表
                pageTagsList: state => state.app.pageOpenedList,// 打开的页面的页面对象
                currentPath: state => state.app.currentPath,  //当前面包屑数组
                cachePage: state => state.app.cachePage,
                lang: state => state.app.lang,   
                menuTheme: state => state.app.menuTheme,   //主题
                userName: state => state.app.username,
                headIMg: state => state.app.headimg,
                // loadChat: state => state.app.isLoadChat
            })
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                var loginData = JSON.parse(sessionStorage.login_data);
                this.checkTag(this.$route.name);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            
            // 退出登录
            handleClickUserDropdown (name) {
                if (name === 'loginout') {
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    window.onbeforeunload=null;
                    window.removeEventListener('resize', this.scrollBarResize);
                    this.websock.close(3001)
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                if (!openpageHasTag) { 
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            },
            scrollBarResize () {
                // this.$refs.scrollBar.resize();
            },
            
            //初始化websocket
            initWebpack(){
                clearTimeout(this.timer)
                const wsuri = `wss://www.lubankf.com/websocket/?Access-Token=${this.$store.state.app.access_token}`;
                this.websock = new WebSocket(wsuri);
                this.websock.onopen = this.websocketopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onclose = this.websocketclose;
                this.websock.onerror = this.websocketerror;
            },

            //打开
            websocketopen(){
                this.heartBeat();
                this.getLubanVersion();
            },

            //socket 收到消息
            websocketonmessage(e,index){ 
                if(e.data == "pong" || !this.$store.state.app.access_token) return false;
                var msg = JSON.parse(e.data);
                var tag = true;
                //收到消息
                if (msg.type == "service" && this.$store.state.app.access_token){
                    //收到客户消息会弹出通知窗口
                    if(msg.task && msg.task.msgType != "system"){
                        msg.countDown = 15;
                        var obj = {};
                        obj = JSON.parse(JSON.stringify(msg));
                        this.msgArry.push(obj);
                        //存储收到的消息 - 15秒内未回复再次弹出提醒
                        if(this.msgArry.length==1){
                            this.msgCountDown();
                        }
                    }else if(msg.task && msg.task.fromUser == 1){
                    //收到自己的消息
                        tag = false;
                    }
                    if(tag) this.msgInfrom(msg, 'service');
                    //未打开聊天界面 - 增加菜单列表未读会话数
                    if(!this.$store.state.app.loadChatBox){
                        this.$store.commit('updatedUnreadMsg', this.$store.state.app.unreadMsg += 1);
                    }else{
                        this.$store.commit("setChatMsg",msg)
                    }
                }else if(msg.MsgId){
                    //消息发送状态
                    this.$store.commit("setChatMsg",msg);
                }else if(msg.type == "active"){
                    //客服在线状态
                    if(sessionStorage.login_data){
                        var d = JSON.parse(sessionStorage.login_data)
                        d.serviceStatus = msg.active;
                        sessionStorage.login_data = JSON.stringify(d);
                        this.serviceStatus = msg.active;
                    }
                }else if(msg.type == "inside"){
                    //收到同事消息
                    if(!this.$store.state.app.loadChatBox){
                    //未打开聊天界面
                        this.$store.commit('updatedUnreadMsg', this.$store.state.app.unreadMsg += 1);
                    }else{
                        this.$store.commit("setChatMsg",msg)
                    }
                    this.msgInfrom(msg, 'inside');
                }else if(msg.type == "temp_user_sign_in" || msg.type == "temp_user_leave" || msg.type == "refuse_invite"){
                    //temp_user_sign_in 用户进入页面
                    //temp_user_leave   用户离开页面
                    //refuse_invite     拒绝邀请会话
                    //实时访客消息
                    this.$store.commit("pushCallerData",msg);
                }else if(msg.type == "waiting" || msg.type == "cancel_waiting"){
                    //待接入用户                 
                    //待接入 - 客服领取消息
                    if(this.$store.state.app.openWaitaccess){
                        this.$store.commit("setWaitMsg",msg);
                    }else{
                        this.$store.commit("setChatMsg",msg)
                    }
                    return false;
                }else if(msg.type == "ticket" || msg.type == 'del_ticket' || msg.type == "system_message"){
                    //tickets           工单消息
                    //del_tickets       删除工单消息
                    //system_message    拉黑提醒
                    this.msgInfrom(msg, msg.type);
                }else if(msg.type){
                    //notice            收到预知消息
                    //systemEvaluation  用户评价消息
                    //new_chat          当前客服发出的消息  ==pc 自己发出的消息
                    //new_inside        当前客服发给同事的消息  ==pc 自己发出的消息
                    //close_task        会话超时关闭会话
                    //transfer          其他端转接客服 - 关闭此会话
                    //colleague_active  客服在线状态改变通知
                    //reader            会话已读
                    //sup_robot         机器人辅助回答消息
                    //set_top           会话置顶
                    if(msg.type == "new_chat" && msg.client == 'PC') return;
                    this.$store.commit("setChatMsg",msg)
                    return false;
                }  
                if(index){
                    this.msgArry.splice(index,1);
                }
            },

            msgInfrom(msg,type){
                //浏览器通知
                var obj={};
                obj=JSON.parse(JSON.stringify(msg));
                this.showNotification(obj,type);
                
                //网页左下角消息通知
                this.showWindowMsg(msg,type);

                //是否开启提示音 
                if(this.$store.state.app.audio){
                    var audio = document.getElementById('warning-tone');
                    audio.play();
                }
            },

            //关闭websocket
            websocketclose(event){  
                console.log("WebSocket关闭");
                //code=1000 - 账号在其他地方登陆 - 弹出提醒，清除session
                if(event && event.code == 1000){
                    this.tapeOut = true;
                    sessionStorage.removeItem("access_token");
                    return false;
                }
                if(sessionStorage.access_token) this.reconnection();
            },

            //websocket连接失败
            websocketerror(){  
                console.log("WebSocket连接失败");
                if(sessionStorage.access_token) this.reconnection();
            },
            
            //websocket断线重连
            reconnection() {
                var that = this;
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    that.initWebpack();
                }, 5000);
            },

            //websocket心跳
            heartBeat() {
                if(this.$store.state.app.access_token){
                    var that = this;
                    this.websock.send('ping');
                    var heartBeatTimeOut = setTimeout(() => {
                    that.heartBeat();
                    }, 20000);
                }
            },


            //收到消息15秒不回复 再次提醒，提醒后销毁此消息
            msgCountDown(){
                clearInterval(this.remindTimer);
                this.remindTimer = setInterval(()=>{
                    if(this.msgArry.length > 0){
                        this.msgArry.forEach((e,index) => {
                            if(e.countDown == -1){
                                this.msgArry.splice(index,1);
                                return false;
                            }
                            e.countDown -= 1;
                            if(e.countDown <= 0){
                                this.msgInfrom(e, 'again_inform');
                                this.msgArry.splice(index,1);
                            }
                        });
                    }else{
                        clearInterval(this.remindTimer);
                    }
                },1000)
            },

            //左下角消息提醒
            showWindowMsg(msg,type){
                if(type == 'ticket' || type == 'del_tickets' || type == 'system_message'){
                    this.isNewMsg = true; 
                    this.lbMsg = {
                        Content: msg.content,
                        title: msg.title,
                        ticketsId: msg.id,
                        headImg: `${url}statics/images/system_msg.png`,
                        type: type
                    }
                }else{
                    if(!msg || !msg.task) return;
                    this.isNewMsg = true;         
                    var mssg = this.msgSoure(msg, type);
                    this.lbMsg = {
                        taskToken: msg.taskToken,
                        colleague: type == 'inside' ? msg.identity.id : '',
                        Content: mssg.content,
                        title: mssg.title,
                        headImg: msg.headImg || `${url}statics/images/mini_program.png`,
                        type: type
                    }
                    this.flash_title();
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.isNewMsg = false;
                }, 3000);
            },

            //打开右下角通知新消息 - 隐藏所有弹出框
            openNewMsg(){
                //同事会话消息
                if(this.lbMsg.colleague){
                    this.$router.push({
                        path:`/chat?ts=${this.lbMsg.colleague}`,
                    })
                }else if(this.lbMsg.ticketsId){
                    //工单消息通知=
                    this.$router.push({
                        path:`/tickets?type=0&id=${this.lbMsg.ticketsId}`,
                    })
                    this.$store.commit('setTicketsId', this.lbMsg.ticketsId);
                }else if(this.lbMsg.type == 'system_message'){
                    //跳转黑名单
                    this.$router.push({
                        path: '/config/blacklist',
                    })
                }else{
                    this.$router.push({
                        path:`/chat?u=${this.lbMsg.taskToken}`,
                    })
                }
                this.isNewMsg = false;
                var showDrawer = document.querySelectorAll('.showDrawer');
                var imgModal = document.querySelectorAll('.imgModal');
                var tooltip = document.querySelectorAll('.ivu-tooltip-popper');
                if(showDrawer.length>0){
                    showDrawer.forEach((e, index) => {
                        e.style.display = "none";
                    })
                } 
                if(imgModal.length>0){
                    imgModal.forEach((e, index) => {
                        e.style.display = "none";
                    })
                }
                if(tooltip.length>0){
                    tooltip.forEach((e, index) => {
                        e.style.display = "none";
                    })
                }
            },

            //关闭通知消息
            closeInform(){
                this.isNewMsg = false;
            },

            mouseoverMsg(){
                clearTimeout(this.timer);
            },
            mouseoutMsg(){
                this.timer = setTimeout(() => {
                    this.isNewMsg = false;
                }, 3000);
            },
            windowResize(){
                let clientWidth = document.body.clientWidth;
                clientWidth>1351 ? this.shrink=false : this.shrink=true;
            },

            //页面标题闪烁提醒
            flash_title(){
                var myTitle = document.title.indexOf('~') > 0 ? document.title.split('~')[1] : document.title;
                if(!this.showWindow){
                    step++
                    if (step==3) {step=1}         
                    if (step==1) {document.title='【您有新的消息】 ~ ' + myTitle}
                    if (step==2) {document.title='【　　　　　　】 ~ ' + myTitle}
                    var titleTimer = setTimeout(() => {
                        this.flash_title();
                    },500);

                }else{
                    clearInterval(this.titleTimer);
                    document.title = myTitle.split('~')[0];
                }
            },

            //被挤 强制下线
            tapeOutBtn(){
                this.$store.commit('clearOpenedSubmenu');
                this.$store.commit('logout', this);
                window.onbeforeunload=null;
                window.removeEventListener('resize', this.scrollBarResize);
            },

            //版本
            getLubanVersion(){
                getVersion().then(res =>{
                    if(res.code == 0){
                        this.ajaxTime(true);
                        this.$store.commit("updateOnlineTime",res.online_time);
                        if(!sessionStorage.LUBAN_VERSION){
                            sessionStorage.LUBAN_VERSION = res.msg;
                        }else if(sessionStorage.LUBAN_VERSION != res.msg){
                            this.isVersion = true;
                            sessionStorage.LUBAN_VERSION = res.msg;
                        }
                    }else{
                        this.ajaxTime(false);
                    }
                }).catch(res => {
                    this.ajaxTime(false);
                    this.$store.commit("updateNetworkMS",0);
                })
            },


            checkNetWork() {
                var that = this;
                if(versionTimer) clearTimeout(versionTimer);
                var versionTimer = setTimeout(function() {
                    that.startTime = new Date();
                    that.getLubanVersion();
                }, 30000);
            },

            //网络状况
            ajaxTime(success){
                if (success) {
                    var delay = new Date().getTime() - this.startTime.getTime();
                    this.$store.commit("updateNetworkMS",delay);
                } 
                //100 满格   200少一格   500黄  1000
                this.checkNetWork();
            },

            //刷新
            reload(){
                location.reload();
            }

        },
        watch: {
            '$route' (to) {
                this.$Modal.remove();
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            },
            openedSubmenuArr () {
                setTimeout(() => {
                    this.scrollBarResize();
                }, 300);
            },
            //是否已加载会话列表
            // loadChat(){
            //     if(!this.openOneIndex && this.loadChat && sessionStorage.access_token){
                    // this.initWebpack();
                // }
            // }

        },
        beforeDestroy(){
            this.websock.close(3001);
        },
        mounted () {
            //连接websocket
            // if(this.$route.name != "home_index" && this.$route.name != "chatWrap" && sessionStorage.access_token){
                this.initWebpack();
                // this.openOneIndex = true;
            // }
            this.startTime = new Date();
            this.init();
            this.windowResize();
            var _this = this;
            window.addEventListener('resize', function(){
                this.scrollBarResize;
                _this.windowResize();
            });

            //是否打开此页面
            var hiddenProperty = 'hidden' in document ? 'hidden' :    
            'webkitHidden' in document ? 'webkitHidden' :    
            'mozHidden' in document ? 'mozHidden' :  null;
            var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            var onVisibilityChange = function(){
                if (!document[hiddenProperty]) {  
                    //页面激活  
                    _this.showWindow = true;   
                    _this.flash_title();
                }else{
                    _this.showWindow = false;      
                }
            }
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');

            //会话未读数  待接入数
            this.unreadCount();

            //来源， 上传类型 
            this.getLubanConfigInfo();

            //发送消息
            var that = this;
            //关闭或转接会话， 去除通知消息
            eventBus.$on('eventeSendMsg', function(data) {　
                that.msgArry.forEach((e,index) => {
                    if(e.taskToken == data){
                        // that.msgArry.splice(index,1);
                        that.msgArry[index].countDown = -1;
                    }
                })
            })
            window.onbeforeunload=function(e){  
                if(!that.$store.state.app.leaveWechat && sessionStorage.access_token){
                　　var e = window.event || e;  
                　　e.returnValue=("确定离开当前页面吗？");
                }   
                that.$store.commit('changeLeaveWechat',false);
            } 
        },
        dispatch () {
            window.removeEventListener('resize', this.scrollBarResize);
        }
    };
</script>
<style lang="less" scoped>
    .ivu-dropdown{
        margin-right:5px;
    }
    .msgDiog{
        cursor: pointer;
        transition:all .5s ease-out;
        position: fixed;
        bottom:10px;
        left:-340px;
        width:330px;
        height:97px;
        background:#fff;
        z-index:1000000000;
        border-radius:5px;
        box-shadow: 0 1px 2px 1px #ccd5d8;
        padding:14px 25px 14px 14px;
        .headImg{
            width:60px;
            height:100%;
            display: inline-block;
            float:left;
            img{
                width:60px;
                border-radius:30px;
            }
        }
        .content{
            width:220px;
            float:left;
            margin-left:10px;
            .title{
                font-size:16px;
                height:50px;
                overflow: hidden;
            }
            .txt>p{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .close{
            position: absolute;
            right:5px;
            top:5px;
            font-size:16px;
            cursor: pointer;
            &:hover{
                color:#2d8cf0;
            }
        }
    }
    .msgOut{
        transition:all .5s ease-out;
        left:10px;
    }
    .updateVersion{
        position: fixed;
        top:0;
        z-index: 9999;
        text-align:center;
        width:100%;
        button{
            margin-left:10px;
        }
    }
</style>
