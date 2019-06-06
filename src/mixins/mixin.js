import { deleteCustom, getLuBanCofig, getAccessList, getFilServiceList, getServiceGroup, getUnreadTaskApi } from '@/libs/api';

export const url = "https://www.lubankf.com/";

//图片上传超出指定大小限制时的钩子
export const beyondSize = {
    methods:{
        exceededSize(file){
            this.$Notice.warning({
                title: '图片大小不能超过10M！'
            });
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '不支持该文件类型'
            });
        },
        //上传文档成功
        uploadSuccess(response,file,fileList){
            this.details = response.data;
            this.$Notice.success({
                title: '上传成功'
            });
        },
        //上传文档失败
        uploadError(){
            this.$Notice.error({
                title: '上传失败'
            });
        },
    }
}


export const getNowFormatDate = {
    methods:{
         //消息时间
         getNowFormatDate() {
            var date = new Date(),
            h = date.getHours() < 9 ? "0" + date.getHours() : date.getHours(),
            m = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes();
            var currentdate = h + ":" + m
            return currentdate;
        },
    }
}




//浏览器通知消息
export const windowPopup = {
    methods:{
        //
        showNotification(msg,type){
            var that = this;
            var Notification = window.Notification || window.mozNotification || window.webkitNotification;
            // 判断浏览器是否支持桌面通知
            if(Notification){
                Notification.requestPermission(function(result){
                    //result 默认值'default'等同于拒绝 'denied' -用户选择了拒绝 'granted' -用户同意启用通知
                    if("granted" != result){
                        // alert('请授权浏览器能够进行通知!');
                        // return false;
                    }else{
                        var tag = "sds"+Math.random();
                        if(type == 'ticket' || type == 'del_ticket' || type == 'system_message'){
                            mssg = msg;
                            msg.headImg = 'https://www.lubankf.com/statics/images/system_msg.png'
                        }else{
                            var mssg = that.msgSoure(msg, type);
                        }
                        var notify = new Notification(
                            mssg.title,
                            {
                                dir:'auto',
                                lang:'zh-CN',
                                tag:tag,//实例化的notification的id
                                icon:msg.headImg || 'https://www.lubankf.com/statics/images/mini_program.png',//通知的缩略图,icon 支持ico、png、jpg、jpeg格式
                                title: mssg.title, //通知的标题
                                body: mssg.content //通知的具体内容
                            }
                        );
                        // 定义通知窗口点击函数
                        notify.onclick=function(){
                            //如果通知消息被点击,通知窗口将被激活
                            window.focus();
                            if(type == 'service'){
                                that.$router.push({
                                    path:`/chat?u=${msg.taskToken}`,
                                })
                            }else if(type == 'inside'){
                                that.$router.push({
                                    path:`/chat?ts=${msg.identity.id}`,
                                })
                            }else if(type == 'ticket'){
                                that.$router.push({
                                    path:`/tickets?type=0&id=${msg.id}`,
                                })
                            }else if(type == 'system_message'){
                                this.$router.push({
                                    path: '/config/blacklist',
                                })
                            }
                            setTimeout(() => {
                                notify.close();
                            }, 200);
                        };
                        // 定义通知错误事件
                        notify.onerror = function () {
                            console.log("error");
                        };
                        // 定义通知显示事件 可以设置多少秒之后关闭 也可以不设置关闭
                        notify.onshow = function () {
                            // 窗口显示3S后关闭
                                setTimeout(function(){
                                    notify.close();
                                },3000);
                        };
                        // 定义通知关闭事件
                        notify.onclose = function () {
            
                        };
                    }
                });
            }else{
                // 提示不支持系统通知
                alert('您的浏览器不支持系统通知,建议使用Chrome浏览');
            }         
        },


        msgSoure(msg, type){
            var title = "系统消息",
                content = "";
            if(msg.nickname){
                title = `【${msg.source_name}】的用户【${msg.nickname}】`;
            }
            if(msg.task.msgType == "image"){
                content = "[图片]";
            }else if(msg.task.msgType == "voice"){
                content = "[语音]"
            }else if(msg.task.msgType == "file"){
                content = "[文件]"
            }else if(msg.task.msgType == "video"){
                content = "[视频]"
            }else if(msg.task.msgType == "position"){
                content = "[位置]"
            }else if(msg.task.msgType == "systemEvaluation"){
                content = "[客户评价]"
            }else if(msg.task.msgType == "robot"){
                content = "[机器人]"
            }else{
                content = msg.task.Content;
            }
            if(type == 'again_inform'){   //15秒未回复再次提醒消息
                var t = '您有消息未回复';
            }else if(type == 'inside'){
                var t = `您有新的消息，来自于客服同事【${msg.identity.username}】`;
            }else{
                var t = '您有新的消息，来自于' + title;
            }
            return {title: t, content: content};
        }
    }
}




export const formDate = {
    methods:{
        p(s){
            return s < 10 ? '0' + s: s;
        },
        //本月
        getcurrent() {
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth()+1 <10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1;
            var current =currentYear+"-"+currentMonth;
            return current;
        },
        //上月
        getlastmonth() {
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth()+1;
            var lastMonth=new Date().getMonth();
            var prevCurrentYear=0;
            var prevCurrentMonth=0;
            if(currentMonth==0){
                prevCurrentYear=currentYear-1;
                prevCurrentMonth=12;
            }else{
                prevCurrentYear=currentYear;
                prevCurrentMonth=currentMonth-1;
            }
            var lastmonth=prevCurrentYear+"-"+prevCurrentMonth;
            return lastmonth;
        },

        //日期
        formatDate(date, fmt) {
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            }
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + ''
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
                }
            }
            return fmt
        },
        padLeftZero (str) {
            return ('00' + str).substr(str.length)
        }
    }
}
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay();         //今天本周的第几天     
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
export const formDate02 = {
    created(){

    },
    methods:{
        //本年
        //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
        getYear(type, dates) {
            var dd = new Date();
            var n = dates || 0;
            var year = dd.getFullYear() + Number(n);
            if (type == "s") {
                var day = year + "-01-01";
            };
            if (type == "e") {
                var day = year + "-12-31";
            };
            if (type == "p"){
                var day = year + "-" + nowMonth + "-" + nowDay;
            }
            if (!type) {
                var day = year + "-01-01/" + year + "-12-31";
            };
            return day;
        },

        p(s){
            return s < 10 ? '0' + s: s;
        },
        //本月
        getcurrent() {
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth()+1 <10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1;
            var currentDate=new Date().getDate() <10 ? `0${new Date().getDate()+1}` : new Date().getDate();
            var current =currentYear+"-"+currentMonth+'-'+currentDate;
            return current;
        },
        //上月
        getlastmonth() {
            var currentYear=new Date().getFullYear();
            var currentMonth=new Date().getMonth()+1;
            var lastMonth=new Date().getMonth();
            var currentDate=new Date().getDate()
            var prevCurrentYear=0;
            var prevCurrentMonth=0;
            if(currentMonth==0){
                prevCurrentYear=currentYear-1;
                prevCurrentMonth=12;
            }else{
                prevCurrentYear=currentYear;
                prevCurrentMonth=currentMonth-1;
            }
            var lastmonth=prevCurrentYear+"-"+prevCurrentMonth+"-"+currentDate;
            return lastmonth;
        },

        /**
         * 获取本周、本季度、本月、上月的开始日期、结束日期
         */

        //格式化日期：yyyy-MM-dd
        formatDate(date) {
            var myyear = date.getFullYear();
            var mymonth = date.getMonth()+1;
            var myweekday = date.getDate();

            if(mymonth < 10){
                mymonth = "0" + mymonth;
            }
            if(myweekday < 10){
                myweekday = "0" + myweekday;
            }
            return (myyear+"-"+mymonth + "-" + myweekday);
        },

        //获得某月的天数
        getMonthDays(myMonth){
            var monthStartDate = new Date(nowYear, myMonth, 1);
            var monthEndDate = new Date(nowYear, myMonth + 1, 1);
            var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
            return days;
        },

        //获得本季度的开始月份
        getQuarterStartMonth(){
            var quarterStartMonth = 0;
            if(nowMonth<3){
                quarterStartMonth = 0;
            }
            if(2<nowMonth && nowMonth<6){
                quarterStartMonth = 3;
            }
            if(5<nowMonth && nowMonth<9){
                quarterStartMonth = 6;
            }
            if(nowMonth>8){
                quarterStartMonth = 9;
            }
            return quarterStartMonth;
        },

        //获得本周的开始日期     
        getWeekStartDate() {      
            var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);     
            return this.formatDate(weekStartDate);     
        },     
            
        //获得本周的结束日期     
        getWeekEndDate() {      
            var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));      
            return this.formatDate(weekEndDate);     
        },    

        //获得本月的开始日期
        getMonthStartDate(){
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return this.formatDate(monthStartDate);
        },

        //获得本月的结束日期
        getMonthEndDate(){
            var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
            return this.formatDate(monthEndDate);
        },

        //获得上月开始时间
        getLastMonthStartDate(){
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            return this.formatDate(lastMonthStartDate);
        },

        //获得上月结束时间
        getLastMonthEndDate(){
            var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
            return this.formatDate(lastMonthEndDate);
        },

        //改变表格最后一行颜色
        rowClassName (row,index) {
            if(index == this.resData.length-1){
                return 'table-info-row';
            }
        }
    }
}


//筛选
export const filtrateData = {
    data(){
        return {
            visibleModal:false,     //显示筛选
            filIndex:1,
            filName:false,
            createfilName:'',   //自定义筛选名称
            filparams:{},       //筛选条件字段
            filData:[],         //自定义筛选列表
            custom_id:0,        //自定义筛选id
            createTaskTime:[],  //会话时间
            isedit:false,       //是否编辑列表
            relevanceList:[],   //关联列表
            // sourceInfo:[],      //渠道来源
            kfFilList:{},       //获取筛选客服列表
            kfGroup:[],         //技能组
        }
    },
    computed: {
        sourceInfo(){
            return this.$store.state.app.lubanConfg.TaskChannelList
        }
    },
    mounted() {
        this.accessList();     //来源渠道列表
    },
    methods:{
        //添加筛选条件
        addCondition(index){
            this.condition[index].status = 1;
        },

        //移除筛选条件
        delFilItem(index){
            this.condition[index].status = 0;
            this.initFiltrate('del');
        },

        //点击编辑筛选条件
        editFil(index){
            this.filIndex = 3;
        },

        //保存并筛选
        saveAndFiltrate(type){
            if(type == 'fil'){
                this.filName = true;
            }else if(type == 'save'){
                this.updateFil();
            }    
        },

        createFilItem(){
            if(!this.createfilName){
                this.$Notice.warning({title: '请填写自定义筛选名称'});
                return
            }
            this.params.page = 1;
            this.saveFil();
        },
        
        //初始化筛选列表
        initFilList(){
            this.isedit = false;
            this.condition.forEach((e, index) => {
                if(index < 7){
                    e.status = 1;
                }else{
                    e.status = 0;
                }
            })
        },

        //删除自定义筛选列表
        delFil(id){
            deleteCustom({custom_id: id}).then(res => {
                if(res.code == 0){
                    this.filIndex = 2;
                    this.filList();
                    this.$Notice.success({title: res.msg}); 
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //加载自定义筛选条件
        initFiltrate(type){
            if(!type){
                this.condition.forEach(e => {
                    e.status = 0;
                })
            }
            for(var i in this.filparams){
                for(var m in this.condition){
                    if(type == "del"){
                        if(i == this.condition[m].value && this.condition[m].status == 0){
                            delete this.filparams[i];
                        }
                    }else{
                        if(i == this.condition[m].value){
                            this.condition[m].status = 1;
                        }
                    }
                }
            }
        },

        //接入关联列表 - 获取当前账号绑定的所有应用
        accessList(){
            getAccessList().then(res => {
                if(res.code == 0){
                    this.relevanceList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        // //获取公共配置信息
        // //来源信息 pc、小程序、公众号
        // getConfigInfo(){
        //     getLuBanCofig().then(res => {
        //         if(res.code == 0){
        //             this.AllowExtensions = res.data.AllowExtensions;   //上传支持的文件类型
        //             this.sourceInfo = res.data.TaskChannelList;
        //         }else{
        //             this.$Notice.error({title: res.msg});
        //         }
        //     })
        // },

        //获取筛选客服列表
        getFilService(){
            getFilServiceList().then(res => {
                if(res.code == 0){
                    this.kfFilList = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取技能组列表
        getKfGroup(){
            getServiceGroup().then(res => {
                if(res.code == 0){
                    res.data.unshift({id:0,name:'默认分组'});
                    this.kfGroup = res.data;
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        }

    }
}



//获取未读消息数
export const getUnreadTask = {
    methods: {
        unreadCount(){
            getUnreadTaskApi().then(res => {
                if(res.code == 0){
                    this.$store.commit('updatedUnreadMsg', res.data.total_view); //未读会话消息总数
                    this.$store.commit("updatedWaitNum",res.data.waiting_view); //待接入消息总数
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },

        //获取公共配置信息
        //来源信息 pc、小程序、公众号
        getLubanConfigInfo(){
            getLuBanCofig().then(res => {
                if(res.code == 0){
                    this.$store.commit('setLubanConfig', res.data);
                }else{
                    this.$Notice.error({title: res.msg});
                }
            })
        },
    },
}
