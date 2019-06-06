import {otherRouter, appRouter} from '@/router/router';
import { router } from '@/router/index';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
const app = {
    state: {
        LUBAN_URL: 'https://www.lubankf.com/',
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [], // 面包屑数组
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children],
        dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        jurisdiction: 0,
        chatMsgList: {},         //收到的消息
        audio: localStorage.audioS  || true,   //提示音
        leaveWechat: false,     //微信授权离开页面
        access_token: sessionStorage.access_token,
        unreadMsg: sessionStorage.LUBAN_COUNT ? (Number(sessionStorage.LUBAN_COUNT)<0 ? 0 : Number(sessionStorage.LUBAN_COUNT)) : 0,  //未读消息总数
        waitMsg: {},             //待接入消息
        waitMsgNum: sessionStorage.LUBAN_WAIT_CONUNT ? (Number(sessionStorage.LUBAN_WAIT_CONUNT)<0 ? 0 : Number(sessionStorage.LUBAN_WAIT_CONUNT)) : 0,  //待接入消息数量
        loadChatBox: false,      //是否打开聊天页
        networkMS: -1,           //网速
        serviceInfo: sessionStorage.login_data? JSON.parse(sessionStorage.login_data) : "",         //客服信息
        onlineTime: 0,           //在线时长
        openWaitaccess: false,   //是否打开待接入页
        username: sessionStorage.login_data ? JSON.parse(sessionStorage.login_data).username : "",  //用户名称
        headimg: sessionStorage.login_data ? JSON.parse(sessionStorage.login_data).headImg : "",    //用户头像
        callerData: {},         //实时访客用户信息
        isLoadChat: sessionStorage.LUBAN_LOAD_CHAT ? sessionStorage.LUBAN_LOAD_CHAT : false,        //是否打开了会话列表
        webUserInfo: {},        //web用户会话信息
        max_service_num: sessionStorage.login_data ? JSON.parse(sessionStorage.login_data).max_service_num : 0,  //最大接待人数
        LUBAN_auth: [],          //权限菜单
        lubanConfg: {},          //渠道， 文件类型， 来源头像
        systemTicketsMsgId: '',  //系统消息 - 工单消息
        isExpire: false,         //账号试用期到期提醒
    },
    mutations: {
        // 动态添加主界面路由，需要缓存
        updateAppRouter (state, routes) {
            state.routers.push(...routes);
            router.addRoutes(routes);
        },
        // 动态添加全局路由，不需要缓存
        updateDefaultRouter (state, routes) {
            router.addRoutes(routes);
        },
        // 设置打开过的标签页
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        // 接受前台数组，刷新菜单
        updateMenulist (state,routes) {   //routes 动态菜单
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (item.access !== undefined) {
                    if (Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList.concat(routes);
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        // 关闭页面
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        // 删除标签
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
         // 已打开页面缓存
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 关闭所有标签
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 关闭此页面外标签
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 设置打开默认页面
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        // 设置当前路径
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        // 设置当前页面名
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setjurisdiction(state,n){
            state.jurisdiction = n;
        },
        //收到新消息
        setChatMsg(state,msg){
            state.chatMsgList = msg;
        },

        //待接入消息
        setWaitMsg(state,msg){
            state.waitMsg = msg;
        },

        //开启 关闭 提示音
        updatedAudio(state,status){
            state.audio = status;
        },

        //离开页面
        changeLeaveWechat(state,status){
            state.leaveWechat = status;
        },

        //access_token
        setAccessToken(state,status){
            state.access_token = status;
        },

        //修改未读消息数
        updatedUnreadMsg(state,status){
            state.unreadMsg =  status>0 ? status : 0;
            sessionStorage.LUBAN_COUNT = status>0 ? status : 0;
        },

        //修改待接入数
        updatedWaitNum(state,status){
            state.waitMsgNum =  status>0 ? status : 0;
            sessionStorage.LUBAN_WAIT_CONUNT = status>0 ? status : 0;
        },

        //打开聊天页
        setLoadChatBox(state,status){
            state.loadChatBox = status;
        },

        //修改网速
        updateNetworkMS(state,status){
            state.networkMS = status;
        },

        //打开待接入页面
        updateOpenWaitaccess(state,status){
            state.openWaitaccess = status;
        },

        //更新客服名称
        updateUsername(state,status){
            state.username = status;
        },

        //更新客服头像
        updateHeadimg(state,status){
            state.headimg = status;
        },

        //实时访客用户信息
        pushCallerData(state,status){
            state.callerData = status;
        },

        //加载web用户会话信息
        setWebUserInfo(state,status){
            state.webUserInfo = status;
        },

        //加载了会话列表
        updateIsLoadChat(state,status){
            sessionStorage.LUBAN_LOAD_CHAT = status;
            state.isLoadChat = status;
        },

        //设置最大接待人数
        updatemax_service_num(state,status){
            state.max_service_num = status;
        },

        //用户信息更新
        updateUserInfo(state,status){
            state.serviceInfo = status;
            sessionStorage.login_data = JSON.stringify(state.serviceInfo);
        },

        //加载权限菜单
        initMenu(state,status){
            state.LUBAN_auth = status;
        },

        //渠道， 上传类型， 
        setLubanConfig(state, status){
            state.lubanConfg = status;
        },

        //系统消息 - 工单消息
        setTicketsId(state, status){
            state.systemTicketsMsgId = status;
        },

        //账号试用期到期提醒
        updateResponse(state, status){
            state.isExpire = status;  
        },

        updateOnlineTime(state,status){
            var theTime = parseInt(status);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if(theTime > 60) {
                theTime1 = parseInt(theTime/60);
                theTime = parseInt(theTime%60);
                if(theTime1 > 60) {
                    theTime2 = parseInt(theTime1/60);
                    theTime1 = parseInt(theTime1%60);
                }
            }
            // var result = ""+parseInt(theTime)+"秒";
            var result = "";
            if(theTime1 > 0) {
                result = ""+parseInt(theTime1)+"分";
            }
            if(theTime2 > 0) {
                result = ""+parseInt(theTime2)+"小时"+result;
            }
            state.onlineTime = result;
        },
    }
};

export default app;



