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
})();