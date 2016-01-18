(function() {
	if (!window.qcLib) {
		window['qcLib'] = {};
	}
    // 获取当前样式 兼容 FF和 IE
    HTMLElement.prototype.__defineGetter__("currentStyle", function () { 
        return this.ownerDocument.defaultView.getComputedStyle(this, null); 
    });

    function getElementsByClassName(node, className) {
        if (document.getElementsByClassName) {
            return node.getElementsByClassName(className);
        } else if (!document.getElementsByClassName) {           
            var children = node.getElementsByTagName('*'); 
            var nodes = new Array(); 
            for (var i=0; i<children.length; i++){ 
                var child = children[i]; 
                var classNames = child.className.split(' '); 
                for (var j=0; j<classNames.length; j++){ 
                    if (classNames[j] == className){ 
                    nodes.push(child); 
                    break; 
                    } 
                } 
            } 
            return nodes;          
        }
    }
    window['qcLib']['getElementsByClassName'] = getElementsByClassName;

	function addEvent(node, type, listener) {
    	if (node.addEventListener) { // W3C-chrome、safari、opera
    		node.addEventListener(type, listener, false);
    		return true;
    	} else if (node.attachEvent) { // IE 私有
    		node['e'+type+listener] = listener;
    		node[type+listener] = function() {
    			node['e'+type+listener](window.event); // IE上的event是window的属性
    		};
    		node.attachEvent('on'+type, node[type+listener]);
    		return true;
    	};
    	return false;
    }
    window['qcLib']['addEvent'] = addEvent;

    function removeEvent(node, type, listener) {
    	if (node.removeEventListener) {
    		node.removeEventListener(type, listener, false);
    		return true;
    	} else if (node.detachEvent) {
    		node.detachEvent("on"+type, node[type+listener]);
    		node[type+listener] = null;
    		return true;
    	}
    	return false;
    }
    window['qcLib']['removeEvent'] = removeEvent;

    function insertAfter(node, referenceNode) {
        return referenceNode.parentNode.insertBefore(
    node, referenceNode.nextSibling
        );
    }
    window['qcLib']['insertAfter'] = insertAfter;

    function prependChild(parent, newChild) {
        if (parent.firstChild) {
            parent.insertBefore(newChild, parent.firstChild);
        } else {
            parent.appendChild(newChild);
        }
        return parent;
    }
    window['qcLib']['prependChild'] = prependChild;

    function removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }
        return parent;
    }
    window['qcLib']['removeAllChildren'] = removeAllChildren;

    function getBrowserWindowSize() {
        var de = document.documentElement;
        return {
            'width': (
                window.innerWidth
                || (de && de.clientWidth)
                || document.body.clientWidth
            ),
            'height': (
                window.innerHeight
                || (de && de.clientHeight)
                || document.body.clientHeight
            )
        }
    }
    window['qcLib']['getBrowserWindowSize'] = getBrowserWindowSize;

    // 兼容所有浏览器的XHR
    // function createXHR(){
    //     if (typeof XMLHttpRequest != "undefined"){
    //             return new XMLHttpRequest();
    //         } else if (typeof ActiveXObject != "undefined"){
    //             if (typeof arguments.callee.activeXString != "string"){
    //                 var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
    //                 "MSXML2.XMLHttp"],
    //                 i, len;
    //                 for (i=0,len=versions.length; i < len; i++){
    //                     try {
    //                         new ActiveXObject(versions[i]);
    //                         arguments.callee.activeXString = versions[i];
    //                         break;
    //                     } catch (ex){
    //                     //跳过
    //                     }
    //                 }
    //             }
    //             return new ActiveXObject(arguments.callee.activeXString);
    //         } else {
    //         throw new Error("No XHR object available.");
    //     }
    // }
    // 惰性载入 XHR
    function createXHR(){
        if (typeof XMLHttpRequest != "undefined"){
            createXHR = function(){
                return new XMLHttpRequest();
            };
        } else if (typeof ActiveXObject != "undefined"){
            createXHR = function(){
                if (typeof arguments.callee.activeXString != "string"){
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"],
                    i, len;
                    for (i=0,len=versions.length; i < len; i++){
                        try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                        } catch (ex){
                            //skip
                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            };
        } else {
            createXHR = function(){
                throw new Error("No XHR object available.");
            };
        }
        return createXHR();
    }
    window['qcLib']['createXHR'] = createXHR;


    // 客户端判断
    function client() {
        //呈现引擎
        var engine = {
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera: 0,
            //完整的版本号
            ver: null
        };
        //浏览器
        var browser = {
            //主要浏览器
            ie: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,
            //具体的版本号
            ver: null
        };
        //平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            x11: false,
            //移动设备
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,
            //游戏系统
            wii: false,
            ps: false
        };
        //检测呈现引擎和浏览器
        var ua = navigator.userAgent;
        if (window.opera){
            engine.ver = browser.ver = window.opera.version();
            engine.opera = browser.opera = parseFloat(engine.ver);
        } else if (/AppleWebKit\/(\S+)/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.webkit = parseFloat(engine.ver);
            //确定是 Chrome 还是 Safari
            if (/Chrome\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.chrome = parseFloat(browser.ver);
            } else if (/Version\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.safari = parseFloat(browser.ver);
            } else {
                //近似地确定版本号
                var safariVersion = 1;
                if (engine.webkit < 100){
                    safariVersion = 1;
                } else if (engine.webkit < 312){
                    safariVersion = 1.2;
                } else if (engine.webkit < 412){
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }
                browser.safari = browser.ver = safariVersion;
            }
        } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.khtml = browser.konq = parseFloat(engine.ver);
        } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.gecko = parseFloat(engine.ver);
            //确定是不是 Firefox
            if (/Firefox\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.firefox = parseFloat(browser.ver);
            }
        } else if (/MSIE ([^;]+)/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.ie = browser.ie = parseFloat(engine.ver);
        }
        //检测浏览器
        browser.ie = engine.ie;
        browser.opera = engine.opera;


        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        //检测 Windows 操作系统
        if (system.win){
            if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
                if (RegExp["$1"] == "NT"){
                    switch(RegExp["$2"]){
                        case "5.0":
                        system.win = "2000";
                        break;
                        case "5.1":
                        system.win = "XP";
                        break;
                        case "6.0":
                        system.win = "Vista";
                        break;
                        case "6.1":
                        system.win = "7";
                        break;
                        default:
                        system.win = "NT";
                        break;
                    }
                } else if (RegExp["$1"] == "9x"){
                    system.win = "ME";
                } else {
                    system.win = RegExp["$1"];
                }
            }
        }
        //移动设备
        system.iphone = ua.indexOf("iPhone") > -1;
        system.ipod = ua.indexOf("iPod") > -1;
        system.ipad = ua.indexOf("iPad") > -1;
        system.nokiaN = ua.indexOf("NokiaN") > -1;
        //windows mobile
        if (system.win == "CE"){
            system.winMobile = system.win;
        } else if (system.win == "Ph"){
            if(/Windows Phone OS (\d+.\d+)/.test(ua)){
                system.win = "Phone";
                system.winMobile = parseFloat(RegExp["$1"]);
            }
        }
        //检测 iOS 版本
        if (system.mac && ua.indexOf("Mobile") > -1){
            if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
                system.ios = parseFloat(RegExp.$1.replace("_", "."));
            } else {
                system.ios = 2; //不能真正检测出来，所以只能猜测
            }
        }
        //检测 Android 版本
        if (/Android (\d+\.\d+)/.test(ua)){
            system.android = parseFloat(RegExp.$1);
        }
        //游戏系统
        system.wii = ua.indexOf("Wii") > -1;
        system.ps = /playstation/i.test(ua);
        //返回这些对象
        return {
            engine: engine,
            browser: browser,
            system: system
        };
    }
    window['qcLib']['client'] = client;
})();