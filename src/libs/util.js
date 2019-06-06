// export default util;
import axios from 'axios';
import env from '../../build/env';
import http from './http';
import lazyLoading from './lazyLoading.js';

let util = {

};
util.title = function (title) {
    title = title || '鲁班客服';
    window.document.title = title;
};
function padLeftZero (str) {
    return ('00' + str).substr(str.length)
}

const ajaxUrl = env === 'development'
    ? '/src/data'
    : env === '/src/data'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});


util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && itAccess.isArray()) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    let routerObj = {};
    routers.forEach(item => {
        if (item.name === 'otherRouter') {
            item.children.forEach((child, i) => {
                if (child.name === name) {
                    routerObj = item.children[i];
                }
            });
        } else {
            if (item.children.length === 1) {
                if (item.children[0].name === name) {
                    routerObj = item.children[0];
                }
            } else {
                item.children.forEach((child, i) => {
                    if (child.name === name) {
                        routerObj = item.children[i];
                    }
                });
            }
        }
    });
    return routerObj;
};

util.handleTitle = function (vm, item) {
    return item.title;
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/initial',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if(currentPathObj){
            if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
                currentPathArr = [];
            } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
                // console.log(currentPathObj)
                currentPathArr = [
                    {
                        title: currentPathObj.title,
                        path: currentPathObj.children[0].path,
                        name: name
                    }
                ];
            } else {
                let childObj = currentPathObj.children.filter((child) => {
                    return child.name === name;
                })[0];
                currentPathArr = [
                    // {
                    //     title: currentPathObj.title,
                    //     path: '',
                    //     name: currentPathObj.name
                    // },
                    {
                        title: childObj.title,
                        path: childObj.path,
                        name: name
                    }
                ];
            }
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    if (vm.$store === undefined) {
        return;
    }
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }

    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children && item.children.length > 0) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children && tag.children.length > 0 ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
};
util.initRouter = function (vm) {
    var constRoutes = [];
    var otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];
    // 获取菜单列表
    var _this = this;
    http.post('api/settings/sys/get-menu.htm').then(res => {
        res = res.data;
        if(res.code == 0){
            var menuData = res.data;
            menuData.forEach(e => {
                if(e.children){
                    if(e.children[0].children){
                        var obj = [];
                        e.children[0].children.forEach(v => {
                            obj.push(v.path.split("/config/")[1]);
                        })
                        vm.$store.commit('initMenu',obj);
                    }
                }
            });
            util.initRouterNode(constRoutes, menuData);
            util.initRouterNode(otherRoutes, otherRouter);
            // 添加主界面路由
            vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
            // 添加全局路由
            vm.$store.commit('updateDefaultRouter', otherRoutes);
            // 刷新界面菜单
            vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));

            let tagsList = [];

            vm.$store.state.app.routers.map((item) => {
                if (item.children.length <= 1) {
                    tagsList.push(item.children[0]);
                } else {
                    tagsList.push(...item.children);
                }
            });
            vm.$store.commit('setTagsList', tagsList);
        }else if(res.errorCode == -1){
            vm.$store.commit('logout');
        }else{
            this.$Message.warning(res.msg);
        }
    });
};

// 生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        // menu.component = import(`@/views/${menu.component}.vue`);
        menu.component = lazyLoading(menu.component);
        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }
        routers.push(menu);
    }
};

export default util;
