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
		var cookieTime = 24 * 60 * 60 * 1000 * 300000;
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

	aniMove: function (element, position, speed, callback) {
		if (!element.effect) {
			element.effect = {}
			element.effect.move = 0
		}
		clearInterval(element.effect.move)
		var speed = speed || 30
		var start = {
			left: element.offsetLeft,
			bottom: position.b,
			top: element.offsetTop,
			right: position.r
		}
		var style = element.style
		var parr = new Array()
		if (typeof(position.left) == 'number') {
			parr.push('left')
		}
		if (typeof(position.right) == 'number') {
			parr.push('right')
		}
		if (typeof(position.bottom) == 'number') {
			parr.push('bottom')
		}
		if (typeof(position.top) == 'number') {
			parr.push('top')
		}

		element.effect.move = setInterval(function () {
			for (var i = 0; i < parr.length; i++) {
				start[parr[i]] += (position[parr[i]] - start[parr[i]]) * speed / 100
				style[parr[i]] = start[parr[i]] + 'px'
			}
			for (var i = 0; i < parr.length; i++) {
				if (Math.round(start[parr[i]]) == position[parr[i]]) {
					if (i != parr.length - 1) {
						continue
					}
				} else {
					break
				}
				for (var i = 0; i < parr.length; i++) {
					style[parr[i]] = position[parr[i]] + 'px'
				}

				clearInterval(element.effect.move)
				if (callback) {
					callback()
				}
			}

		}, 5)
	},

	isIE: function(ver) {
		var b = document.createElement('b');
		b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
		return b.getElementsByTagName('i').length === 1;
	},

	
	chatBtnPosition: function () {
		var btn = document.getElementById('luban_chat_btn')
		var data = chatInitData
		var chatPos = {}
		if(data.cssStyle.onlineText){
			btn.getElementsByTagName('span')[0].innerText = data.cssStyle.onlineText;
		}
		if(data.cssStyle.chatboxIconType){
			utils.replaceChatIcon();
		}
		if (data.cssStyle.chatboxLocation) {
				btn.style.borderTopLeftRadius = '0px'
				btn.style.borderTopRightRadius = '0px'
				btn.style.borderBottomRightRadius = '0px'
				btn.style.borderBottomLeftRadius = '0px'
				btn.style.bottom = ''
				btn.style.padding = ''
		  if (data.cssStyle.chatButtonLocation == 'bottom-left') {
				btn.style.left = data.cssStyle.chatButtonSideMargin + 'px'
				btn.style.bottom = '-1px'
		  } else if (data.cssStyle.chatButtonLocation == 'bottom-right') {
				btn.style.right = data.cssStyle.chatButtonSideMargin + 'px'
				btn.style.bottom = '-1px'
		  } else if (data.cssStyle.chatButtonLocation == 'side-left') {
				btn.style.left = '-1px'
				btn.style.bottom = data.cssStyle.chatButtonBottomMargin + 'px'
				btn.style.borderBottomRightRadius = '5px'
				btn.style.borderTopRightRadius = '5px'
		  } else if (data.cssStyle.chatButtonLocation == 'side-right') {
				btn.style.right = '-1px'
				btn.style.bottom = data.cssStyle.chatButtonBottomMargin + 'px'
				btn.style.borderTopLeftRadius = '5px'
				btn.style.borderBottomLeftRadius = '5px'
		  } else if (data.cssStyle.chatButtonLocation == 'circle-left') {
				btn.style.left = data.cssStyle.chatButtonSideMargin + 'px'
				btn.style.bottom = data.cssStyle.chatButtonBottomMargin + 'px'
		  } else if (data.cssStyle.chatButtonLocation == 'circle-right') {
				btn.style.right = data.cssStyle.chatButtonSideMargin + 'px'
				btn.style.bottom = data.cssStyle.chatButtonBottomMargin + 'px'
		  }
		  if (data.cssStyle.chatButtonLocation == 'side-left' || data.cssStyle.chatButtonLocation == 'side-right') {
				btn.getElementsByTagName('i')[0].style.display = 'block'
				btn.style.padding = '10px 8px'
				btn.getElementsByTagName('span')[0].style.width = '16px'
				btn.getElementsByTagName('span')[0].style.display = 'inline-block'
		  } else if (data.cssStyle.chatButtonLocation == 'circle-right' || data.cssStyle.chatButtonLocation == 'circle-left') {
				btn.style.width = '55px'
				btn.style.height = '55px'
				btn.style.borderRadius = '55px'
				btn.style.padding = '15px'
				btn.getElementsByTagName('i')[0].style.margin = ''
				btn.getElementsByTagName('i')[0].style.width = '25px'
				btn.getElementsByTagName('i')[0].style.height = '25px'
				btn.getElementsByTagName('span')[0].innerHTML = ''
		  } else if (data.cssStyle.chatButtonLocation == 'bottom-left' || data.cssStyle.chatButtonLocation == 'bottom-right') {
				btn.style.borderTopLeftRadius = '5px'
				btn.style.borderTopRightRadius = '5px'
				btn.style.padding = '10px 8px'
		  }
		  chatPos = {
			'left': btn.style.left,
			'right': btn.style.right,
			'bottom': btn.style.bottom
		  }
		  return chatPos
		} else {
		  btn.style.right = '18px'
		  btn.style.padding = '8px 10px 8px 10px'
		  btn.style.borderTopLeftRadius = '5px'
		  btn.style.borderTopRightRadius = '5px'
		  btn.style.borderBottomRightRadius = '0px'
		  btn.style.borderBottomLeftRadius = '0px'
		}
	},

	replaceChatIcon: function(){
		var icon = ['&#xe622;','&#xe629;','&#xe615;','&#xe604;','&#xe6b7;','&#xe633;','&#xe625;','&#xe653;','&#xe631;','&#xe600;']
		var btnIcon = document.getElementById('luban_chat_btn').getElementsByTagName('i')[0]
		for(var i = 0;i < icon.length; i++){
			if(chatInitData.cssStyle.chatboxIconType == icon[i]){
				btnIcon.style.backgroundImage = 'url('+luban_config.pageUrl + 'images/btn_icon_'+ Number(i+1) +'.png)'
			}
		}
	}
};

var seoUrl = luban_config.referrer   // 获取真实来路
var seoSource = ''  // 搜索来源
var seoKeyword = ''  // 搜索关键字
var loaded = false
var openTimeout = 0
var openLUBKF = false

var getSeoParams = function () {
	if (seoUrl == '') {
		seoSource = '站内'
		seoKeyword = ''
	} else {
		var host = ''
		if (seoUrl) {
			host = seoUrl.split('/')[2]
		}
		if (host == 'www.baidu.com') {
			seoSource = '百度搜索'
			if (seoUrl.indexOf('?') > 0) {
				var query_arr = seoUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'wd') {
						seoKeyword = temp[1]
					}
				})
			}
		} else if (host == 'm.baidu.com') {
				seoSource = '百度搜索'
				if (seoUrl.indexOf('?') > 0) {
						var query_arr = seoUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'word') {
										seoKeyword = temp[1]
								}
						})
				}
		} else if (host == 'www.so.com') {
			seoSource = '360搜索'
			if (seoUrl.indexOf('?') > 0) {
				var query_arr = seoUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'q') {
						seoKeyword = temp[1]
					}
				})
			}
		}else if (host == 'm.so.com') {
				seoSource = '360搜索'
				if (seoUrl.indexOf('?') > 0) {
						var query_arr = seoUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'q') {
										seoKeyword = temp[1]
								}
						})
				}
		} else if (host == 'www.sogou.com') {
			seoSource = '搜狗搜索'
			if (seoUrl.indexOf('?') > 0) {
				var query_arr = seoUrl.split('?')[1].split('&')
				query_arr.forEach(function (query) {
					var temp = query.split('=')
					if (temp[0] == 'query') {
						seoKeyword = temp[1]
					}
				})
			}
		}else if (host == 'm.sogou.com') {
				seoSource = '搜狗搜索'
				if (seoUrl.indexOf('?') > 0) {
						var query_arr = seoUrl.split('?')[1].split('&')
						query_arr.forEach(function (query) {
								var temp = query.split('=')
								if (temp[0] == 'keyword') {
										seoKeyword = temp[1]
								}
						})
				}
		} else if (host == window.location.host) {
			seoSource = '站内'
			seoKeyword = ''
		} else {
			seoSource = '其他网站'
			seoKeyword = '未知'
		}
	}

}
getSeoParams()


function initIm() {
	this.lubanInit = {
        chatHtml :'<div id="luban_chat_btn" style="display:none;">\
                        <i class="chatImg iconfont"></i>\
                        <span>在线咨询</span>\
                    </div>\
					<div id="lub_chatpup" style="display:none;">\
						<div id="lb_dragBox"></div>\
                        <iframe id=\'chatIframe\' src=\'\' height=\'100%\' width=\'100%\'></iframe>\
										</div>',
				inviteHtml: '<div id="lub_inviteWrap" style="display:none">\
									<div class="inviteWrapIcon"><img src="'+ luban_config.pageUrl +'images/invite.png"></div>\
									<div class="inviteRight">\
											<div id="lub_invite_title">欢迎咨询，请问有什么可以帮您的吗?</div>\
											<div class="btnBox">\
													<a href="javascript:;" id="lub_venice">立即咨询</a>\
													<a href="javascript:;" id="lub_afterwards">以后再说</a>\
											</div>\
									</div>\
									<audio src="" style="display: none;" id="lub_invite_audio"></audio>\
							</div>'
        
	}
	

	this.initChat = function (data, callback) {
		var isClick = false
		var obj = {href: window.location.href}
		// 保存在同域名下的cookie下
		if (!utils.getCookie('href')) {
		  utils.setCookie(obj, '', 'session')
		}
		utils.setCookie('LUBAN_accessId_' + luban_config.accessId, luban_config.accessId)

		var chatdiv = document.createElement('div')
		chatdiv.innerHTML = this.lubanInit.chatHtml + this.lubanInit.inviteHtml
		document.body.appendChild(chatdiv);
        if (utils.getBroswer() != utils.broswer.IE6 && utils.getBroswer() != utils.broswer.IE7) {
			document.getElementById('lub_chatpup').getElementsByTagName('iframe')[0].src = luban_config.pageUrl +'luban.html?fromUrllb='+ luban_config.fromUrl +'lb&sourcelb='+ encodeURIComponent(seoSource) +'lb&seoKeywordlb='+ encodeURIComponent(seoKeyword) +'lb&parentUrllb='+ seoUrl +'lb&encryptlb='+ luban_config.encrypt +'lb&autoInvitelb='+ chatInitData.autoInvite +'lb&autoShowInviteTypelb='+ chatInitData.autoShowInviteType +'lb&accessIdlb='+ luban_config.accessId +'lb&styleColorlb=' + data.cssStyle.styleColor +''//luban_config.chatPage;
		}
		this.loadStyle()
		var chatBox = document.getElementById('lub_chatpup')
		var chatStyle = document.getElementById('chatstyle')
		var btn = document.getElementById('luban_chat_btn') 
		var title = document.getElementById('lub_invite_title');
    if (!luban_config.autoShow || luban_config.autoShow == 'false') {
        btn.style.zIndex = '-100'
				btn.style.width = 0
				btn.style.height = 0
				btn.style.padding = 0
      }
		if (data.cssStyle.styleColor && data.cssStyle.styleColor != undefined && data.cssStyle.styleColor != 'undefined') {
		  btn.style.backgroundColor = data.cssStyle.styleColor
		}

		if (data.cssStyle.chatboxLocation && data.advConfig && data.advConfig.windowType != 'common' && !utils.isFromMobile()) {
		  var pos = [data.cssStyle.chatboxSideMargin, data.cssStyle.chatboxLocation]
		  if (pos[1] == 'left') {
			chatBox.style.left = pos[0] + 'px'
		  } else if (pos[1] == 'right') {
			chatBox.style.right = pos[0] + 'px'
		  } else if (pos[1] == 'center') {
			chatBox.style.left = '0'
			chatBox.style.right = '0'
			chatBox.style.margin = '0 auto'
		  }
		} else {
		  chatBox.style.right = '18px'
		}

		//邀请会话
		if(data.config_info.inviteBoxData && data.config_info.inviteBoxData.showInviteBox == "1"){
			title.innerText = data.config_info.inviteBoxData.inviteWords
			var invit = document.getElementById('lub_inviteWrap')
			var positionX = data.config_info.inviteBoxData.positionX
			var positionY = data.config_info.inviteBoxData.positionY
			var distanceX = data.config_info.inviteBoxData.distanceX
			var distanceY = data.config_info.inviteBoxData.distanceY
			invit.style.background = data.config_info.inviteBoxData.backColor
			invit.style.bottom = 'auto'
			invit.style.right = 'auto'
			if(positionY == 'top'){
				invit.style.top = distanceY + 'px'
			}else if(positionY == 'bottom'){
				invit.style.bottom = distanceY + 'px'
			}else if(positionY == 'center'){
				invit.style.top = '0'
				invit.style.bottom = '0'
				invit.style.margin = 'auto'
			}
			if(positionX == 'left'){
				invit.style.left = distanceX + 'px'
			}else if(positionX == 'right'){
				invit.style.right = distanceX + 'px'
			}else if(positionX == 'center'){
				invit.style.left = '0'
				invit.style.right = '0'
				invit.style.margin = 'auto'
			}
		}
	
		if (data.chatboxLocationY && data.advConfig && data.advConfig.windowType != 'common' && !utils.isFromMobile()) {
		  var pos = [data.chatboxSideMarginY, data.chatboxLocationY]
		  if (pos[1] == 'top') {
				chatBox.style.top = pos[0] + 'px'
		  } else if (pos[1] == 'bottom') {
				chatBox.style.bottom = pos[0] + 'px'
		  } else if (pos[1] == 'center') {
				chatBox.style.top = '0'
				chatBox.style.bottom = '0'
				chatBox.style.margin = 'auto'
		  }
		}
		if (data.cssStyle.chatboxLocation && data.chatboxLocationY && data.advConfig && data.advConfig.windowType != 'common' && !utils.isFromMobile()) {
		  if (data.chatboxLocationY == 'center' && data.cssStyle.chatboxLocation == 'center') {
				chatBox.style.top = '0'
				chatBox.style.bottom = '0'
				chatBox.style.left = '0'
				chatBox.style.right = '0'
				chatBox.style.margin = 'auto'
		  }
		}
	
		// 自定义宽度
		if (data.advConfig && data.advConfig.windowType != 'common' && data.chatboxWidth && !utils.isFromMobile()) {
		  chatBox.style.width = data.chatboxWidth + 'px'
		}
		// 自定义高度
		if (data.advConfig && data.advConfig.windowType != 'common' && data.chatboxHeight && !utils.isFromMobile()) {
		  chatBox.style.height = data.chatboxHeight + 'px'
		}

		this.loadAdvConfig(data)
		if (luban_config.autoShow || luban_config.autoShow == 'true') {
			if (utils.getBroswer() == utils.broswer.IE6 || utils.getBroswer() == utils.broswer.IE7) {
				btn.style.display = 'block'
			}
		}
		callback(isClick)
	}

	
	this.lubanDrag = function () {
		var bar = document.getElementById('lb_dragBox');
		var target = document.getElementById('lub_chatpup');
		var odiv=document.getElementById('lub_chatpup');
		var clientWidth = document.documentElement.clientWidth
    var clientHeight = document.documentElement.clientHeight
		var params = {
			left: odiv.getBoundingClientRect().left,
			top: odiv.getBoundingClientRect().top,
			currentX: 0,
			currentY: 0,
			flag: false
		};
		
		var getCss = function(o,key){
			return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
		};

			// bar.onmouseout = function(){
			// 	params.flag = false;
			// }

			bar.onmousedown = function(event){
				params.flag = true;
				if(!event){
					event = window.event;
					bar.onselectstart = function(){
						return false;
					}  
				}
				var e = event;
				params.currentX = e.clientX;
				params.currentY = e.clientY;
			};
			document.onmouseup = function(event){
				params.flag = false;	
				if(getCss(target, "left") !== "auto"){
					params.left = getCss(target, "left");
				}
				if(getCss(target, "top") !== "auto"){
					params.top = getCss(target, "top");
				}
				params.left = odiv.getBoundingClientRect().left;
				params.top = odiv.getBoundingClientRect().top;
			};
			document.onmousemove = function(event){
				var e = event ? event: window.event;
				if(params.flag){
					var nowX = e.clientX, nowY = e.clientY;
					var disX = nowX - params.currentX, disY = nowY - params.currentY;
					var _left = parseInt(params.left) + disX ;
					var _top = parseInt(params.top) + disY;

					clientWidth = document.documentElement.clientWidth
					clientHeight = document.documentElement.clientHeight

					if(_left <= 0) _left = '0';
					if(_top <= 0) _top = '0';

					if(clientWidth - target.clientWidth <= _left){
						_left = clientWidth - target.clientWidth;
					}
					if(clientHeight - target.clientHeight <= _top){
						_top = clientHeight - target.clientHeight;
					}
					
					target.style.left = _left + "px";
					target.style.top = _top + "px";
					
					if (event.preventDefault) {
						event.preventDefault();
					}
					return false;
				}
			}	
	}


	this.loadAdvConfig = function (data) {
		var chatBox = document.getElementById('lub_chatpup');
		if (data.advConfig && data.advConfig.windowType === 'common' && !utils.isFromMobile()) {
			document.getElementById('lb_dragBox').setAttribute('class','dragBox')	
			var davType = data.advConfig.advType; // 广告弹窗的类型 1：右侧有广告； 2： 两边都有广告： 3：左边有广告； 4： 两边都没广告
			if (davType == '1' || davType == '3') {
					chatBox.style.width = '650px'
			} else if (davType == '2') {
					chatBox.style.width = '820px'
			} else if (davType == '4') {
				chatBox.style.width = '480px'
			}
			// if(utils.getBroswer() == utils.broswer.IE8){
			// 	document.getElementById('lub_davleft').style.width = "168px";
			// 	document.getElementById('lub_davright').style.width = "168px";
			// }
		} else if(data.chatboxLocationY != 'center' && data.cssStyle.chatboxLocation != 'center'){
			document.getElementById('lb_dragBox').setAttribute('class','dragBox')	
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
		var chatBox = document.getElementById('lub_chatpup')
		var chatBtn = document.getElementById('luban_chat_btn')
		if(loaded){
			var advConfigData = JSON.stringify(chatInitData)
			//iframe间的通信
			document.getElementById('lub_inviteWrap').style.display = 'none'
			document.getElementById('lub_chatpup').getElementsByTagName('iframe')[0].contentWindow.postMessage(advConfigData,'*')
		}
		loaded = false
		chatBtn.style.display = 'none'
		chatBox.style.display = 'block'
		initIm.lubanDrag();
	}

	this.hideChatBox = function (isPushState) {
		if (utils.isFromMobile() && !isPushState && history.pushState && !navigator.userAgent.indexOf('baidubrowser') > -1) {
			history.go(-1)
		}
		var chatBox = document.getElementById('lub_chatpup')
		var chatBtn = document.getElementById('luban_chat_btn')
		chatBox.style.display = 'none'
		if (luban_config.autoShow || luban_config.autoShow == 'true') {
			chatBtn.style.display = 'block'
		}
	}
	this.loadStyle = function () {
		var style = document.createElement('link')
		style.type = 'text/css'
		style.rel = 'stylesheet'
		style.href = luban_config.pageUrl + 'css/luban_service.css'
		var head = document.getElementsByTagName('head')[0]
		head.appendChild(style)
		if (luban_config.autoShow || luban_config.autoShow == 'true') {
			setTimeout(function() {
				document.getElementById('luban_chat_btn').style.display = "block"
			}, 200);
		}
	}
}


var initIm = new initIm();
window.initIm = initIm;
(function(doc){
	// 获取子iframe传过来的数据
	function getMsgFromChildFrame (b) {
		var chatBox = document.getElementById('lub_chatpup')
		var chatBtn = document.getElementById('luban_chat_btn')
		var data = b.data
		var source = b.source
		var origin = b.origin
		//首次进入页面
		if(data == 'oneOpen'){
			var advConfigData = JSON.stringify({type:'connect'})
			document.getElementById('lub_chatpup').getElementsByTagName('iframe')[0].contentWindow.postMessage(advConfigData,'*')
			return
		}
		//收到会话邀请
		if(data == 'showinvite'){
			document.getElementById('lub_inviteWrap').style.display = 'block'
			var audio = document.getElementById('lub_invite_audio');
			audio.setAttribute('src', '');
			audio.load();
			audio.setAttribute('src', luban_config.pageUrl + '/css/invite_chat.mp3'); // 替换src
			audio.play();
			return
		}
		//拒绝会话邀请
		if(data == "refuseInite"){
			document.getElementById('lub_inviteWrap').style.display = 'none'
			return
		}
		//关闭会话
		if (data == 'hideChatBox' || data == 'closeChatBox') {
			initIm.hideChatBox()
			if ((chatInitData.autoShowInviteType == '1' || chatInitData.autoShowInviteType === undefined ) && chatInitData.closeStayTime && chatInitData.closeStayTime !== '0') {
				if (openTimeout !== 0) {
					window.clearTimeout(openTimeout)
				}
				openTimeout = window.setTimeout(function () {
					initIm.openChatTodo()
				}, chatInitData.closeStayTime * 1000)
			}
			if(data == 'closeChatBox') {
				loaded = true;
			}
			return
		}
		
		//进入页面直接会话 自动弹出
		if(data == 'AutoOpenChatBox'){
			openLUBKF = true;
			if(chatInitData.autoInvite == '1'){
				initIm.openChatTodo()
			}else if(chatInitData.autoShowInviteType == '1'){
				openTimeout = window.setTimeout(function () {
					initIm.openChatTodo()
				}, chatInitData.openStayTime * 1000)
			}
		}
		//收到消息 弹出聊天框
		if(data == 'onmessage'){
			chatBtn.style.display = 'none'
			chatBox.style.display = 'block'
		}

		//继续咨询
		if(data == 'continue'){
			initIm.openChatTodo()
		}
	}
	if (window.addEventListener) {
		window.addEventListener('message', getMsgFromChildFrame)
	} else {
		window.attachEvent('onmessage', getMsgFromChildFrame)
	}
	initIm.initChat(chatInitData, function () {
		if (utils.isIE(5) || utils.isIE(6) || utils.isIE(7)) {
			loaded = true
			var btn = document.getElementById('luban_chat_btn')
			var bpos = utils.chatBtnPosition()
			if (btn && btn.style.bottom == '') {
			utils.aniMove(btn, {bottom: 0, b: -btn.offsetHeight}, 15)
				if (utils.isFromMobile()) {
					btn.style.borderRadius = '0px'
					btn.style.padding = '10px 0px'
				}
			} else {
				btn.style.bottom = -btn.offsetHeight + 'px'
				if (utils.isFromMobile()) {
					utils.aniMove(btn, {bottom: -1, b: -btn.offsetHeight}, 15)
					btn.getElementsByTagName('span')[0].style.display = 'inline'
					btn.getElementsByTagName('span')[0].style.paddingBottom = '5px'
					btn.style.borderRadius = '0px'
					btn.style.padding = '10px 0px'
					btn.style.width = '100%'
					btn.style.left = '0px'
				} else {
					utils.aniMove(btn, {bottom: parseFloat(bpos.bottom.split('px')[0]), b: -btn.offsetHeight}, 15)
				}
			}
		}else{
			loaded = true
			var btn = document.getElementById('luban_chat_btn')
			var box = document.getElementById('lub_chatpup')
			var bpos = utils.chatBtnPosition()
			if (btn.style.bottom == '') {
				utils.aniMove(btn, {bottom: 0, b: -btn.offsetHeight}, 15)
				if (utils.isFromMobile()) {
					btn.style.borderRadius = '0px'
					btn.style.padding = '10px 0px'
				}
			} else {
				btn.style.bottom = -btn.offsetHeight + 'px'
				if (utils.isFromMobile()) {
					utils.aniMove(btn, {bottom: -1, b: -btn.offsetHeight}, 15)
					btn.getElementsByTagName('span')[0].style.display = 'inline'
					btn.getElementsByTagName('i')[0].style.display = 'inline-block'
					btn.getElementsByTagName('span')[0].style.paddingBottom = '5px'
					btn.style.borderRadius = '0px'
					btn.style.padding = '10px 0px'
					btn.style.width = '100%'
					btn.style.height = 'auto'
					btn.style.left = '0px'
					box.style.right = '0px'
					box.style.top = '0px'
					box.style.width = '100%'
					box.style.height = 'auto'
				} else {
					utils.aniMove(btn, {bottom: parseFloat(bpos.bottom.split('px')[0]), b: -btn.offsetHeight}, 15)
				}
			}
		}
		
		var chatBtn = document.getElementById('luban_chat_btn');
		var venice = document.getElementById('lub_venice');
		var afterwards = document.getElementById('lub_afterwards');
		chatBtn.onclick = function () {
			if (openLUBKF) {
				initIm.openChatTodo()
			} else {
				alert('页面尚未加载完，请稍后点击咨询')
			}
		}
		lubankfChatClick = function(){
			if (openLUBKF) {
				initIm.openChatTodo()
			} else {
				alert('页面尚未加载完，请稍后点击咨询')
			}
		}
		if(venice){
			//邀请框 - 立即咨询
			venice.onclick = function () {
				document.getElementById('lub_inviteWrap').style.display = 'none'
				initIm.openChatTodo();
			}
			afterwards.onclick = function(){
				var advConfigData = JSON.stringify({type:'inviteCancel'})
				document.getElementById('lub_chatpup').getElementsByTagName('iframe')[0].contentWindow.postMessage(advConfigData,'*')
				document.getElementById('lub_inviteWrap').style.display = 'none'
			}
		}
	})
})(document)

