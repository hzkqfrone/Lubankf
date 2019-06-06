window.console =
	window.console ||
	(function() {
		var c = {};
		c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function() {};
		return c;
	})();

var chatUtils = {
	getEmoji: function() {
		var str = '';
		for (var i = 0; i < 24; i++) {
			str += '<li style=background-position-y:' + i * -24 + 'px></li>';
		}
		$('#lub_service_wrap .emoji_list').html(str);
	},
	emojiFaces: [
		{en:'Smile',cn:'微笑'},
		{en:'Grimace',cn:'撇嘴'},
		{en:'Drool',cn:'色'},
		{en:'Scowl',cn:'发呆'},
		{en:'CoolGuy',cn:'得意'},
		{en:'Sob',cn:'流泪'},
		{en:'Shy',cn:'害羞'},
		{en:'Silent',cn:'闭嘴'},
		{en:'Sleep',cn:'睡'},
		{en:'Cry',cn:'大哭'},
		{en:'Awkward',cn:'尴尬'},
		{en:'Angry',cn:'发怒'},
		{en:'Tongue',cn:'调皮'},
		{en:'Grin',cn:'呲牙'},
		{en:'Surprise',cn:'惊讶'},
		{en:'Frown',cn:'难过'},
		{en:'Ruthless',cn:'酷'},
		{en:'Blush',cn:'囧'},
		{en:'Scream',cn:'抓狂'},
		{en:'Puke',cn:'吐'},
		{en:'Chuckle',cn:'偷笑'},
		{en:'Joyful',cn:'愉快'},
		{en:'Slight',cn:'白眼'},
		{en:'Smug',cn:'傲慢'},
		{en:'Hungry',cn:'饥饿'},
		{en:'Drowsy',cn:'困'},
		{en:'Panic',cn:'惊恐'},
		{en:'Sweat',cn:'流汗'},
		{en:'Laugh',cn:'憨笑'},
		{en:'Commando',cn:'悠闲'},
		{en:'Determined',cn:'奋斗'},
		{en:'Scold',cn:'咒骂'},
		{en:'Shocked',cn:'疑问'},
		{en:'Shhh',cn:'嘘'},
		{en:'Dizzy',cn:'晕'},
		{en:'Tormented',cn:'疯了'},
		{en:'Toasted',cn:'衰'},
		{en:'Skull',cn:'骷髅'},
		{en:'Hammer',cn:'敲打'},
		{en:'Wave',cn:'再见'},
		{en:'Speechless',cn:'擦汗'},
		{en:'NosePick',cn:'抠鼻'},
		{en:'Clap',cn:'鼓掌'},
		{en:'Shame',cn:'糗大了'},
		{en:'Trick',cn:'坏笑'},
		{en:'Bah！L',cn:'左哼哼'},
		{en:'Bah！R',cn:'右哼哼'},
		{en:'Yawn',cn:'哈欠'},
		{en:'Pooh-pooh',cn:'鄙视'},
		{en:'Shrunken',cn:'委屈'},
		{en:'TearingUp',cn:'快哭了'},
		{en:'Sly',cn:'阴险'},
		{en:'Kiss',cn:'亲亲'},
		{en:'Wrath',cn:'吓'},
		{en:'Whimper',cn:'可怜'},
		{en:'Cleaver',cn:'Cleaver'},
		{en:'Watermelon',cn:'西瓜'},
		{en:'Beer',cn:'啤酒'},
		{en:'Basketball',cn:'篮球'},
		{en:'PingPong',cn:'乒乓'},
		{en:'Coffee',cn:'咖啡'},
		{en:'Rice',cn:'饭'},
		{en:'Pig',cn:'猪头'},
		{en:'Rose',cn:'玫瑰'},
		{en:'Wilt',cn:'凋谢'},
		{en:'Lips',cn:'嘴唇'},
		{en:'Heart',cn:'爱心'},
		{en:'BrokenHeart',cn:'心碎'},
		{en:'Cake',cn:'蛋糕'},
		{en:'Lightning',cn:'闪电'}
	],

	//转化emoji
	regExpEmoji: function(message, type) {
		// message = message.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
		message = message.replace(/\r\n/g, '</br>');
		message = message.replace(/\r/g, '</br>');
		message = message.replace(/\n/g, '</br>');
		for (var i = 0; i < chatUtils.emojiFaces.length; i++) {
			var em = '<em class="emoji-face" style="background-position-y: ' + i * -24 + 'px;"></em>';
			if (message == undefined || message == null || message == '') return;
			message = message.replace(new RegExp('\\[' + chatUtils.emojiFaces[i].en + '\\]', 'g'), em);
			message = message.replace(new RegExp('\\[' + chatUtils.emojiFaces[i].cn + '\\]', 'g'), em);
		}
		return message;
	},

	isFromMobile: function() {
		var agent = navigator.userAgent.toLowerCase();
		var ipad = agent.match(/(ipad).*os\s([\d_]+)/),
			isIphone = !ipad && agent.match(/(iphone\sos)\s([\d_]+)/),
			isAndroid = agent.match(/(android)\s+([\d.]+)/),
			isWinPhone = agent.match(/(windows mobile)\s+([\d.]+)/),
			isMobile = ipad || isIphone || isAndroid || isWinPhone;
		if (isMobile) {
			return true;
		}
		return false;
	},

	getNowFormatDate: function() {
		var date = new Date(),
			h = date.getHours() < 9 ? '0' + date.getHours() : date.getHours(),
			m = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes();
		var currentdate = h + ':' + m;
		return currentdate;
	},

	chatWindBottom: function() {
		var h = $('#lub_service_wrap .lub_chat_content');
		h.scrollTop(h.find('.lub_chat_wrap').outerHeight());
	},

	sedLubMsg: function(content, type) {
		var msgId = Math.round(new Date().getTime()) + String(Math.random()).substring(2, 8);
		if (!isSend || !content.trim()) return false;
		$('.is_lub_send').removeClass('lub_send_btn');
		$('#lub_service_wrap .lub_emoji').hide();
		var str =
			'<li class="lub_chat_list chat_customer clearfix">\
      <div class="username"><span class="date">' +
			chatUtils.getNowFormatDate() +
			'</span></div>\
      <div class="chat_msg">\
      <span class="angle"></span>\
      ' +
			chatUtils.replaceChatMessage(type, content) +
			'\
      </div><div class="sensitive_word" id='+ msgId +'></div></li>';
		$('#lub_service_wrap .lub_chat_wrap ul.chat_log').append(str);
		$('#lub_textarea').val('');
		if(content.indexOf('luban_img_')==-1){
			lubanSendChat(type, content, msgId);
		}
		chatUtils.chatWindBottom();
	},

	system_message: function(msg) {
		var str = '<li class="chat_service systemWrap"><div class="system">'+ msg.content +'</div></li>'
		$('#lub_service_wrap .lub_chat_wrap ul.chat_log').append(str);
		chatUtils.chatWindBottom();
	},

	onmessage: function(msg) {
		var str =
			'<li class="lub_chat_list chat_service clearfix">\
			<div class="username">';
		if(showServiceName){
			str += '<span>'+ msg.agent +'</span>';
		}
		str += '<span class="date">' +
			msg.createTime +
			'</span></div>\
			<div class="chat_msg">\
			<span class="angle"></span>';
		if(msg.MsgType == "robot"){
			str += chatUtils.robotMessage(msg);
		}else{
			$('#lub_textarea_wrap .artificial').hide();
			str += '<div class="chat_content">' +chatUtils.replaceChatMessage(msg.MsgType, msg.content) +'</div>';
		}
		str += '</div>\
			</li>';
			$('#lub_service_wrap .lub_chat_wrap ul.chat_log').append(str);
			chatUtils.chatWindBottom();
	},

	//机器人欢迎语 常见问题  关联问题
	robotMessage: function(msg, type){
		var content = JSON.parse(msg.content || msg.Content); 
		var solve = "";
		if(!type && content.knowledge_id){
			solve = '<div class="isSolve">\
				<div class="solve" data-id="'+ content.knowledge_id +'">\
					<a href="javascript:;" class="have_solve has_solve" data-id="1">解决</a><a href="javascript:;" class="not_solve has_solve" data-id="0">未解决</a>\
					<div class="border">|</div>\
				</div>\
				<span class="ratedIng">反馈中</span>\
				<span class="isRated">已反馈</span>\
			</div>';
		}
		if(content.questions.length!=0){
			var str = '<div class="chat_content common_questions">\
							<p class="welcome_msg">'+ content.message +'</p>\
							<div class="other_questions">\
								<p class="other_text">'+ content.text +'</p>\
								<ul>';
								for(var i = 0; i < content.questions.length; i++){
									str += '<li><a href="javascript:;" data-qs="'+ content.questions[i] +'" class="question">'+ content.questions[i] +'</a></li>';
								}
						str += '</u>\
								<p class="qs_tips">请点击或回复相应序号查看答案</p>\
								'+ solve +'\
							</div>\
						</div>'; 
			return str;
		}else{
			var hf = '<div class="chat_content robotMsg">\
						<p>'+ content.message +'</p>\
						'+ solve +'\
					</div>';
	
			return hf;
		}
	},

	replaceChatMessage: function(type, content) {
		var str = '';
		if (type == 'image') {
			if(content.indexOf('luban_img_') > -1){
				str =
					'<div class="chat_content">\
					  <a href="javascript:;" target="_blank" id='+ content +'>\<img src="'+ luban_config.pageUrl +'images/uploading.gif">\</a>\
					  </div>';
			}else{
				str =
				'<div class="chat_content">\
      			<a href="'+ content +'" target="_blank" >\<img src="'+ content +'">\</a>\
      			</div>';
			}
		} else if (type == 'file' || type == 'voice' || type == 'video') {
			if(type != 'file'){
				try {
					content = JSON.parse(content).url;
				} catch (error) {
					
				}
			}
			str =
				'<div class="chat_content">\
      			<a href="' + content + '" target="_blank">' + content +'</a>\
      			</div>';
		} else {
			str = '<div class="chat_content">' + chatUtils.regExpEmoji(content) + '</div>';
		}
		return str;
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

	ajaxRequest: function(url, data, successCallback, errorCallback) {
		var params = {
			type: 'post',
			url: url,
			timeout: 10000,
			cache: false,
			success: successCallback,
			error: errorCallback
		};
		if (data) {
			params.data = data;
		}
		$.ajax(params);
	},

	appendLubInfo: function(msg, type) {
		if (type == 1) {
			$('.lub_chat_wrap ul.chat_log').prepend("<li class='lub_chat_list system_msg'>" + msg + '</li>');
		} else if(type == 2) {
			$('.lub_chat_wrap ul.chat_log').append("<li class='chat_service systemWrap'>" + msg + '</li>');
		} else {
			$('.lub_chat_wrap ul.chat_log').append("<li class='lub_chat_list system_msg' id='luban-chat-log'>" + msg + '</li>');
		} 
		chatUtils.chatWindBottom();
	},

	lubanOnMessage: function(msg) {
		chatUtils.onmessage(msg);
		if (voice) {
			var audio = document.getElementById('warning-tone');
			audio.play();
		}
	},

	showtoast: function(msg){
		if(toastTimer){
			clearTimeout(toastTimer)
		}
		$("#lub_service_wrap .toast").fadeIn().find('p').text(msg);
		var toastTimer = setTimeout(function() {
			$("#lub_service_wrap .toast").fadeOut()
		}, 2000);
	}
};

var phoneSystem = '', // 判断当前系统是ios还是Android
	sessionId = chatUtils.getCookie('LUBAN_sessionid_'+ luban_config.accessId), //客户端的sessionid
	chat_log_page = 1,
	socket = undefined, //socket
	heartBeatTimeOut = 0, //心跳
	voice = true, //开启声音
	leave_timer = 0, //留言错误提醒
	isSend = true, //禁用发送按钮
	scrollTop = 0, //滚动条高度
	uploadType = 'image', //上传类型
	showEavluation = false, //显示客服评价
	foreseeTimer = 0,    //消息预知
	foreseeTime_old = 0,
	evaluationLeve = 0,
	isevaluate = false,  //是否收到主动评价
	evaAObj = [{label:'good',value:'好评'},{label:'middle',value:'中评'},{label:'bad',value:'差评'}],
	showServiceName = false,  //是否显示客服名
	isDavType = null,
	uploadNum = 1,     //上传图片id
	isCloseSocket = false; 

$(document).on('click','#lub_service_wrap .lub_send_btn',function() {
	var content = $('#lub_textarea').val();
	chatUtils.sedLubMsg(content, 'normal');
});

$('#lub_textarea').keyup(function(e) {
	if(e.keyCode!=13){
		messageForesee(3000);
	}
});

$('#lub_textarea').bind('input porpertychange',function(e) {
	if($('#lub_textarea').val().trim()){
		$('.is_lub_send').addClass('lub_send_btn');
	}else{
		$('.is_lub_send').removeClass('lub_send_btn');
	}
});

$(document).click(function(e){
	$('#lub_service_wrap .lub_emoji').hide();
})
$('#lub_textarea').blur(function(e) {messageForesee(3000,true)});

$(document).on('click', '#lub_service_wrap .emoji_list li', function(e) {
	var index = $(this).index();
	var emoji = chatUtils.emojiFaces[index].cn;
	$('#lub_textarea').val($('#lub_textarea').val() + '[' + emoji + ']');
	$('.is_lub_send').addClass('lub_send_btn');
	e.stopPropagation();
});

//点击表情
$(document).on('click', '#lub_service_wrap i.emoji', function(e) {
	$('#lub_service_wrap .lub_emoji').toggle();
	e.stopPropagation();
});

//上传图片
$(document).on('change', '#lub_service_wrap .upload_image', function() {
	uploadType = 'image';
	var file = document.getElementById('lub_Upload').files[0];
	uploadImg(luban_config.upload_image, file);
});



//上传文件
$(document).on('change', '#lub_service_wrap .upload_file', function() {
	uploadType = 'file';
	var file = document.getElementById('lub_Upload_file').files[0];
	uploadFile(luban_config.upload_file, file);
});

//打开相机
$(document).on('change', '#lub_service_wrap .lub_open_photo', function() {
	uploadType = 'image';
	var file = document.getElementById('lub_open_photo').files[0];
	uploadImg(luban_config.upload_image, file);
});



var uploadFile = function(url, file) {
	if (file) {
		if (file.size > 10 * 1024 * 1024){
			chatUtils.showtoast("上传文件太大，超过10M")
			return;
		}
		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		fd.append('appToken', luban_config.accessId);
		fd.append('encrypt', luban_config.encrypt);
		fd.append('file', file);

		xhr.upload.addEventListener('progress', uploadImgProgress, false);
		xhr.addEventListener('load', uploadImgComplete, false);
		xhr.addEventListener('error', uploadImgFailed, false);
		xhr.addEventListener('abort', uploadImgCanceled, false);
		xhr.open('POST', luban_config.lubanURL + url);
		xhr.send(fd);
		xhr.getAllResponseHeaders()
	}
};


var uploadImg = function(url, file) {
	uploadNum += 1;
	var id = 'luban_img_'+ uploadNum;
	chatUtils.sedLubMsg(id, uploadType);

	// 压缩图片需要的一些元素和对象
	var reader = new FileReader(), img = new Image();
	reader.readAsDataURL(file);  

	// 缩放图片需要的canvas
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	// base64地址图片加载完毕后
	img.onload = function () {
		// 图片原始尺寸
		var originWidth = this.width;
		var originHeight = this.height;
		// 最大尺寸限制
		var maxWidth = 400, maxHeight = 400;
		// 目标尺寸
		var targetWidth = originWidth, targetHeight = originHeight;
		// 图片尺寸超过400x400的限制
		if (originWidth > maxWidth || originHeight > maxHeight) {
			if (originWidth / originHeight > maxWidth / maxHeight) {
				// 更宽，按照宽度限定尺寸
				targetWidth = maxWidth;
				targetHeight = Math.round(maxWidth * (originHeight / originWidth));
			} else {
				targetHeight = maxHeight;
				targetWidth = Math.round(maxHeight * (originWidth / originHeight));
			}
		}
			
		// canvas对图片进行缩放
		canvas.width = targetWidth;
		canvas.height = targetHeight;
		// 清除画布
		context.clearRect(0, 0, targetWidth, targetHeight);
		// 图片压缩
		context.drawImage(img, 0, 0, targetWidth, targetHeight);
		// canvas转为blob并上传
		canvas.toBlob(function (blob) {
			// 图片ajax上传
			var xhr = new XMLHttpRequest();
			// 文件上传成功
			xhr.onreadystatechange = function() {
				if (xhr.status == 200) {
					// xhr.responseText就是返回的数据
					console.log( xhr.responseText)
				}
			};
			// 开始上传
			// blob.append('appToken', appToken);
			// blob.append('encrypt', encrypt);
			// xhr.open("POST", msg_config.lubanURL + msg_config.upload_image, true);
			// xhr.send(blob);   
			var xhr = new XMLHttpRequest();
			var fd = new FormData();
			fd.append('appToken', luban_config.accessId);
			fd.append('encrypt', luban_config.encrypt);
			fd.append('image', blob, file.name);
			xhr.upload.addEventListener('progress', uploadImgProgress, false);
			xhr.addEventListener('load', function(){ uploadImgComplete(event, id) }, false);
			xhr.addEventListener('error', function(){ uploadImgFailed(event, id) }, false);
			xhr.addEventListener('abort', function(){ uploadImgCanceled(event, id) }, false);
			xhr.open('POST', luban_config.lubanURL + url);
			xhr.send(fd);
			xhr.getAllResponseHeaders()
		}, file.type || 'image');
	};

	// 文件base64化，以便获知图片原始尺寸
	reader.onload = function(e) {
		img.src = e.target.result;
	};
}


//上传中
var uploadImgProgress = function(e) {
	// console.log(e)
};
var uploadImgComplete = function(e, id) {
	var res = e.target.response;
	var data = JSON.parse(res);
	if (data.code == 0) {
		if(id){
			var msgId = Math.round(new Date().getTime()) + String(Math.random()).substring(2, 8);
			$('#'+id).attr('href', data.data.url);
			$('#'+id).find('img').attr('src', data.data.url);
			lubanSendChat(uploadType, data.data.url, msgId);
		}else{
			chatUtils.sedLubMsg(data.data.url, uploadType);
		}
	} else {
		alert(data.msg);
	}
};
var uploadImgFailed = function(e, id) {
	if(id) $(id).remove();
	alert('文件上传失败');
};
var uploadImgCanceled = function(e, id) {
	if(id) $(id).remove();
	alert('文件上传被取消');
};

function getMsgFromParent() {
	isSend = true;
	var msg = chatInitData;
	var davData = msg.advConfig; //广告
	if (davData) {
		if (davData && davData.windowType === 'common' && !chatUtils.isFromMobile()) {
			var leftUrl = davData.uploadLeftAdvtUrl ? davData.uploadLeftAdvtUrl : 'javascript:;';
			var rightUrl = davData.uploadRightAdvtUrl ? davData.uploadRightAdvtUrl : 'javascript:;';
			var leftImg =
				'<a target="_blank" href=\'' +
				leftUrl +
				"' ><img width='100%' height='100%'  src='" +
				davData.uploadLeftAdvtImg +
				"'/></a>";
			var rightImg =
				'<a target="_blank" href=\'' +
				rightUrl +
				"' ><img width='100%' height='100%'  src='" +
				davData.uploadRightAdvtImg +
				"'/></a>";
			var davLeft = $('#lub_davleft');
			var davRight = $('#lub_davright');
			var content = $('#lub_service_wrap .lub_msg_content');
			document.getElementsByClassName('softwareSource')[0].style.display = 'inline-block';
			var davType = davData.advType; // 广告弹窗的类型
			isDavType = davData.advType;
			if (davType == '1') {
				davRight.html(rightImg).show();
				content.css('marginRight','170px');
			} else if (davType == '3') {
				davLeft.html(leftImg).show();
				content.css('marginLeft','170px');
			} else if (davType == '2') {
				davLeft.html(leftImg).show();
				davRight.html(rightImg).show();
				content.css('margin','0 170px');
			} else {
				davRight.hide();
				davLeft.hide();
			}
		} else {
			$('.lub_chat_content').css({ width: '100%' });
		}

		if (davData.floatAdv && davData.windowType === 'common' && !chatUtils.isFromMobile()) {
			// 普通版
			$('.float_dav').show();
			$('.float_dav_content').text(davData.floatAdv);
			$('#lub_service_wrap .lub_chat_content').css('top', '10px');
			$('#lub_service_wrap .lub_chat_wrap ul.chat_log').css('margin-top', '40px');
			if (
				msg.cssStyle.styleColor &&
				msg.cssStyle.styleColor != undefined &&
				msg.cssStyle.styleColor != 'undefined'
			) {
				$('.lub_warp .float_dav').css('color', msg.cssStyle.styleColor);
				$('.lub_warp .float_dav').css('borderColor', msg.cssStyle.styleColor);
			}
		} else if (chatUtils.isFromMobile()) {
			$('.float_dav').hide();
			$('.lub_chat_content').css({ hight: 'auto' });
			$('#lub_service_wrap .lub_open_photo').show();
		} else {
			$('.float_dav').hide();
		}
		// 滚动广告展示
		if (
			davData.advContent &&
			davData.advContent.length &&
			!chatUtils.isFromMobile() &&
			davData.advScrollTime != '0'
		) {
			var advlist = '';
			$('#oldScrollX').find('ul').empty();
			for (var i = 0; i < davData.advContent.length; i++) {
				var advItem = davData.advContent[i];
				if (advItem.enable) {
					advlist +=
						'<li><a target="_blank" href=\'' + advItem.advUrl + "'>" + advItem.advTitle + '</a></li>';
				}
			}
			$('#oldScrollX').find('ul').html(advlist);
			// 广告滚动
			var time = davData.advScrollTime * 1000;
			if (davData.windowType === 'common') {
				$('.luban_dav_scrollX').css('width', '330px');
			}
			if (davData.advScroll == 'scrollX') {
				scrollNewX(time);
			} else if (davData.advScroll == 'scrollY') {
				scrollNewY();
				var scroll1 = new ScrollText('newScrollY', true, time, false);
			}
		}
	}
	if (msg.companyName) {
		$('#lub_service_wrap .lub_title').text(msg.companyName);
	}
	if (msg.config_info && msg.config_info.evaluation && msg.config_info.evaluation.showEavluation == "true"){
		$('#lub_preview .title').text(msg.config_info.evaluation.title);
		showEavluation = true;
	}
	if (msg.companyLogo) {
		$('#lub_service_wrap #logo').show();
		$('#lub_service_wrap #logo').attr('src', msg.companyLogo);
	}
	// 设置隐藏关闭按钮
	if (msg.showCloseButton == '0') {
		$('#lub_close').remove();
	}
	// 是否显示客服名称
	if(msg.showAgentName){
		showServiceName = true;
	}
	$('#lub_textarea').focus();
	chatUtils.chatWindBottom();
	openLubanChat();
}

//转接人工后 重置页面信息
var resetLubanAgent = function(type){
	chat_log_page = 1;
	if(!type){
		$('.lub_chat_wrap ul.chat_log').html('');
	}else{
		$('.lub_chat_wrap ul.chat_log li.lub_chat_list').remove();
	}
	openLubanChat(type);
}

var initChat = function(){
	var openlbUrl = luban_config.lubanURL + luban_config.init_lubankf;
	var data = {
		appToken: luban_config.accessId,
		encrypt: luban_config.encrypt,
		parentUrl: luban_config.parentUrl,
		fromUrl: luban_config.fromUrl,
		seoKeyword: luban_config.seoKeyword,
		sessionId: sessionId,
		source: luban_config.source
	};
	chatUtils.ajaxRequest(openlbUrl, data, function(res) {
		if(res.code == 0){
			window.parent && window.parent.postMessage && (window.parent.postMessage('AutoOpenChatBox', '*'))
			sessionId = res.data.sessionId;
			chatUtils.setCookie('LUBAN_sessionid_' + luban_config.accessId, res.data.sessionId);
			websock();
			getMsgFromParent();
		}else if(res.code == 4444){
			$("#lub_davright").hide();
			$("#lub_davleft").hide();
			errorCode('抱歉，客服系统暂时无法使用');
		}
	});
};


var lubanSendChat = function(type, content, msgId) {
	var url = luban_config.lubanURL + luban_config.sendChatURL;
	var data = {
		sessionId: sessionId,
		appToken: luban_config.accessId,
		encrypt: luban_config.encrypt,
		MsgId: msgId,
		type: type,
		content: content
	};
	chatUtils.ajaxRequest(url, data, function(res) {
		if(res.code != 0){
			messageForesee(0);
			$("#"+res.data.MsgId).html(res.msg).css('display','inline-block');
		}
		if (type != 'normal') {
			setTimeout(function() {
				chatUtils.chatWindBottom();
			}, 100);
		}
	},function(res){
		$('.lub_chat_error,.lub_shade').show();
	});
};


var openLubanChat = function(type) {
	var webChat = luban_config.lubanURL + luban_config.webChat;
	var data = {
		appToken: luban_config.accessId,
		encrypt: luban_config.encrypt,
		sessionId: sessionId,
		page: chat_log_page
	};
	chatUtils.ajaxRequest(webChat, data, function(res) {
		if(res.code == 0){
			if(isCloseSocket) websock();
			if (res.data.chat && res.data.chat.list) {
				appendChatLog(res.data, type);
				if(res.data.agent) showAgentInfo(res.data.agent);
			}
			$('.lub_warp').show();
			$('.leave_msg').hide();
		}else if(res.code == 3002){   //无客服在线
			$('.lub_warp').hide();
			$('.leave_msg').show();
			sessionId = res.data.sessionId;
			chatUtils.setCookie('LUBAN_sessionid_' + luban_config.accessId, res.data.sessionId);
		}else if(res.code == 4444){
			$("#lub_davright").hide();
			$("#lub_davleft").hide();
			errorCode('抱歉，客服系统暂时无法使用');
		}else{
			errorCode();
		}
	},function(res){
		console.log(res)
	});
};

var errorCode = function(msg){
	var mssg = msg?msg : '网络异常--。';
	$("#lub_service_wrap .unusual").remove();
	$("#lub_service_wrap .lub_warp").hide();
	var str = '<div class="unusual">\
	<img src="'+ luban_config.pageUrl +'images/unusual.png">\
	<p>'+ mssg +'</p>\
	</div>';
	$("#lub_service_wrap").append(str);
}

var showAgentInfo = function(data){
	$('#lub_service_wrap .lub_title').text(data.nickname);
	if(data.logo){
		$('#lub_service_wrap #logo').show();
		$('#lub_service_wrap #logo').attr('src', data.logo);
	}
	//机器人显示 转人工
	if(data.agent == 'robot'){
		$('#lub_textarea_wrap .artificial').show();
	}
}

var appendChatLog = function(d, type) {
	var data = d.chat.list;
	if (data.length > 0) {
		for (var j = 0; j < data.length; j++) {
			var str = '';
			var msg = data[j];
			if (!msg.Content) return;
			if (msg.fromUser == 1) {
				str = '<li class="lub_chat_list chat_service clearfix">';
			} else {
				str += '<li class="lub_chat_list chat_customer clearfix">';
			}
			str +=
				'<div class="username"> <span>'+ (msg.fromUser == 1 ? msg.agent : '') +'</span><span class="date">' +
				msg.CreateTime +
					'</span></div>\
				<div class="chat_msg">\
				<span class="angle"></span>';
				if(msg.type == "robot"){
					str += chatUtils.robotMessage(msg,'chatlog');
				}else{
					str += chatUtils.replaceChatMessage(msg.type, msg.Content)
				}
				str += '</div>\
				</li>';
			$('#lub_service_wrap .lub_chat_wrap ul.chat_log').prepend(str);
		}
	} else {
		return;
	}
	if (chat_log_page == 1 && type != 'reset') {
		$("#luban-chat-log").remove();
		// chatUtils.appendLubInfo('——  以上是历史消息  ——');
	}
	if (chat_log_page < d.chat.totalPage) {
		$(".show_more").remove();
		chatUtils.appendLubInfo('<a id="more_chat_log" href="javascript:;">查看更多历史消息</a>', 1);
	}
	$(document).ready(function() {
		chatUtils.chatWindBottom();
		if (chat_log_page != 1) {
			$('.lub_chat_content').scrollTop(329);
		}
	});
};
var websock = function() {
	if (socket) {
		socket.close(3001, JSON.stringify({ s: sessionId, a: luban_config.accessId }));
		clearTimeout(heartBeatTimeOut);
	}
	var wsuri = luban_config.socketUrl + '?sessionId=' + sessionId + '&appToken=' + luban_config.accessId + '&encrypt=' + luban_config.encrypt + '';
	socket = new WebSocket(wsuri);
	socket.onopen = function() {
		heartBeat();
	};
	socket.onmessage = function(e) {
		if (e.data == 'pong') return false;
		var msg = JSON.parse(e.data);
		//收到邀请会话
		if(msg.type == 'invite_chat'){
			window.parent && window.parent.postMessage && window.parent.postMessage('showinvite', '*');
		}else if(msg.MsgType == 'inviteEvaluation'){
		//收到邀请评价
			isevaluate = true;
			$('#lub_preview,.lub_shade').show();
		}else if(msg.type == 'system_msg'){
		//系统消息
			setTimeout(function() {
				chatUtils.system_message(msg);
				$('#lub_textarea_wrap .artificial').hide();
				$('#transfer_artificial').remove();
				$('#transfer_leave').remove();
				resetLubanAgent('reset');
			}, 200);
		}else if(msg.type == 'transfer_agent'){
		//手动转人工
			chatUtils.appendLubInfo('<a href="javascript:;" class="hint" id="transfer_artificial">转人工</a>', 2);
		}else if(msg.type == 'leave'){
		//留言
			$('#transfer_artificial').remove();
			$('#lub_textarea_wrap .artificial').hide();
			chatUtils.appendLubInfo('<a href="javascript:;" class="hint" id="transfer_leave">留言</a>', 2);
		}else if (msg.content) {
			chatUtils.lubanOnMessage(msg);
		}
		$('#lub_textarea_wrap .allocation').hide();
	};
	socket.onclose = function(event) {
		console.log(event, 'WebSocket关闭');
		isCloseSocket = true;
		if(heartBeatTimeOut) clearTimeout(heartBeatTimeOut);
		if (event.code == 3001) return false;
		if (event.code == 3002) {
			//客服不在线
			$('.lub_warp').hide();
			$('.leave_msg').show();
		} else if (event.code == 3003) {
			alert(event.reason);
		} else if (event.code == 3004) {
			//客服主动关闭
			if(showEavluation && !isevaluate){
				$('#lub_preview,.lub_shade').show();
			}else{
				$("#lub_end_chat").show();
			}
		}else{
			reconnection()
		}
	};
	socket.onerror = function() {
		console.log('WebSocket连接失败');
	};
};
var heartBeat = function() {
	socket.send('ping');
	heartBeatTimeOut = setTimeout(function() {
		heartBeat();
	}, 30000);
};

var reconnection = function() {
	setTimeout(function() {
		websock();
	}, 10000);
};

var messageForesee = function (t,type) {
	clearTimeout(foreseeTimer);
	var msg = $('#lub_textarea').val();
	if(type) return false;
	var time = new Date().getTime();
	if((time-foreseeTime_old)>=t || !foreseeTime_old) {
		foreseeTime_old = time; 
		var foreseeUrl = luban_config.lubanURL + luban_config.lubMsg_foresee;
		var data = {
			encrypt: luban_config.encrypt,
			appToken: luban_config.accessId,
			notice: msg,
			sessionId: sessionId
		}
		chatUtils.ajaxRequest(foreseeUrl, data, function(res) {
		})
	}else{
		var ttime = 3000;
		if(foreseeTime_old){
			ttime = 3000-(time-foreseeTime_old);
		}
		foreseeTimer = setTimeout(function(){
			messageForesee(0);
		}, ttime);
	}
}

var sendLeave = function(content, user, tel, email){
	var leaveUrl = luban_config.lubanURL + luban_config.leaveUrl;
	var data = {
		appToken: luban_config.accessId,
		encrypt: luban_config.encrypt,
		sessionId: sessionId,
		name: user,
		content: content,
		phone: tel,
		email: email
	};
	chatUtils.ajaxRequest(leaveUrl, data, function(res) {
		if(res.code == 0){
			leaveSuccess("留言发送成功");
			$('#leave_textarea').val("");
			$('.leave_content .user').val("");
			$('.leave_content .tel').val('');
			$('.leave_content .email').val('');
		}else{
			leaveError(res.msg);
		}
	})
}

function scrollNewX(time) {
	var lub_ScrollX = document.getElementById('lub_ScrollX');
	var oldScrollX = document.getElementById('oldScrollX');
	var newScrollX = document.getElementById('newScrollX');
	lub_ScrollX.style.display = 'block';
	newScrollX.innerHTML = document.getElementById('oldScrollX').innerHTML;
	function Marquee() {
		if (lub_ScrollX.scrollLeft - newScrollX.offsetWidth >= 0) {
			lub_ScrollX.scrollLeft -= oldScrollX.offsetWidth;
		} else {
			lub_ScrollX.scrollLeft++;
		}
	}
	var myvar = setInterval(Marquee, time / 100);
	lub_ScrollX.onmouseout = function() {
		myvar = setInterval(Marquee, time / 100);
	};
	lub_ScrollX.onmouseover = function() {
		clearInterval(myvar);
	};
}

function scrollNewY(time) {
	var htext = document.getElementById('oldScrollX').getElementsByTagName('li');
	var text_holder = document.getElementById('newScrollY');
	text_holder.style.display = 'block';
	var oFrag = document.createDocumentFragment();
	oFrag.innerHTML = '';
	for (var i = 0; i < htext.length; i++) {
		oFrag.innerHTML += htext[i].outerHTML + '  ';
	}
	text_holder.innerHTML = oFrag.innerHTML;
}

function ScrollText(content, autoStart, timeout, isSmoothScroll) {
	this.Speed = 10;
	this.Timeout = timeout;
	this.stopscroll = false;
	this.isSmoothScroll = isSmoothScroll;
	this.LineHeight = 20;
	this.ScrollContent = document.getElementById(content);
	this.Start = function() {
		if (this.isSmoothScroll) {
			this.AutoScrollTimer = setInterval(this.GetFunction(this, 'SmoothScroll'), this.Timeout);
		} else {
			this.AutoScrollTimer = setInterval(this.GetFunction(this, 'AutoScroll'), this.Timeout);
		}
	};
	this.Stop = function() {
		clearTimeout(this.AutoScrollTimer);
		this.DelayTimerStop = 0;
	};
	this.MouseOver = function() {
		this.stopscroll = true;
	};
	this.MouseOut = function() {
		this.stopscroll = false;
	};
	this.AutoScroll = function() {
		if (this.stopscroll) {
			return;
		}
		this.ScrollContent.scrollTop++;
		if (parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0) {
			this.ScrollTimer = setTimeout(this.GetFunction(this, 'AutoScroll'), this.Speed);
		} else {
			if (parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2) {
				this.ScrollContent.scrollTop = 0;
			}
			clearTimeout(this.ScrollTimer);
		}
	};
	this.SmoothScroll = function() {
		if (this.stopscroll) {
			return;
		}
		this.ScrollContent.scrollTop++;
		if (parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2) {
			this.ScrollContent.scrollTop = 0;
		}
	};
	this.Scroll = function(direction) {
		if (direction == 'up') {
			this.ScrollContent.scrollTop--;
		} else {
			this.ScrollContent.scrollTop++;
		}
		if (parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2) {
			this.ScrollContent.scrollTop = 0;
		} else if (parseInt(this.ScrollContent.scrollTop) <= 0) {
			this.ScrollContent.scrollTop = parseInt(this.ScrollContent.scrollHeight) / 2;
		}

		if (parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0) {
			this.ScrollTimer = setTimeout(this.GetFunction(this, 'Scroll', direction), this.Speed);
		}
	};
	this.GetFunction = function(variable, method, param) {
		return function() {
			variable[method](param);
		};
	};
	this.ScrollContent.innerHTML += this.ScrollContent.innerHTML;
	this.ScrollContent.onmouseover = this.GetFunction(this, 'MouseOver');
	this.ScrollContent.onmouseout = this.GetFunction(this, 'MouseOut');
	if (autoStart) {
		this.Start();
	}
}

function leaveError(msg) {
	var error = $('.leave_content span.error');
	error.text(msg);
	clearTimeout(leave_timer);
	error.fadeIn();
	leave_timer = setTimeout(function() {
		error.fadeOut();
	}, 2000);
}

function leaveSuccess(msg) {
	var error = $('.leave_content span.success');
	error.text(msg);
	clearTimeout(leave_timer);
	error.fadeIn();
	leave_timer = setTimeout(function() {
		error.fadeOut();
	}, 2000);
}

$(document).ready(function() {
	chatUtils.getEmoji();
	var chatFinish = false;
	var submitMsgFlag = true;
	//快捷键方式
	$(document).keypress(function(e) {
		if (chatFinish) {
			return;
		}
		if (e.ctrlKey) {
			return;
		}
		if (e.which == 13 || e.which == 10) {
			e.preventDefault();
			if (submitMsgFlag) {
				var content = $('#lub_textarea').val();
				chatUtils.sedLubMsg(content, 'normal');
			}
		}
	});

	var u = navigator.userAgent,
		app = navigator.appVersion;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if (isAndroid) {
		phoneSystem = 'android';
	}
	if (isIOS) {
		phoneSystem = 'ios';
	}
});

//关闭提示音
$('#lub_voice').live('click', function() {
	$(this).toggleClass('close');
	if ($(this).hasClass('close')) {
		$(this).html('&#xe602;');
		voice = false;
	} else {
		$(this).html('&#xe601;');
		voice = true;
	}
});


$('.lub_chat_close .sure_close').live('click', function() {
	$('.lub_chat_close').hide();
	window.parent && window.parent.postMessage && window.parent.postMessage('closeChatBox', '*');
	if (socket) {
		socket.close(3001, JSON.stringify({ s: sessionId, a: luban_config.accessId }));
		clearTimeout(heartBeatTimeOut);
	}
});
$('.lub_chat_close .cancel_close').live('click', function() {
	$('.lub_chat_close').hide();
});

//请求异常
$('.lub_chat_error .sure_close').live('click',function() {
	$('.lub_chat_error,.lub_shade').hide();
});


//查看更多
$('#more_chat_log').live('click', function() {
	$('.show_more').remove();
	scrollTop = $('.lub_chat_wrap').height();
	chat_log_page += 1;
	openLubanChat();
	$(this).remove();
});

//留言
$('#leave_btn').live('click', function() {
	var content = $('#leave_textarea').val();
	var user = $('.leave_content .user').val();
	var tel = $('.leave_content .tel').val();
	var email = $('.leave_content .email').val();
	var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var phoneReg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
	if (!content) {
		leaveError('请填写留言内容');
		return;
	} else if (!user) {
		leaveError('请填写姓名');
		return;
	} else if (!tel) {
		leaveError('请填写电话');
		return;
	} else if (!email) {
		leaveError('请填写邮箱');
		return;
	} else if (tel && !phoneReg.test(tel)) {
		leaveError('电话格式不正确');
		return;
	} else if (email && !emailReg.test(email)) {
		leaveError('邮箱格式不正确');
		return;
	}
	sendLeave(content, user, tel, email);
});

//继续咨询
$('#lub_end_chat .continue_onsulting').live('click', function() {
	isSend = true;
	$('#lub_end_chat').hide();
	resetLubanAgent(null);
});

//关闭
$('#lub_end_chat #lub_close').live('click', function() {
	$('#lub_end_chat').hide();
	$('.lub_chat_close').hide();
	window.parent && window.parent.postMessage && window.parent.postMessage('closeChatBox', '*');
	if (socket) {
		socket.close(3001, JSON.stringify({ s: sessionId, a: luban_config.accessId }));
		clearTimeout(heartBeatTimeOut);
	}
	window.history.go(-1);
});
//服务评价
$('#lub_preview li').live('click',function() {
	$('#lub_preview li').removeClass("selectPreview");
	$(this).addClass("selectPreview");
	evaluationLeve = $(this).attr('data-leve');
})
$('#lub_preview_close').live('click',function() {
	$("#lub_preview,.lub_shade").hide();
	$('#lub_end_chat').hide();
	$('.lub_chat_close').hide();
	window.parent && window.parent.postMessage && window.parent.postMessage('closeChatBox', '*');
	if (socket) {
		socket.close(3001, JSON.stringify({ s: sessionId, a: luban_config.accessId }));
		clearTimeout(heartBeatTimeOut);
	}
})
$('#evaluation_btn').live('click',function(){
	var evaluationUrl = luban_config.lubanURL + luban_config.lub_evaluation;
	var data = {
		encrypt: luban_config.encrypt,
		appToken: luban_config.accessId,
		sessionId: sessionId,
		evaluation: evaluationLeve,
		content: $('#evaluationContent').val(),
	}
	chatUtils.ajaxRequest(evaluationUrl, data, function(res) {
		var str = evaAObj[Number(evaluationLeve)];
		chatUtils.appendLubInfo('<p>你给出了<span class="'+ str.label +'">'+ str.value +'</span></p>');
		if(!isevaluate) $('#lub_preview_close').click();
		$('#lub_preview li').removeClass("selectPreview");
		$('#evaluationContent').val('');
		$('#lub_preview,.lub_shade').hide();
		chatUtils.chatWindBottom();
	})
})

//对机器人回复信息进行反馈
$(document).on('click','#lub_service_wrap .has_solve',function(){
	var solveUrl = luban_config.lubanURL + luban_config.lub_robotFeed;
	var _this = $(this).parents('.isSolve');
	var data = {
		encrypt: luban_config.encrypt,
		appToken: luban_config.accessId,
		sessionId: sessionId,
		knowledge_id: $(this).parents('.solve').attr('data-id'),
		feedback: $(this).attr('data-id'),
	}
	$(this).parents('.solve').hide();
	_this.find('.ratedIng').show();
	chatUtils.ajaxRequest(solveUrl, data, function(res) {
		_this.find('.ratedIng').hide();
		_this.find('.isRated').show();
	})
})

$(document).on('click','.common_questions .question',function(){
	var content = $(this).attr('data-qs').split('.')[1];
	chatUtils.sedLubMsg(content,'normal');
})

//未识别手动转人工
$(document).on('click','#transfer_artificial',function(){
	chatUtils.sedLubMsg('转人工客服','normal');
	$('#lub_textarea_wrap .allocation').show();
	$(this).remove();
	$('transfer_artificial').remove();
})

$(document).on('click','#lub_textarea_wrap .artificial',function(){
	chatUtils.sedLubMsg('转人工客服','normal');
	$('#lub_textarea_wrap .allocation').show();
	$(this).hide();
})

//手动留言
$(document).on('click','#transfer_leave',function(){
	$('.lub_warp').hide();
	$('.leave_msg').show();
})

// 截图上传图片
// window.addEventListener('paste', pasteHandler);   pasteHandler= fun...
window.addEventListener('paste', function (e) {
	var items;
	if (e.clipboardData && e.clipboardData.items) {
		items = e.clipboardData.items;
		if (items) {
			items = Array.prototype.filter.call(items, function (element) {
				return element.type.indexOf("image") >= 0;
			});

			Array.prototype.forEach.call(items, function (item) {
				uploadType = 'image';
				var file = item.getAsFile();
				var blob = file;
				var reader = new FileReader();
				reader.onloadend = function (e) {
					var imgBase64 = e.target.result;  //    event.target.result.split(",")  [0]=data:image/png;base64  [1]=data
					var dataURI = imgBase64;
					var blob = dataURItoBlob(dataURI); // blob
					uploadNum += 1;
					var id = 'luban_img_'+ uploadNum;
					chatUtils.sedLubMsg(id, uploadType);

					var xhr = new XMLHttpRequest();
					var fd = new FormData();
					fd.append('appToken', luban_config.accessId);
					fd.append('encrypt', luban_config.encrypt);
					fd.append('image', blob, file.name);
					xhr.upload.addEventListener('progress', uploadImgProgress, false);
					xhr.addEventListener('load',  function(){ uploadImgComplete(event, id) }, false);
					xhr.addEventListener('error', function(){ uploadImgFailed(event, id) }, false);
					xhr.addEventListener('abort', function(){ uploadImgCanceled(event, id) }, false);
					xhr.open('POST', luban_config.lubanURL + luban_config.upload_image);
					xhr.send(fd);
					xhr.getAllResponseHeaders()

				};
				reader.readAsDataURL(blob);

			});
		}
	}
});


/**
 * base64  to blob二进制
 */
function dataURItoBlob(dataURI) {
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
	var byteString = atob(dataURI.split(',')[1]); //base64 解码
	var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
	var intArray = new Uint8Array(arrayBuffer); //创建视图

	for (var i = 0; i < byteString.length; i++) {
		intArray[i] = byteString.charCodeAt(i);
	}
	return new Blob([intArray], {type: mimeString});
}

