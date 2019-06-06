import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录',
        keepAlive: true
    },
    component: () => import('@/views/login.vue')
};

export const registerRouter = {
    path: '/register',
    name: 'register',
    meta: {
        title: 'register - 注册'
    },
    component: () => import('@/views/register.vue')
};


export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: '/home',title: '首页', icon: '&#xe62c;', meta: {title: '鲁班客服 - 首页'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: '/config/wechat/autoreply/:token',title: '自动回复', icon: 'md-contacts', meta: {title: '设置 - 自动回复'}, name: 'autoreply', component: () => import('@/views/config/accredit/setting/autoreply.vue') },      
        { path: '/config/wechat/menu/:token',title: '微信自定义菜单', icon: 'md-contacts', meta: {title: '设置 - 微信自定义菜单'}, name: 'wechatMenu', component: () => import('@/views/config/accredit/setting/menu.vue') }, 
        { path: '/pro',title: '好友推荐', icon: 'md-contacts', meta: {title: '好友推荐'}, name: 'pro', component: () => import('@/views/home/pro.vue') },     
        { path: '/pay',title: '购买坐席', icon: 'md-contacts', meta: {title: '购买坐席'}, name: 'pay', component: () => import('@/views/my-components/pay/pay.vue') },  
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/',
    //     icon: '&#xe62c;',
    //     name: 'home',
    //     title: '首页',
    //     component: Main,
    //     children: [
    //         { path: '/home',title: '首页', icon: '&#xe62c;', meta: {title: '鲁班客服 - 首页'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe60e;',
    //     name: 'chat',
    //     title: '会话',
    //     component: Main,
    //     children: [
    //         { path: '/chat',title: '会话', icon: '&#xe60e;', meta: {title: '会话',keepAlive: true}, name: 'chatWrap', component: () => import('@/views/chat/chat.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe719;',
    //     name: 'access',
    //     title: '待接入',
    //     component: Main,
    //     children: [
    //         { path: '/waitaccess',title: '待接入', icon: '&#xe719;', meta: {title: '待接入',keepAlive: true}, name: 'waitaccess', component: () => import('@/views/waitaccess/waitaccess.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe60f;',
    //     name: 'caller',
    //     title: '实时访客',
    //     component: Main,
    //     children: [
    //         { path: '/caller',title: '实时访客', icon: '&#xe60f;', meta: {title: '实时访客'}, name: 'callerWrap', component: () => import('@/views/caller/caller.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe626;',
    //     name: 'leaveword',
    //     title: '留言',
    //     component: Main,
    //     children: [
    //         { path: '/leaveword',title: '留言', icon: '&#xe626;', meta: {title: '留言'}, name: 'leavewordWrap', component: () => import('@/views/leave-word/leaveword.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe643;',
    //     name: 'notifyMsg',
    //     title: '消息中心',
    //     component: Main,
    //     children: [
    //         { path: '/notify',title: '消息中心', icon: '&#xe643;', meta: {title: '消息中心'}, name: 'notifyWrap', component: () => import('@/views/notify/notify.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe66d;',
    //     name: 'history',
    //     title: '历史会话',
    //     component: Main,
    //     children: [
    //         { path: '/history',title: '历史会话', icon: '&#xe66d;', meta: {title: '历史会话'}, name: 'historyWrap', component: () => import('@/views/history/history.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe63f;',
    //     name: 'tickets',
    //     title: '工单',
    //     component: Main,
    //     children: [
    //         { path: '/tickets',title: '工单', icon: '&#xe63f;', meta: {title: '工单'}, name: 'ticketsWrap', component: () => import('@/views/tickets/tickets.vue') },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe65a;',
    //     name: 'customer',
    //     title: '顾客管理',
    //     component: Main,
    //     children: [
    //         { path: '/customer',title: '顾客管理', icon: '&#xe65a;', meta: {title: '顾客管理'}, name: 'customerWrap', component: () => import('@/views/customer/customer.vue') },   
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe611;',
    //     name: 'report',
    //     title: '数据统计',
    //     component: Main,
    //     children: [
    //         { 
    //             path: '/report',title: '数据统计', icon: '&#xe611;', meta: {title: '数据统计'}, name: 'reportWrap', component: () => import('@/views/report/report.vue'),
    //             children:[
    //                 { path: '/report/web/:type',title: '数据统计', meta: {title: '数据统计 - web应用数据分析'}, name: 'reportWrap', component: () => import('@/views/report/web.vue') },
    //                 { path: '/report/task',title: '数据统计', meta: {title: '数据统计 - 会话'}, name: 'taskReportWrap', component: () => import('@/views/report/task.vue') },
    //                 { path: '/report/taskTendency',title: '数据统计', meta: {title: '数据统计 - 会话趋势'}, name: 'taskTendencyWrap', component: () => import('@/views/report/taskTendency.vue') },
    //                 { path: '/report/eavluation',title: '数据统计', meta: {title: '数据统计 - 客服评价'}, name: 'eavluationWrap', component: () => import('@/views/report/eavluation.vue') },
    //             ]   
    //         },
    //     ]
    // },
    // {
    //     path: '/',
    //     icon: '&#xe610;',
    //     name: 'configWrap',
    //     title: '设置',
    //     component: Main,
    //     children: [
    //         {
    //             path: '/config',title: '设置', icon: '&#xe610;', meta: {title: '设置',keepAlive: true}, name: 'config', component: () => import('@/views/config/config.vue'),
    //             children:[
    //                 { path: '/config/wechat',title: '微信公众号接入', icon: 'md-contacts', meta: {title: '设置 - 微信公众号接入'}, name: 'config', component: () => import('@/views/config/accredit/wechat/wechat.vue') }, 
    //                 { path: '/config/program',title: '微信小程序接入', icon: 'md-contacts', meta: {title: '设置 - 微信小程序接入'}, name: 'config', component: () => import('@/views/config/accredit/program/program.vue') }, 
    //                 { path: '/config/website',title: '网站插件接入', icon: 'md-contacts', meta: {title: '设置 - 网站插件接入'}, name: 'config', component: () => import('@/views/config/accredit/pc/pc.vue') }, 
    //                 { path: '/config/weibo',title: '微博接入', icon: 'md-contacts', meta: {title: '设置 - 微博接入'}, name: 'config', component: () => import('@/views/config/accredit/weibo/weibo.vue') }, 
    //                 { path: '/config/workWechat',title: '企业微信接入', icon: 'md-contacts', meta: {title: '设置 - 企业微信接入'}, name: 'config', component: () => import('@/views/config/accredit/workWechat/workWechat.vue') }, 
    //                 { path: '/config/toutiao',title: '今日头条接入', icon: 'md-contacts', meta: {title: '设置 - 今日头条接入'}, name: 'config', component: () => import('@/views/config/accredit/toutiao/toutiao.vue') }, 
    //                 { path: '/config/website/style',title: '修改网站插件接入', icon: 'md-contacts', meta: {title: '设置 - 修改网站插件接入'}, name: 'config', component: () => import('@/views/config/accredit/pc/pcStyle.vue') },
    //                 { path: '/config/website/accessCode/:id',title: '网站插件接入', icon: 'md-contacts', meta: {title: '设置 - 网站插件接入代码'}, name: 'config', component: () => import('@/views/config/accredit/pc/accessCode.vue') },
    //                 { path: '/config/website/chatLink/:id',title: '聊天链接', icon: 'md-contacts', meta: {title: '设置 - 聊天链接'}, name: 'config', component: () => import('@/views/config/accredit/pc/chatLink.vue') },
    //                 { path: '/config/wechatInform',title: '微信消息通知', icon: 'md-contacts', meta: {title: '设置 - 微信消息通知'}, name: 'config', component: () => import('@/views/config/auth/wechatInform/wechatInform.vue') },
    //                 { path: '/config/programAuthor',title: '小程序授权登录', icon: 'md-contacts', meta: {title: '设置 - 小程序授权登录'}, name: 'config', component: () => import('@/views/config/auth/programAuthor/programAuthor.vue') },  
    //                 { path: '/config/pcAuthor',title: 'PC授权登录', icon: 'md-contacts', meta: {title: '设置 - PC授权登录'}, name: 'config', component: () => import('@/views/config/auth/pcAuthor/pcAuthor.vue') },
    //                 { path: '/config/me',title: '个人信息', icon: 'md-contacts', meta: {title: '设置 - 个人信息'}, name: 'config', component: () => import('@/views/config/service/me/me.vue') },  
    //                 { path: '/config/fastReply',title: '快捷回复', icon: 'md-contacts', meta: {title: '设置 - 快捷回复'}, name: 'config', component: () => import('@/views/config/service/fastReply/fastReply.vue') },
    //                 { path: '/config/service',title: '客服管理', icon: 'md-person', meta: {title: '客服管理'}, name: 'config', component: () => import('@/views/config/service/service/service.vue') },   
    //                 { path: '/config/roles',title: '角色列表', icon: 'md-contacts', meta: {title: '设置 - 角色列表'}, name: 'config', component: () => import('@/views/config/service/roles/roles.vue') },
    //                 { path: '/config/roles/add',title: '添加角色', icon: 'md-contacts', meta: {title: '设置 - 添加角色'}, name: 'config', component: () => import('@/views/config/service/roles/roles_add.vue') },
    //                 { path: '/config/tag',title: '添加角色', icon: 'md-contacts', meta: {title: '设置 - 标签管理'}, name: 'config', component: () => import('@/views/config/service/tag/tag.vue') },
    //                 { path: '/config/blacklist',title: '黑名单', icon: 'md-contacts', meta: {title: '设置 - 黑名单'}, name: 'config', component: () => import('@/views/config/service/blacklist/blacklist.vue') },
    //                 { path: '/config/ticketclassify',title: '黑名单', icon: 'md-contacts', meta: {title: '设置 - 工单分类'}, name: 'config', component: () => import('@/views/config/service/ticketclassify/ticketclassify.vue') },
    //                 { path: '/config/evaluation',title: '客服评价', icon: 'md-contacts', meta: {title: '设置 - 客服评价'}, name: 'config', component: () => import('@/views/config/service/evaluation/evaluation.vue') },
    //                 { path: '/config/invite',title: '会话邀请', icon: 'md-contacts', meta: {title: '设置 - 会话邀请'}, name: 'config', component: () => import('@/views/config/service/invite/invite.vue') },
    //                 { path: '/config/rule',title: '会话规则', icon: 'md-contacts', meta: {title: '设置 - 会话规则'}, name: 'config', component: () => import('@/views/config/service/rule/rule.vue') },
    //                 { path: '/config/sensitiveWord',title: '敏感词', icon: 'md-contacts', meta: {title: '设置 - 敏感词'}, name: 'config', component: () => import('@/views/config/service/sensitiveWord/sensitiveWord.vue') },
    //                 { path: '/config/robotSetup',title: '机器人设置', icon: 'md-contacts', meta: {title: '设置 - 机器人设置'}, name: 'config', component: () => import('@/views/config/robot/robotSetup/robotSetup.vue') },
    //                 { path: '/config/repository',title: '知识库', icon: 'md-contacts', meta: {title: '设置 - 知识库'}, name: 'config', component: () => import('@/views/config/robot/repository/repository.vue') },
    //                 { path: '/config/template',title: '知识模板库', icon: 'md-contacts', meta: {title: '设置 - 知识模板库'}, name: 'config', component: () => import('@/views/config/robot/template/template.vue') },
    //                 { path: '/config/template/detail',title: '知识模板详情', icon: 'md-contacts', meta: {title: '设置 - 知识模板详情'}, name: 'config', component: () => import('@/views/config/robot/template/detail.vue') },
    //                 { path: '/config/assign/:id',title: '指定客服', icon: 'md-contacts', meta: {title: '设置 - 指定客服'}, name: 'config', component: () => import('@/views/config/accredit/components/assign.vue') },
    //             ]
        
    //         },  
            
    //     ]
    // }   
];




// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    registerRouter,
    otherRouter,
    ...appRouter,
    page500,
];
