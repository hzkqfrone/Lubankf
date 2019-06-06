var lbHOST = 'https://www.lubankf.com/';
var luban_config = {
    chatHost: lbHOST,
    chatPage: lbHOST +"luban.html",
    pageUrl: 'https://cdn.lubankf.com/IM/',
    // pageUrl: './',
    companyConfigUrl: lbHOST + "api/website/web-site/get-info.htm",
    urlTitle: document.title,
    fromUrl: window.location.href,
    location: window.location.host,
    referrer: document.referrer || "",
    accessId: "",
    encrypt: "",
    autoShow: false,
};
var chatInitData = undefined;

(function(){
    var scripts = {
        localInit: "lb_service.js"
    }
    var paramsQuery = function (json) {
        json = json || {};
        var query_arr = [];
        json.__ = new Date().getTime();
        for (var key in json) {
            var val = json[key];
            query_arr.push(key + '=' + encodeURIComponent(val));
        }
        var query = query_arr.join('&').replace(/%20/g, '+');
        return query;
    }
    var lbService = {
        loadInitJs: function(src) {
            var el = document.createElement("script");
            el.setAttribute("charset", "UTF-8");
            el.src = src;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(el, s)
        }

    }
    String.prototype.trim = function () {
        var value = "";
        return "undefined" == typeof this ? "" : (value = this.replace(/^\s*/g, ""), value.replace(/\s*$/g, ""));
    };
   
    var Configure = {
        init: function () {
            this.getAccessId();
            var data = {
                appToken: luban_config.accessId,
                location: encodeURIComponent(window.location.host),
                callbackF: "getChatConfig"
            }
            this.loadLubInfo(luban_config.companyConfigUrl, data);
        },

        parseQuerystring : function (queryStr) {
            if ("string" != typeof queryStr)return {};
            var queryStr = queryStr.trim();
            if ("" === queryStr)return {};

            var json = {};
            try {
                for (var pairs = queryStr.split("&"), i = 0; i < pairs.length; i++) {
                    var kv = pairs[i].split("=");
                    kv[0] && kv[1] && (json[kv[0]] = decodeURIComponent(kv[1]))
                }
            } catch (e) {

            }
            return json;
        },
        getAccessId: function () {
            var s = document.getElementsByTagName("script");
            var src;
            for (var i = 0, n = s.length; i < n; i++) {
                src = s[i]["src"];
                if (src && src.indexOf(scripts.localInit) > -1) {
                    src = src.toLowerCase();
                    break;
                }
            }
            if (src && src.indexOf("accessid=") > 0) {
                var querys = this.parseQuerystring(src.substr(src.indexOf("?") + 1));
                luban_config.accessId = querys.accessid;
                if(querys.autoShow){
                    luban_config.autoShow = querys.autoShow;
                }
                if(querys.wap){
                    luban_config.wap = querys.wap;
                }
            }
        },

        loadLubInfo : function (url, data) {
            var query = paramsQuery(data);
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.setAttribute("charset", "UTF-8");
            script.src = url + "?" + query;
            try {
                document.body.appendChild(script);
            } catch (e) {
                window.onload = function(){
                    document.body.appendChild(script);
                };
            }
        }

    };
    Configure.init();
    window.getChatConfig = function (c) {
        if(c.code == 0){
            chatInitData = c.data;
            luban_config.encrypt = chatInitData.encrypt;
            lbService.loadInitJs(luban_config.pageUrl + 'js/luban_init.js');
        }
    };
})()

