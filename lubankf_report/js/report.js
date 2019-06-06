$(function(){
    var lbHOST = 'https://www.lubankf.com/',
        token = '',
        currentIndex = 0,
        taskDate = {      //会话报表日期
            startTime: formatDate(new Date(), "yyyy-MM-dd 00:00"), 
            endTime: formatDate(new Date(), "yyyy-MM-dd 23:59")
        }, 
        taskTendency = {}, //会话趋势   
        visitorDate = {   //访客统计日期
            startTime: formatDate(new Date(), "yyyy-MM-dd 00:00"),
            endTime: formatDate(new Date(), "yyyy-MM-dd 23:59")
        }, 
        evaluationDate = {//客服评价选择日期
            startTime: getMonthStartDate(),
            endTime: getMonthEndDate()
        },
        serviceStatus = [              //客服在线状态
            { label: '离线', value: '0' },
            { label: '空闲', value: '1' },
            { label: '忙碌', value: '2' },
            { label: '隐身', value: '3' },
            { label: '离开', value: '4' }
        ];


    var ajaxRequest = function(url, data, successCallback, errorCallback) {
		var params = {
			type: 'post',
            url: lbHOST + url,
            headers: {
                'app-Program': true
            },
            data: {},
			timeout: 10000,
			cache: false,
			success: successCallback,
			error: errorCallback
		};
		if (data) {
			params.data = data;
        }
        params.data = Object.assign(params.data,{'Access-Token': token})
		$.ajax(params);
    }

    var GetQueryString = function (name){
    　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    　　var r = window.location.search.substr(1).match(reg);
    　　if(r!=null)return unescape(r[2]);
        return null;
    }
    
    window.onload = function(){
        $('#user_defined_start_time').attr('data-year', nowYear);
        $('#user_defined_end_time').attr('data-year', nowYear);
        token = GetQueryString('token');
        $('.head_img>img').attr('src', GetQueryString('headImg') || "./image/logo.png")
        overview();
        chatMsgTrend();
    };

    //点击头像 传给RN
    $('.head_img_wrap').on('click',function(){
        window.postMessage('clickHead');
    })

    //tab
    $('.tab_item').on('click',function(){
        var index = $(this).index();
        currentIndex = index;
        $('.tab_item a').removeClass('current');
        $(this).find('a').addClass('current');
        $('.report_wrap').hide().eq(index).show();
        if(index == 0){
            overview();
            chatMsgTrend();
        }else if(index == 1){
            overview();
            visitorCharts();
        }else if(index == 2){
            getCountService();
            get_evaluation_data();
        }
    })
    
    //显示日期筛选
    $('.right_filtrate').on('click',function(){
        $('.filtrate, #mask').toggle();
    })

    $(document).on('click', '#mask', function(){
        $('#mask, .filtrate, .user_defined').hide();
    })


    //选择日期筛选
    $('.filtrate li').on('click',function(){
        var type = $(this).attr('data-type'),
            date = [],
            value = '今天';
        $('.filtrate, #mask').hide();
        switch (type) {
            case '1':
                date = [formatDate(new Date(), "yyyy-MM-dd 00:00"), formatDate(new Date(), "yyyy-MM-dd 23:59")];    
                value = '今天';
                break;
            case '2':
                date = [formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 00:00"), formatDate(new Date(new Date()-24*60*60*1000),"yyyy-MM-dd 23:59")];    
                value = '昨天';
                break;
            case '3':
                date = [getWeekStartDate(), getWeekEndDate()];    
                value = '本周';
                break;
            case '4':
                $('.user_defined, #mask').show();
                $('.start_time,.end_time').val('');
                break;
            default:
                break;
        }
        if(date.length > 0){
            dateParams(date, value);
        }
    })

    var dateParams = function(date, value){
        if(value){
            var str = value;
        }else{
            var str = date[0] + '至' + date[1];
        }
        if(currentIndex == 0){
            taskDate = {     //会话报表日期
                startTime: date[0], 
                endTime: date[1]
            }
            $('.task_report_date span').html(str);
            overview();
            chatMsgTrend();
        }else if(currentIndex == 1){
            visitorDate = {     //会话报表日期
                startTime: date[0],
                endTime: date[1]
            }
            $('.visitor_report_date span').html(str);
            overview();
            visitorCharts();
        }else if(currentIndex == 2){
            evaluationDate = {     //客服评价
                startTime: date[0],
                endTime: date[1]
            }
            $('.service_resource_date span').html(str);
            get_evaluation_data();
        }

    }
    
    //会话概况
    var overview = function(){
        var params = taskDate;   
        if(currentIndex == 1){
            params = visitorDate;
        }
        $('#mask,#loading').fadeIn();
        ajaxRequest('api/report/overview.htm', params, function(res){
            $('#mask,#loading').fadeOut();
          if(res.code == 0){
              var msg = res.data[0];
              $('.task_report_item_1').html(msg.msgTotalNum);
              $('.task_report_item_2').html(msg.avgSignInTime);
              $('.task_report_item_3').html(msg.avgTalkTime);
              $('.visitor_report_item_1').html(msg.totalUser);
              $('.visitor_report_item_2').html(msg.effectiveUser);
              $('.visitor_report_item_3').html(msg.view_count);
          }else{
            showNotice(res.msg);
          }
        })
    }


     //会话趋势
    var chatMsgTrend = function(){
        $('#mask,#loading').fadeIn();
        ajaxRequest('api/report/im-data-trend.htm', Object.assign(taskTendency, taskDate), function(res){
            $('#mask,#loading').fadeOut();
            if(res.code == 0){
                var msg = res.data;
                var dom = document.getElementById("task_container");
                taskCharts(dom, msg.lineKey, msg.lineValue);
            }else{
                showNotice(res.msg);
            }
        })
    }
    

    //会话趋势 小时， 天， 月
    $('.task_qs_item').on('click',function(){
        $('.task_qs_item').removeClass('current_task_date');
        $(this).addClass('current_task_date');
        taskTendency = {
            format: $(this).attr('data-type')
        }
        chatMsgTrend();
    })
    
    //加载 折线图
    var taskCharts = function(dom, key, value){
        var myChart = echarts.init(dom, 'macarons');
        option = null;
    
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                // orient: 'horizontal',
                // x: 'center',
                // data: this.resData.bingKey0
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: key
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            dataZoom: [
                {
                    start: 0,
                    end: 50
                }, 
                {
                    type: 'inside'
                }
            ],
            grid:{
                left: 40,
                right:0,
            },
            series: value
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    
    
        window.onresize = function () {
            myChart.resize(); //使第一个图表适应
        }
    }


    //加载访客统计
    var visitorCharts = function(){
        $('#mask,#loading').fadeIn();
        ajaxRequest('api/report/im-report-analyse.htm', visitorDate, function(res){
            $('#mask,#loading').fadeOut();
            if(res.code == 0){
                var msg = res.data;
                var dom = document.getElementById("charts_container");
                taskCharts(dom, msg.zhuKey, msg.zhuValue);
            }else{
                showNotice(res.msg);
            }
        })
    }



    //客服评价 - 客服资源
    var getCountService = function(){
        ajaxRequest('api/report/count-service.htm',{}, function(res){
            if(res.code == 0){
                var str = '';
                res.data.forEach(function(e, index){
                    str += "<div class='service_status_total_list'>\
                                <span class='count'>"+ e.num +"</span>\
                                <div class='active_wrap'>\
                                    <img src='/image/kf_status_"+ index +".png' />\
                                    <span class='active'>"+ e.active +"</span>\
                                </div>\
                            </div>";
                })
                $('.service_status_total').html(str);
            }else{
                showNotice(res.msg);
            }
        })
    }

    //客服评价 - 客服列表统计
    var get_evaluation_data = function(){
        $('#mask,#loading').fadeIn();
        ajaxRequest('api/report/kefu-evaluation-data.htm', evaluationDate, function(res){
            $('#mask,#loading').fadeOut();
            if(res.code == 0){
                var str = '';
                res.data.forEach(function(e, index){
                    str += "<div class='service_list'>\
                                <div class='service_info'>\
                                    <div class='service_item agent'>\
                                        <div class='username'>"+ e.username +"</div>\
                                        <div class='total'>总计: "+ e.total +"</div>\
                                    </div>\
                                    <div class='service_item chat_limit'>\
                                    <div class='task_count'>\
                                        <div class='count'>"+ e.task.service_num +"</div>\
                                        <div class='total'>当前对话</div>\
                                    </div>\
                                    <div class='task_count'>\
                                        <div class='count'>"+ e.task.max_service_num +"</div>\
                                        <div class='total'>最大接待</div>\
                                    </div>\
                                    </div>\
                                    <div class='service_item agent_status'>\
                                    <img src='/image/kf_status_"+ e.onlines +".png' />\
                                    <text>"+ serviceStatus[e.onlines].label +"</text>\
                                    </div>\
                                </div>\
                                <ul class='eavluation'>\
                                    <li>无评价: "+ e.no_pj +"</li>\
                                    <li>好评: "+ e.pj0 +"</li>\
                                    <li>中评: "+ e.pj1 +"</li>\
                                    <li>差评: "+ e.pj2 +"</li>\
                                </ul>\
                            </div>";
                })
                $('.service_list_wrap').html(str);
            }else{
                showNotice(res.msg);
            }
        })
    }


    var showNotice = function(msg){
        $('#notice').remove();
        clearTimeout(timer);
        var n = '<div id="notice">'+ msg +'</div>';
        $('body').append(n);
        var timer = setTimeout(() => {
            $('#notice').remove();
        }, 1500);
    }







    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay();         //今天本周的第几天     
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();


    /**
     * 获取本周、本季度、本月、上月的开始日期、结束日期
     */

    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
    }

    //获得某月的天数
    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }

    //获得本周的开始日期     
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        return formatDate(weekStartDate);
    }

    //获得本周的结束日期     
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
        return formatDate(weekEndDate);
    }

    //获得本月的开始日期
    function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }

    //获得本月的结束日期
    function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDate(monthEndDate);
    }


    //自定义开始日期
    new Mdate("user_defined_start_time", {
        acceptId: "user_defined_start_time",
        beginYear: '2018',
        beginMonth: nowMonth,
        beginDay: nowDay,
        endYear: "2100",
        // endMonth: "1",
        // endDay: "1",
        format: "-"
    })

    //自定义结束日期
    new Mdate("user_defined_end_time", {
        acceptId: "user_defined_end_time",
        beginYear: '2018',
        beginMonth: nowMonth+1,
        beginDay: nowDay,
        endYear: "2100",
        format: "-"
    })

    //自定义时间 - 取消
    $('.user_defined .cancel').on('click',function(){
        $('.user_defined, #mask').hide();
    })

    //自定义时间 - 确定
    $('.user_defined .sure').on('click',function(){
        var stime = $('.user_defined .start_time').val();
        var etime = $('.user_defined .end_time').val();
        var date = [stime, etime];
        if(stime == '') stime = etime;
        if(etime == '') etime = stime;
        dateParams(date);
        $('.user_defined, #mask').hide();
    })

})