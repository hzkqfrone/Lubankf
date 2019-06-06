import axios from 'axios' //引用axios
import Cookies from 'js-cookie'; 
import {router} from '../router/index';
import qs from 'qs';
import store from '@/store/index.js'

// axios 配置
axios.defaults.timeout = 10000;
// axios.defaults.withCredentials = true;     //设置header请求携带cookie
axios.defaults.baseURL = "https://www.lubankf.com/"; //设置请求域名

// http request 拦截器，通过这个可以把Cookie传到后台
axios.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type':'application/x-www-form-urlencoded', //设置跨域头部
        };

        var params = "";
        let access_token = store.state.app.access_token;
        params = `Access-Token=${access_token}`;
        if (access_token) {
            if(config.data!=""){
                config.data = `${config.data}&${params}`;
            } else{
                config.data = params;
            }
        }


        return config;
    },
    err => {
        return Promise.reject(err);
    }
);


// http response 拦截器
axios.interceptors.response.use(
    response => {
        //response.data.errCode是接口返回的值，如果值为-1，说明Cookie丢失，然后跳转到登录页，
        //-2 为无权限
        //-3 账号试用期到期
        if(response.data.code == -1) {
            store.commit('logout', this);
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }else if(response.data.code == -2){
            //无权限跳到首页
            router.push({
                path: '/home'
            })
        }else if(response.data.code == -3){
            //试用期到期提醒
            store.commit('updateResponse', true);
            return
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    }
);

export default axios;

/**
 * get 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        var par = Object.assign(params,{'Access-Token':store.state.app.access_token})
        axios.get(url, {
            params: par
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data))
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
    })
}


