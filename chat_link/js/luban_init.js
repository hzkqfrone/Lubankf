var lbHOST = 'https://www.lubankf.com/';
var luban_config = {
    chatPage: lbHOST +'luban.html',
    pageUrl: 'https://cdn.lubankf.com/chat_link/',
    // pageUrl: './',
    companyConfigUrl: lbHOST + 'api/website/web-site/get-info.htm',
    urlTitle:encodeURIComponent(document.title),
    fromUrl: encodeURIComponent(window.location.href),  //来源页面
    location: window.location.host,
    accessId: '',
	encrypt: '',
	parentUrl: document.referrer || '',   // 获取真实来路 上级页面
	source: '',  // 搜索来源
	seoKeyword: '',  // 搜索关键字
	lubanURL: lbHOST,
	webChat: 'api/website/web-site/chat.htm',       //点击聊天窗口发起会话
	init_lubankf: "api/website/web-site/sign-in-chat.htm",
	socketUrl: 'wss://www.lubankf.com/socket/',
	sendChatURL: 'api/website/web-site/chat.htm',
	leaveUrl: 'api/website/web-site/leave.htm',
	upload_image: 'api/website/web-site/upload-image.htm',
	upload_file: 'api/website/web-site/upload-file.htm',
	lubMsg_foresee:'api/website/web-site/notice.htm',
	lub_evaluation:'api/website/web-site/evaluation.htm',
	lub_robotFeed:"api/website/web-site/feed-back.htm"
};
var chatInitData = undefined;
var initIm = new initIm();
var utils = {
	broswer: {
		IE6: 'msie 6',
		IE7: 'msie 7',
		IE8: 'msie 8',
		IE9: 'msie 9',
		IE10: 'msie 10',
		IE11: 'msie 11',
		Chrome: 'chrome',
		Firefox: 'firefox',
		Opera: 'opera',
		Safari: 'safari',
		Netscape: 'netscape'
	},

	isFromMobile: function() {
		var agent = navigator.userAgent.toLowerCase();
		var ipad = agent.match(/(ipad).*os\s([\d_]+)/),
			isIphone = !ipad && agent.match(/(iphone\sos)\s([\d_]+)/),
			isAndroid = agent.match(/(android)\s+([\d.]+)/),
			isWinPhone = agent.match(/(windows mobile)\s+([\d.]+)/),
			isMobile = ipad || isIphone || isAndroid || isWinPhone;
		return isMobile;
	},

	getBroswer: function() {
		var defaultBroswer = 'netscape',
			agent = navigator.userAgent.toLowerCase();
		if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.*])/.test(agent)) {
			var name = RegExp.$1,
				versionNum = parseInt(RegExp.$2);
			(defaultBroswer = name), 'msie' == name && (defaultBroswer += ' ' + versionNum);
		} else /version\D+(\d[\d.]*).*safari/.test(agent) && (defaultBroswer = 'safari');

		return defaultBroswer;
	},

	getCookie: function(key) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split('; ');
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split('=');
			if (arr[0] == key) return arr[1];
		}
		return '';
	},
	setCookie: function(obj, value, exp, domain) {
		var cookieTime = 24 * 60 * 60 * 1000;
		if (exp && exp != 'session') {
			cookieTime = cookieTime * exp;
		}
		var d = new Date();
		d.setTime(d.getTime() + cookieTime);
		var cookieExpires = '; expires=' + d.toGMTString();
		var domainStr = '';
		if (domain && domain != undefined) {
			domainStr = '; domain=' + domain;
		}

		if ('string' == typeof obj) {
			document.cookie =
				obj +
				'=' +
				encodeURIComponent(value) +
				(exp == 'session' ? '' : cookieExpires) +
				domainStr +
				'; path=/';
		} else {
			for (var key in obj) {
				document.cookie =
					key +
					'=' +
					encodeURIComponent(obj[key]) +
					(exp == 'session' ? '' : cookieExpires) +
					domainStr +
					'; path=/';
			}
		}
	},
	isIE: function(ver) {
		var b = document.createElement('b');
		b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
		return b.getElementsByTagName('i').length === 1;
	},
	parseQuerystring : function (queryStr) {
		if ('string' != typeof queryStr)return {};
		var queryStr = queryStr.trim();
		if ('' === queryStr)return {};

		var json = {};
		try {
			for (var pairs = queryStr.split('&'), i = 0; i < pairs.length; i++) {
				var kv = pairs[i].split('=');
				kv[0] && kv[1] && (json[kv[0]] = decodeURIComponent(kv[1]))
			}
		} catch (e) {

		}
		return json;
	},
	getAccessId: function () {
		var href = window.location.href;
		var queryStr = href.substr(href.indexOf("?") + 1);
		if ("string" != typeof queryStr)return {};
		if ("" === queryStr)return {};

		var json = {};
		try {
			for (var pairs = queryStr.split("&"), i = 0; i < pairs.length; i++) {
				var kv = pairs[i].split("=");
				kv[0] && kv[1] && (json[kv[0]] = decodeURIComponent(kv[1]))
			}
		} catch (e) {

		}
		luban_config.accessId = json.accessId;
		initIm.initChat();
	}

};
utils.getAccessId();

function initIm() {
	this.initChat = function () {
		var url = luban_config.companyConfigUrl+'?appToken='+luban_config.accessId+'&location='+ encodeURIComponent(window.location.host) +'&callbackF=getChatConfig';
		$('head').append('<script src='+ url +'></script>');
	}

	this.loadAdvConfig = function () {
		var chatBox = $('.lub_msg_content');
		if (chatInitData.advConfig && chatInitData.advConfig.windowType === 'common' && !utils.isFromMobile()) {
			var davType = chatInitData.advConfig.advType; // 广告弹窗的类型 1：右侧有广告； 2： 两边都有广告： 3：左边有广告； 4： 两边都没广告
			if (davType == '1' ) {
					chatBox.css.marginLeft = '169px';
			} else if (davType == '3') {
					chatBox.css.marginRight = '169px'
			} else if (davType == '2') {
				chatBox.css.margin = '0 169px'
			} else if (davType == '4') {
				chatBox.css.margin = '0'
			}
		} 
	}

	
	this.openChatTodo = function () {
		if (utils.isFromMobile() && (utils.isIE(5) || utils.isIE(6) || utils.isIE(7) || utils.isIE(8))) {
		  window.alert('在线咨询不兼容当前浏览器版本, 请升级ie浏览器或使用其他浏览器')
		  return
		}
		if (utils.isIE(5) || utils.isIE(6) || utils.isIE(7)) {
		  window.alert('在线咨询不兼容当前浏览器版本, 请升级ie浏览器或使用其他浏览器')
		  return
		}
	
		// 移动端打开手机页面的时候点返回按键的直接跳出页面的问题处理
		if (utils.isFromMobile() && history.pushState && !navigator.userAgent.indexOf('baidubrowser') > -1) {
		  history.pushState({}, null, '')
		}
		
		var obj = {href: window.location.href}
		// 保存在同域名下的cookie下
		if (!utils.getCookie('href')) {
		  utils.setCookie(obj, '', 'session')
		}
		utils.setCookie('LUBAN_accessId_' + luban_config.accessId, luban_config.accessId)
		this.loadAdvConfig();
		initChatStyle();
		try {
			initChat();
		} catch (error) {

		}
	}
}
window.getChatConfig = function (c) {
	if(c.code == 0){
		chatInitData = c.data;
		luban_config.encrypt = chatInitData.encrypt;
		initIm.openChatTodo();
	}
};

//样式初始化
function initChatStyle() {
	var styleColor = chatInitData.cssStyle.styleColor;
	if (styleColor && styleColor != undefined && styleColor != 'undefined') {
		$('.lub_head').css('background-color', styleColor);
		$('.lub_send_btn').css('background-color', styleColor);
		$('head').append('<style>#lub_service_wrap .chat_customer .chat_msg{background-color:' + styleColor + ';}' +
			'#lub_service_wrap .chat_customer .angle{border-left-color:' + styleColor + '}'+
			'.lub_chat_modal,.lub_chat_modal .lub_hint a,#lub_preview{border-color:'+ styleColor +'}'+
			'.lub_chat_modal .lub_hint a.cancel_close{color:'+ styleColor +'}'+
			'.lub_chat_modal .lub_hint a.sure_close,#lub_service_wrap .lub_send_btn{background-color:'+ styleColor +'}'+
			'#more_chat_log,#lub_end_chat i,#lub_textarea_wrap,#lub_service_wrap .artificial{color:'+ styleColor +'}#leave_btn,#evaluation_btn{background-color:'+ styleColor +'}'+
			'#lub_preview .iconWrap li.selectPreview{border-color:'+ styleColor +'}</style>');
	}
}

var getSeoParams = function () {
	if (luban_config.parentUrl == '') {
		luban_config.source = '站内'
		luban_config.seoKeyword = ''
	} else {
		var host = ''
		if (luban_config.parentUrl) {
			host = luban_config.parentUrl.split('/')[2]
		}
		if (host == 'www.baidu.com') {
			luban_config.source = '百度搜索'
			if (luban_config.parentUrl.indexOf('?') > 0) {
				var query_arr = luban_config.parentUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'wd') {
						luban_config.seoKeyword = temp[1]
					}
				})
			}
		} else if (host == 'm.baidu.com') {
				luban_config.source = '百度搜索'
				if (luban_config.parentUrl.indexOf('?') > 0) {
						var query_arr = luban_config.parentUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'word') {
										luban_config.seoKeyword = temp[1]
								}
						})
				}
		} else if (host == 'www.so.com') {
			luban_config.source = '360搜索'
			if (luban_config.parentUrl.indexOf('?') > 0) {
				var query_arr = luban_config.parentUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'q') {
						luban_config.seoKeyword = temp[1]
					}
				})
			}
		}else if (host == 'm.so.com') {
				luban_config.source = '360搜索'
				if (luban_config.parentUrl.indexOf('?') > 0) {
						var query_arr = luban_config.parentUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'q') {
										luban_config.seoKeyword = temp[1]
								}
						})
				}
		} else if (host == 'www.sogou.com') {
			luban_config.source = '搜狗搜索'
			if (luban_config.parentUrl.indexOf('?') > 0) {
				var query_arr = luban_config.parentUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'query') {
						luban_config.seoKeyword = temp[1]
					}
				})
			}
		}else if (host == 'm.sogou.com') {
				luban_config.source = '搜狗搜索'
				if (luban_config.parentUrl.indexOf('?') > 0) {
						var query_arr = luban_config.parentUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'keyword') {
										luban_config.seoKeyword = temp[1]
								}
						})
				}
		} else if (host == window.location.host) {
			luban_config.source = '站内'
			luban_config.seoKeyword = ''
		} else {
			luban_config.source = '其他网站'
			luban_config.seoKeyword = '未知'
		}
	}
}
getSeoParams()





