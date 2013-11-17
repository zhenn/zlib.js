/*
 * @zLib.js
 * Javascript Utility for web development.
 * 反馈 : www.men-ideal.com
 * @author zhenn
 * @version 1.0.1
 * Email : zhenn.life@gmail.com
 * www.men-ideal.com ? 2009 振之博文--一个前端开发者的日志
 */
/* All users are free to use zLib.js, but the author to retain copyright*/
var zLib = window.zLib = window.$ = function(param1,param2){
    /*模拟函数的重载*/
    if(arguments.length==1){
        return new zlib(param1);
    }
    if(arguments.length==2){
        return new zlib(param1,param2);
    } 
};

function zlib(param1,param2){
    this.elements = [];
    if(arguments.length == 1){
        if(typeof param1=="string"){
            switch(param1.charAt(0)){
            	/*$("#id")*/
                case "#":
                    this.elements.push(document.getElementById(param1.substring(1,param1.length)));
                    break;
                /*$(".className")*/
                case ".":
                    var doms = document.getElementsByTagName("*");
                    for(var i=0;i<doms.length;i++){
                        var reg = new RegExp("(^|\\s)"+param1.substring(1,param1.length)+"(\\s|$)","g");
                        if(doms[i].className.match(reg)!=null){
                            this.elements.push(doms[i]);
                        }
                    }
                    break;
                /*$("*tagName")*/
                case "*":
                    this.elements.push(document.createElement(param1.substring(1,param1.length)));
                    break;
                /*$("tagName")*/
                default:
                    this.elements = document.getElementsByTagName(param1); 
            }
        }
        else if(typeof param1 == "object"&&param1 != null){
            /*$(zlib)*/
            if(param1.elements){
                this.elements.push(param1.elements[0]);
            }else{
                /*$(dom)*/
                this.elements.push(param1);
            }
        }else{
        	/*$(null)*/
        	this.elements = [];	
        }
    }
    if(arguments.length == 2){
        if(typeof param1=="string"&&param1.charAt(0)=="#"&&typeof param2=="string"){
        	/*$("#id",".clasName")*/
			if(param2.charAt(0)=="."){
				var doms = document.getElementById(param1.substring(1,param1.length)).getElementsByTagName("*");
				for(var i=0;i<doms.length;i++){
					var reg = new RegExp("(^|\\s)"+param2.substring(1,param2.length)+"(\\s|$)","g");
					if(doms[i].className.match(reg)!=null){
						this.elements.push(doms[i]);
					}
				}	
			}else{
				/*$("#id","tagName")*/
            	this.elements = document.getElementById(param1.substring(1,param1.length)).getElementsByTagName(param2);
			}
        }
        if(typeof param1=="object"&&typeof param2=="string"){
            if(param1.nodeType==1||param1.nodeType==9){
            	/*$(dom,".className")*/
            	if(param2.charAt(0)=="."){
            		var doms = param1.getElementsByTagName("*");
					for(var i=0;i<doms.length;i++){
						var reg = new RegExp("(^|\\s)"+param2.substring(1,param2.length)+"(\\s|$)","g");
						if(doms[i].className.match(reg)!=null){
							this.elements.push(doms[i]);
						}
					}	
            	}else{
            		/*$(dom,"tagName")*/
            		this.elements = param1.getElementsByTagName(param2);	
            	} 
            }else{
            	/*$(zlib,".className")*/
            	if(param2.charAt(0)=="."){
            		var doms = param1.elements[0].getElementsByTagName("*");
					for(var i=0;i<doms.length;i++){
						var reg = new RegExp("(^|\\s)"+param2.substring(1,param2.length)+"(\\s|$)","g");
						if(doms[i].className.match(reg)!=null){
							this.elements.push(doms[i]);
						}
					}	
            	}else{
            		/*$(zlib,"tagName")*/
            		this.elements = param1.elements[0].getElementsByTagName(param2);	
            	}
            }
        }
    }
};
 
 
zlib.fn = zlib.prototype = {
    /*add by zhenn in 2010-01-16*/
    /*扩展zLib元素集来提供新的方法，通常用来制作插件，如果扩展的方法名和已经存在的方法有冲突，则会弹出提示信息，并且不会破坏或者覆盖zlib原型中已经存在的方法
     *参数:-> obj(Object)：包含一系列方法的对象，用来扩展zlib原型的方法
     *返回值: zlib
    */
    extend: function(obj){
    	var arr = [];
    	for(var i in obj){
    		for(var j in this){
    			if(j==i){
    				arr.push(i);
    			}
    		}
    		if(arr.length==0){
	    		this[i] = obj[i];	
	    	}else{
	    		for(var i=0;i<arr.length;i++){
		    		alert("扩展的原型方法名和已有的方法有冲突！\n具体为:"+arr[i]);	
		    	}
	    	}
    	}
    	return this;
    },
    /*迭代程序，遍历对象中每一个dom元素都执行一次回调函数
     *参数:-> callback(Function)：回调函数
     *返回值: zlib
    */
    each: function(callback){
        /*为了保证参数的不变性，备份数据*/
        var arr = new Array();
        for(var i=0;i<this.elements.length;i++){
            arr.push(this.elements[i]);
        }
        for(var i=0;i<arr.length;i++){
            callback.call(this,arr[i])
        }
		return this;
    },
    /*有条件寻找一个dom对象来执行回调函数
     *参数:-> filter(Numer or String)：寻找dom元素的两种格式
     *        callback(Function)：回调函数
     *返回值: zlib
    */
    one: function(filter,callback){
        for(var i=0;i<this.elements.length;i++){
            if(typeof filter=="number"&&filter==i){
                callback.call(this,this.elements[i]);
            }
            if(typeof filter=="string"){
                filter = filter.split(":");
                if(filter[0]=="class"&&document.all){
                    filter[0] = "className";
                }
                for(var i=0;i<this.elements.length;i++){
                    if(this.elements[i].getAttribute(filter[0])==filter[1]){
                        callback.call(this,this.elements[i]);
                    }
                }
            }
        }
		return this;
    },
    /*从实例对象中返回一个和索引值相匹配的实例对象，以便调用zlib类中的方法
     *参数:-> index(Numer)：索引值
     *返回值: zlib
    */
    getClass: function(index){
        return $(this.elements[index])
    },
    /*返回所匹配的dom元素或者dom元素集
     *参数:-> index(Number)：索引值
     *返回值：dom元素
    */
    getDom: function(index){
        if(typeof index=="undefined"){
            return this.elements;
        }
        return this.elements[index];
    },
    /*返回所匹配的dom元素集的length
     *参数:-> 无
     *返回值: Number
    */
    size: function(){
        return this.elements.length;
    },
    
    
    
    
    /*以下各种方法，如返回zlib的实例对象，则可继续链式调用，否则不能再继续链式调用*/
    
    /*给所匹配元素赋innerHTML值，或者返回所匹配元素中第一个元素的innerHTML值
     *参数:-> val(String)：可选参数，用于设定innerHTML的值
     *返回值: 1,传参，则为赋值运算，返回zlib
     *        2,无参，返回String，所匹配元素集中第一个元素的innerHTML 值  
    */
    html: function(val){
        if(typeof val=="undefined"){
            return this.elements[0].innerHTML;
        }
        this.each(function(el){
            el.innerHTML = val;
        });
        return this;
    },
    
    
    
    /*css相关
     *动态载入、删除样式表addStyleSheet
     *给dom元素增加\删除className
     *动态设置元素css样式一个属性或者多个属性
     *setCss ,一次设置多条属性，传入的参数为对象类型(object)
     *getWidth,getHeight 获取元素的潜在宽度或者高度，无论是元素隐藏还是没有设置CSS，都可以取到
     *getCss,setOpacity,
    */
    
    /*判断所匹配元素是否含有所匹配的className
     *参数:-> classname(String)：要匹配的className
     *返回值: Boolean
    */
    hasClass: function(classname){
        var reg = new RegExp("(^|\\s)"+classname+"(\\s|$)","g");
        return this.elements[0].className.match(reg)==null?false:true;   
    },
    /*给所匹配元素添加className
     *参数:-> classname(String)：要添加的className
     *返回值: zlib
    */
    addClass: function(classname){
        this.each(function(el){
            el.className += el.className.length>0?" "+classname:classname;
        });
        return this;
    },
    /*删除所匹配元素的className
     *参数:-> classname(String)：要删除的className
     *返回值: zlib
    */
    removeClass: function(classname){
        var reg = new RegExp("( ?|^)"+classname+"\\b","g");
        this.each(function(el){
            el.className = el.className.replace(reg,"");
        });
        return this;
    },
    /*设置所匹配元素的单个css样式
     *参数:-> property(String)：要设置的css属性名
     *        value(String)：要设置的css属性值
     *返回值: zlib
    */
    setStyle: function(property,value){
        /*去掉property中的"-"，保证传入的参数可以含"-"*/        
        this.each(function(el){
            var arr = property.split("");
            for(var i=0;i<arr.length;i++){
                if(arr[i]=="-"){
                    arr[i+1] = arr[i+1].toUpperCase();
                    arr.splice(i,1);
                }
            }
            var s = arr.join("");
            el.style[s] = value;
        });
        return this;
    },
    /*设置所匹配元素的一组css样式
     *参数:-> styles(Object)：要设置的css样式，如{color:"#f00",height:"100px"}
     *返回值: oldStyle(Object)
    */
    setCss: function(styles){
        var old = {};
        this.each(function(el){
            for(var pro in styles){
                /*记录旧的属性值，仅仅是内嵌的样式*/
                old[pro] = el.style[pro];
                el.style[pro] = styles[pro];         
            }
        });
        /*返回旧的内嵌的CSS属性对象（与设置的一组属性相对应），以便进行恢复操作*/
        return old;
    },
    /*恢复所匹配元素内嵌的CSS样式
     *参数:-> styles(Object)
     *返回值: zlib
    */
    restoreCss: function(styles){
        this.each(function(el){
            for(var pro in styles){
                el.style[pro] = styles[pro]; 
            }
        });
        return this;
    },
    /*获取所匹配元素中第一个元素的css样式
     *参数:-> property(String)：要获取的css属性名
     *返回值: String，要获取的css属性值
    */
    getCss: function(property){
        if(this.elements[0].style[property]){       
        	return this.elements[0].style[property];
        }
        else if(this.elements[0].currentStyle){
            return this.elements[0].currentStyle[property];
        }
        else if(document.defaultView && document.defaultView.getComputedStyle){   
        	property = property.replace(/([A-Z])/g,'-$1').toLowerCase(); 
        	var s = document.defaultView.getComputedStyle(this.elements[0],''); 
        	return s&&s.getPropertyValue(property);  
        }
        else{ 
        	return null; 
        }
    },
    /*设置所匹配元素的不透明度
     *参数:-> level(Number)
     *返回值: zlib
    */
    setOpacity: function(level){
        this.each(function(el){
            if(el.filters){
                el.style.filter = "alpha(opacity=" + level + ")";
                el.style.zoom = 1;
            }else{
                el.style.opacity = level/100;
            }
        });
        return this;
    },
    /*获取所匹配元素中第一个元素的潜在高度，无论是元素隐藏还是没有设置CSS高度
     *参数:-> 无
     *返回值: Number，高度
    */
    getHeight: function(){
        if(this.getCss("display")!="none"){
            return this.elements[0].offsetHeight||parseInt(this.getCss("height"));
        }
        var old = this.setCss({display:"block",visibility:"hidden",position:"absolute"});
        var h = this.elements[0].clientHeight||parseInt(this.getCss("height"));
        this.restoreCss(old);
        /*type h=="number"不含"px"*/
        return h;
    },
    /*获取所匹配元素的潜在宽度，无论是元素隐藏还是没有设置CSS宽度
     *参数:-> 无
     *返回值: Number，宽度
    */
    getWidth: function(){
        if(this.getCss("display")!="none"){
            return this.elements[0].offsetWidth||parseInt(this.getCss("width"));
        }
        var old = this.setCss({display:"block",visibility:"hidden",position:"absolute"});
        var w = this.elements[0].clientWidth||parseInt(this.getCss("width"));
        this.restoreCss(old);
        /*type h=="number"不含"px"*/
        return w;
    },
    
    
    
    
    /*dom属性相关*/
    
    /*获得所匹配元素中第一个元素的属性name的值，或者给所匹配元素赋单个属性值
     *参数:-> name(String)，所要操作的属性名
              value(String)，可选参数，所要操作的属性值
     *返回值: 1，实参数为1，则为取值操作，返回String，为所匹配元素中第一个元素的属性name的值   
              2，实参数为2，则为赋值操作，返回zlib      
    */
    attr: function(name,value){
        if(document.all&&name=="class"){
            name = "className";
        }
        if(typeof value=="undefined"){
            return this.getDom(0).getAttribute(name);
        }
        this.each(function(el){
            el.setAttribute(name,value);
        });
        return this;    
    },
    /*给所匹配元素赋一组属性值
     *参数:-> pros(Object)：所要操作的一组属性,不包括class（class是JavaScript关键字）,如要添加className,可使用函数addClass或者attr
     *返回值: zlib
    */
    attrs: function(pros){
        this.each(function(el){
            for(var i in pros){
                el.setAttribute(i,pros[i]);
            }
        });
        return this;
    },
    /*删除所匹配元素单个或一组属性
     *参数:-> name(String or Array)：所要操作的一组属性
     *返回值: zlib
    */
    removeAttr: function(name){
        if(typeof name=="string"){
            if(document.all&&name=="class"){
                name = "className";
            }
            this.each(function(el){
                el.removeAttribute(name);
            });
        }else if(zlib.getType(name)=="array"){
            this.each(function(el){
                for(var i=0;i<name.length;i++){
                    if(document.all&&name[i]=="class"){
                        name[i] = "className";
                    }
                    el.removeAttribute(name[i]);
                }
            });
            
        }
        return this;
    },
    
    
    
    
    /*元素节点的操作相关（文档操作）
     *寻找并返回上一个元素节点、下一个元素节点、第一个子元素节点、最后一个子元素节点以及N级父节点
     *复制并返回新的元素节点、插入新的节点到某个固定位置并返回新的节点、删除节点
     *插入新节点包括addElem,insertBefore,insertAter
    */
    
    /*匹配所匹配元素中第一个元素的上一个兄弟元素节点（过滤非元素节点）
     *参数:-> 无
     *返回值：zlib
    */
    prev: function(){
        var elem = this.elements[0].previousSibling;
        while(elem&&elem.nodeType!=1){
            elem = elem.previousSibling;
        }
        return $(elem);
    },
    /*匹配所匹配元素中第一个元素的下一个兄弟元素节点（过滤非元素节点）
     *参数:-> 无
     *返回值：zlib
    */
    next: function(){
        var elem = this.elements[0].nextSibling;
        while(elem&&elem.nodeType!=1){
            elem = elem.nextSibling;
        }
        return $(elem);
    },
    /*匹配所匹配元素中第一个元素的第一个子元素节点（过滤非元素节点）
     *参数:-> 无
     *返回值：zlib
    */
    first: function(){
        var elem = this.elements[0].firstChild;
        while(elem&&elem.nodeType!=1){
            elem = elem.nextSibling;
        }
        return $(elem);
    },
    /*匹配所匹配元素中第一个元素的最后一个子元素节点（过滤非元素节点）
     *参数:-> 无
     *返回值：zlib
    */
    last: function(){
        var elem = this.elements[0].lastChild;
        while(elem&&elem.nodeType!=1){
            elem = elem.previousSibling;
        }
        return $(elem);
    },
    /*匹配所匹配元素中第一个元素的父节点元素
     *参数:-> num(Number)：匹配父元素的层级，默认值为1
     *返回值：zlib
    */
    parent: function(num){
        num = num || 1;
        var elem = this.elements[0];
        for(var i=0;i<num;i++){
            if(elem!=null){ 
                elem = elem.parentNode;
            }
        }
        return $(elem); 
    },
    /*删除所匹配元素
     *参数:-> 无
     *返回值：无
    */
    remove: function(){
        this.each(function(el){
            el.parentNode.removeChild(el);     
        });
    },
    /*删除所匹配元素的所有子元素
     *参数:-> 无
     *返回值：zlib
    */
    empty: function(){
        this.each(function(el){
            el.innerHTML = "";
        });
        return this;
    },
    /*复制所匹配元素中第一个元素
     *参数:-> 无
     *返回值：zlib
    */
    clone: function(){
        var newdom = this.getDom(0).cloneNode(true);
        return $(newdom);
    },
    
    /*内部插入*/
    
    /*插入新元素到所匹配元素的最后子节点之后
     *参数:-> para(zlib)：可以是用$创造的新对象，不能是已经存在于document中的对象，以避免id冲突
     *        para(String) 带有完整html标签的字符串，如"<div>i'm new element!</div>",单标记标签不可用这种方法
     *返回值：zlib，插入的新对象
    */
    append: function(para){
        switch(typeof para){
            case "string":
                var a = [] , newElem = $("*"+para.substring(para.indexOf("<")+1,para.indexOf(">")));
                newElem.html(para.substring(para.indexOf(">")+1,para.lastIndexOf("<")));
                this.each(function(el){
                    var nel = newElem.clone().getDom(0);
                    a.push(nel);
                    el.appendChild(nel);
                });
                newElem.elements = a;
                return newElem;
            case "object":
                if(para.elements){
                    var a = [];
                    this.each(function(el){
                        var nel = para.clone().getDom(0);
                        a.push(nel);
                        el.appendChild(nel);
                    });
                    para.elements = a;
                    return para;
                }
        }
    },
    /*把所匹配元素插入到目标元素中第一个元素的最后一个子节点之后
     *所匹配元素可以是已经存在于document的对象，也可以是create的新对象（不是dom元素）
     *参数:-> para(zlib) 必须是$取得的对象
     *返回值：zlib，所匹配对象
    */
    appendTo: function(para){
        /*创造一个面包屑*/
        var breadCrumb = document.createDocumentFragment();
        if(typeof para!="object"||para.nodeType==1){
            return false;
        }
        this.each(function(el){
            breadCrumb.appendChild(el);
        });
        para.getDom(0).insertBefore(breadCrumb,null);
        return this;
    },
    /*插入新元素到所匹配元素的第一个子节点之前
     *参数:-> para(zlib)：可以是用$创造的新对象，不能是已经存在于document中的对象，以避免id冲突
     *        para(String) 带有完整html标签的字符串，如"<div>i'm new element!</div>"
     *返回值：zlib，插入的新对象
    */
    prepend: function(para){
        switch(typeof para){
            case "string":
                var a = [] , that = this, newElem = $("*"+para.substring(para.indexOf("<")+1,para.indexOf(">")));
                newElem.html(para.substring(para.indexOf(">")+1,para.lastIndexOf("<")));
                this.each(function(el){
                    var nel = newElem.clone().getDom(0);
                    a.push(nel);
                    el.insertBefore(nel,el.firstChild);
                });
                newElem.elements = a;
                return newElem;
            case "object":
                if(para.elements){
                    var a = [];
                    this.each(function(el){
                        var nel = para.clone().getDom(0);
                        a.push(nel);
                        el.insertBefore(nel,el.firstChild);
                    });
                    para.elements = a;
                    return para;
                }
        }
    },
    /*把所匹配元素插入到目标元素中第一个元素的第一个子节点之前
     *所匹配元素可以是已经存在于document的对象，也可以是create的新对象（不是dom元素）
     *参数:-> para(zlib) 必须是$取得的对象
     *返回值：zlib，所匹配对象
    */
    prependTo: function(para){        
        /*创造一个面包屑*/
        var breadCrumb = document.createDocumentFragment();
        if(typeof para!="object"||para.nodeType==1){
            return false;
        }
        this.each(function(el){
            breadCrumb.insertBefore(el,null);
        });
        para.getDom(0).insertBefore(breadCrumb,para.getDom(0).firstChild);
        return this;
    },
    
    /*外部插入*/
    /*插入新元素到所匹配元素的前面
     *参数:-> para(zlib)：可以是用$创造的新对象，不能是已经存在于document中的对象，以避免id冲突
     *        para(String) 带有完整html标签的字符串，如"<div>i'm new element!</div>"
     *返回值：zlib，插入的新对象
    */
    before: function(para){
        switch(typeof para){
            case "string":
                var a = [] , that = this, newElem = $("*"+para.substring(para.indexOf("<")+1,para.indexOf(">")));
                newElem.html(para.substring(para.indexOf(">")+1,para.lastIndexOf("<")));
                this.each(function(el){
                    var nel = newElem.clone().getDom(0);
                    a.push(nel);
                    el.parentNode.insertBefore(nel,el);
                });
                newElem.elements = a;
                return newElem;
            case "object":
                if(para.elements){
                    var a = [];
                    this.each(function(el){
                        var nel = para.clone().getDom(0);
                        a.push(nel);
                        el.parentNode.insertBefore(nel,el);
                    });
                    para.elements = a;
                    return para;
                }
        }
    },
    /*插入新元素到所匹配元素的后面
     *参数:-> para(zlib)：可以是用$创造的新对象，不能是已经存在于document中的对象，以避免id冲突
     *        para(String) 带有完整html标签的字符串，如"<div>i'm new element!</div>"
     *返回值：zlib，插入的新对象
    */
    after: function(para){
        switch(typeof para){
            case "string":
                var a = [] , that = this, newElem = $("*"+para.substring(para.indexOf("<")+1,para.indexOf(">")));
                newElem.html(para.substring(para.indexOf(">")+1,para.lastIndexOf("<")));
                this.each(function(el){
                    var nel = newElem.clone().getDom(0);
                    a.push(nel);
                    el.parentNode.insertBefore(nel,el.nextSibling);
                });
                newElem.elements = a;
                return newElem;
            case "object":
                if(para.elements){
                    var a = [];
                    this.each(function(el){
                        var nel = para.clone().getDom(0);
                        a.push(nel);
                        el.parentNode.insertBefore(nel,el.nextSibling);
                    });
                    para.elements = a;
                    return para;
                }
        }
    },
    /*把所匹配元素插入到目标元素的第一个元素之前
     *所匹配元素可以是已经存在于document的对象，也可以是create的新对象（不是dom元素）
     *参数:-> para(zlib) 必须是$取得的对象
     *返回值：zlib，所匹配对象
    */
    insertBefore: function(para){        
        /*创造一个面包屑*/
        var breadCrumb = document.createDocumentFragment();
        if(typeof para!="object"||para.nodeType==1){
            return false;
        }
        this.each(function(el){
            breadCrumb.insertBefore(el,null);
        });
        para.getDom(0).parentNode.insertBefore(breadCrumb,para.getDom(0));
        return this;
    },
    /*把所匹配元素插入到目标元素的第一个元素之后
     *所匹配元素可以是已经存在于document的对象，也可以是create的新对象（不是dom元素）
     *参数:-> para(zlib) 必须是$取得的对象
     *返回值：zlib，所匹配对象
    */
    insertAfter: function(para){        
        /*创造一个面包屑*/
        var breadCrumb = document.createDocumentFragment();
        if(typeof para!="object"||para.nodeType==1){
            return false;
        }
        this.each(function(el){
            breadCrumb.insertBefore(el,null);
        });
        para.getDom(0).parentNode.insertBefore(breadCrumb,para.getDom(0).nextSibling);
        return this;
    },
    
    
    
    
    
    /*为所匹配元素增加事件监听(绑定事件)
     *参数:-> eventType(String)：绑定的事件类型，如"click","load","mouseover","keydown"...
     *        callback(Function)：响应事件的函数
     *返回值: zlib
    */
    bindEvent: function(eventType,callback){
        this.each(function(el){
            if(el.addEventListener){   
                el.addEventListener(eventType,callback,false);
            }else if(el.attachEvent){
                /*改写attachEvent方法来解决attachEvent中this指向问题（如不做处理，this始终指向window）*/        
                var evTypeRef = '__' + eventType;   
                if(!el[evTypeRef]){   
                    el[evTypeRef] = [];      
                    var orgEvent=el['on'+eventType];   
                    if(orgEvent){
                        el[evTypeRef][0] = orgEvent;   
                    }
                    /*此处调用zlib类的静态方法*/
                    el['on'+eventType] = zlib.IEEventHandler;   
                }else{   
                    for(var ref in el[evTypeRef]){   
                        if(el[evTypeRef][ref] === callback) return;   
                    }   
                }   
                el[evTypeRef][el[evTypeRef].length] = callback;
            }
        });
        return this;
    },
	
	/*add by zhenn in 2010-01-21*/
	/*为所匹配元素删除事件监听(绑定事件)
     *参数:-> eventType(String)：绑定的事件类型，如"click","load","mouseover","keydown"...
     *        callback(Function)：响应事件的函数
     *返回值: zlib
    */
	removeEvent: function(eventType,callback){
		this.each(function(el){
			if(el.removeEventListener){
				el.removeEventListener(eventType,callback,false);
				
			}else if(el.detachEvent){
				/*依改写的attachEvent的方式，来模拟detachEvent,从el[evTypeRef]中删除callback*/
				var evTypeRef = '__' + eventType;
				for(var i=el[evTypeRef].length-1;i>=0;i--){
					if(el[evTypeRef][i]===callback){
						el[evTypeRef].splice(i,1);
					}
				}
			}
		});
		return this;
	},
    
    
    
    
    
    /*动画相关
    *包括滑动、渐隐渐现、以及二者兼有！
    *toggle功能
    *设置回调函数，为可选项
    */
    /*向下滑动，逐渐显示（只对display:none的元素有效）
     *注意：调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，滑动的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    slideDown: function(speed,callback){
        if(this.getCss("display")=="none"){
            callback = callback||function(){};
            var fullHeight = this.getHeight();
            var h = this.getDom(0).offsetHeight||0;
            var that = this;
            var speednum;
            if(speed=="fast"){
                speednum = fullHeight*5/100;
            }else if(speed=="slow"){
                speednum = fullHeight*1/100;
            }else{
                speednum = fullHeight*3/100;
            }
            this.setCss({overflow:"hidden",height:"1px",display:"block"});
            var timer = setInterval(function(){
                h += speednum;
                if(h>=fullHeight){
                    that.setStyle("height",fullHeight+"px");
                    clearInterval(timer);
                    callback();
                }else{
                    that.setStyle("height",h+"px");
                }
            },10);        
        }
    },
    /*向上滑动，逐渐隐藏（只对非display:none的元素有效）
     *注意：调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，滑动的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    slideUp: function(speed,callback){
        if(this.getCss("display")!="none"){
            callback = callback||function(){};
            var fullHeight = this.getHeight();   
            var h = fullHeight;
            var speednum;
            var that = this;
            if(speed=="fast"){
                speednum = fullHeight*5/100;;
            }else if(speed=="slow"){
                speednum = fullHeight*1/100;;
            }else{
                speednum = fullHeight*3/100;;
            }
            this.setCss({overflow:"hidden"});
            var timer = setInterval(function(){
                h -= speednum;
                if(h<=0){
                    that.setCss({display:"none",height:""});
                    clearInterval(timer);
                    callback();
                }else{
                    that.setCss({height:h+"px"});
                }
            },10);   
        }
    },
    /*根据所匹配元素的显示状态选择执行slideDown或slideUp
     *注意：调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，滑动的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    slideToggle: function(speed,callback){
        if(this.getCss("display")=="none"){
            this.slideDown(speed,callback);    
        }
        else{
            this.slideUp(speed,callback);
        }
    },
    /*通过设置元素不透明度来逐渐显示所匹配元素（只对display:none元素有效）
     *参数:-> speed(String)，为可选参数，渐显的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    fadeIn: function(speed,callback){
        if(this.getCss("display")=="none"){
            callback = callback||function(){};
            var l = 0;
            var speednum;
            var that = this;
            if(speed=="fast"){
                speednum = 5;
            }else if(speed=="slow"){
                speednum = 1;
            }else{
                speednum = 3;
            }
            this.setOpacity(0);
            this.setStyle("display","block");
            var timer = setInterval(function(){
                l += speednum;
                if(l>=100){
                    that.setOpacity(100);
                    clearInterval(timer);
                    callback();
                }else{
                    that.setOpacity(l)
                }
            },10); 
        }
    },
    /*通过设置元素不透明度来逐渐隐藏所匹配元素（只对非display:none元素有效）
     *参数:-> speed(String)，为可选参数，渐显的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    fadeOut: function(speed,callback){
        if(this.getCss("display")!="none"){
            callback = callback||function(){};
            var l = 100;
            var speednum;
            var that = this;
            if(speed=="fast"){
                speednum = 5;
            }else if(speed=="slow"){
                speednum = 1;
            }else{
                speednum = 3;
            }
            var timer = setInterval(function(){
                l -= speednum;
                if(l<=0){
                    that.setOpacity(0);
                    that.setStyle("display","none");
                    clearInterval(timer);
                    callback();
                }else{
                    that.setOpacity(l)
                }
            },10); 
        }
    },
    /*根据所匹配元素的显示状态选择执行fadeIn或者fadeOut
     *参数:-> speed(String)，为可选参数，渐显的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function)，为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    fadeToggle: function(speed,callback){
        if(this.getCss("display")=="none"){
            this.fadeIn(speed,callback);
        }else{
            this.fadeOut(speed,callback);
        }
    },
    /*显示所匹配元素（无动画版本和动画版本）（只对display:none元素有效）
     *注意：如果选用动画版本（即有参数传入），调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，变化的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function),为可选参数，动画执行完毕时的回调函数
     *返回值: 无
	 *务必设置所匹配元素的width，不能为百分比并且不能使用内嵌式css(内联或外联均可)，否则会导致在display:none的情况下，获取的getWidth()不准确
    */
    show: function(speed,callback){
        if(this.getCss("display")=="none"){
            if(arguments.length==0){
                this.setStyle("display","block");
            }else if(arguments.length==1||arguments.length==2){
                callback = callback||function(){};
                var l = 0;
                var speednum1;
                var fullHeight = this.getHeight();
                var h = 0;
                var speednum2;
                var fullWidth = this.getWidth();
                var w = 0;
                var speednum3;
                var that = this;
                if(speed=="fast"){
                    speednum1 = 5;
                    speednum2 = fullHeight*5/100;
                    speednum3 = fullWidth*5/100;
                }else if(speed=="slow"){
                    speednum1 = 1;
                    speednum2 = fullHeight*1/100;
                    speednum3 = fullWidth*1/100;
                }else{
                    speednum1 = 3;
                    speednum2 = fullHeight*3/100;
                    speednum3 = fullWidth*3/100;
                }
                this.setOpacity(0);
                this.setCss({overflow:"hidden",width:"1px",height:"1px",display:"block"});
                var timer1 = setInterval(function(){
                    l += speednum1;
                    if(l>=100){
                        that.setOpacity(100);
                        clearInterval(timer1);
                    }else{
                        that.setOpacity(l)
                    }
                },10);
                var timer2 = setInterval(function(){
                    h += speednum2;
                    if(h>=fullHeight){
                        that.setStyle("height",fullHeight+"px");
                        clearInterval(timer2);
                        callback();
                    }else{
                        that.setStyle("height",h+"px")
                    }
                },10);
                var timer3 = setInterval(function(){
                    w += speednum3;
                    if(w>=fullWidth){
                        that.setStyle("width",fullWidth+"px");
                        clearInterval(timer3);
                    }else{
                        that.setStyle("width",w+"px");
                    }
                },10);
            }
        }
    },
    /*隐藏所匹配元素（无动画版本和动画版本）（只对非display:none元素有效）
     *注意：如果选用动画版本（即有参数传入），调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，变化的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function),为可选参数，动画执行完毕时的回调函数
     *返回值: 无
    */
    hide: function(speed,callback){
        if(this.getCss("display")!="none"){
            if(arguments.length==0){
                this.setStyle("display","none");
            }else if(arguments.length==1||arguments.length==2){
                callback = callback||function(){};
                var l = 100;
                var speednum1;
                var fullHeight = this.getHeight();
                var h = fullHeight;
                var speednum2;
                var fullWidth = this.getWidth();
                var w = fullWidth;
                var speednum3;
                var that = this;
                if(speed=="fast"){
                    speednum1 = 5;
                    speednum2 = fullHeight*5/100;
                    speednum3 = fullWidth*5/100;
                }else if(speed=="slow"){
                    speednum1 = 1;
                    speednum2 = fullHeight*1/100;
                    speednum3 = fullWidth*1/100;
                }else{
                    speednum1 = 3;
                    speednum2 = fullHeight*3/100;
                    speednum3 = fullWidth*3/100;
                }
                this.setCss({overflow:"hidden"});
                var timer1 = setInterval(function(){
                    l -= speednum1;
                    if(l<=0){
                        that.setStyle("display","none");
                        that.setOpacity(0);
                        clearInterval(timer1);
                    }else{
                        that.setOpacity(l);
                    }
                },10);
                var timer2 = setInterval(function(){
                    h -= speednum2;
                    if(h<=0){
                        that.setStyle("display","none");
                        that.setStyle("height","");
                        clearInterval(timer2);
                        callback();
                    }else{
                        that.setStyle("height",h+"px");
                    }
                },10);
                var timer3 = setInterval(function(){
                    w -= speednum3;
                    if(w<=0){
                        that.setStyle("display","none");
                        that.setStyle("width","");
                        clearInterval(timer3);
                    }else{
                        that.setStyle("width",w+"px");
                    }
                },10);
            }
        }
    },
    /*根据所匹配元素的显示状态选择执行show或hide（无动画版本和动画版本）
     *注意：如果选用动画版本（即有参数传入），调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom
     *参数:-> speed(String)，为可选参数，变化的速度，有三个可选值，"slow","normal","fast"，默认值为"normal"
     *        callback(Function),为可选参数，动画执行完毕时的回调函数
     *返回值: 无
	 *务必设置所匹配元素的width，不能为百分比并且不能使用内嵌式css(内联或外联均可)，否则会导致在display:none的情况下，获取的getWidth()不准确
    */
    toggle: function(speed,callback){
        if(arguments.length==0){
            if(this.getCss("display")=="none"){
                this.show();
            }else{
                this.hide();
            }
        }else if(arguments.length==1||arguments.length==2){
            if(this.getCss("display")=="none"){
                this.show(speed,callback);
            }else{
                this.hide(speed,callback);
            }
        }
    },
    
    
    
    /*一个有重要意义的方法，字面理解这个函数的意义，是否真正的离开或进入一个元素，主要是对mouseover,mouseout事件关联对象的判断，
    利用这个方法的返回值，可屏蔽从父元素到子元素的mouseout的事件处理程序，也可屏蔽从子元素回到父元素的mouseover事件处理程序，
    真正做到mouseover,mouseout只对父元素有效，子元素则无效
     *参数:-> e，事件对象
     *返回值: boolean
    */
    isMouseLeaveOrEnter: function(e){
        e = e||window.event;
        /*如果事件类型不是mouseover也不是mouseout，则提前退出此方法*/
        if(e.type !="mouseout"&&e.type!="mouseover"){
            return false;
        }
        /*获得和mouseover,mouseout相关联的元素节点*/
        var reltg = e.relatedTarget?e.relatedTarget:e.type=="mouseout"?e.toElement:e.fromElement;
        while(reltg&&reltg!=this.getDom(0)){
            reltg = reltg.parentNode;
        }
        /*返回一个表达式
        *作为mouseover,mouseout触发事件处理程序的一个判断条件*/
        return (reltg!=this.getDom(0));
    },
    
    
    /*复合动作mouseover,mouserout的处理程序(事件切换)，模仿悬停事件的方法，自动判断isMouseLeaveOrEnter
     *参数:-> fn1(Function)，mouseover所触发的处理程序
     *        fn2(Function)，mouseout触发的处理程序
     *返回值：无
    */
    mouseHover: function(fn1,fn2){
        /*分别为两个事件处理函数进行处理，添加isMouseLeaveOrEnter的判断*/
        var s1 = fn1.toString(),s2 = fn2.toString();
        var sNew1 = s1.replace(s1.match(/\(\)\ ?{/g)[0],"(e){if($(el).isMouseLeaveOrEnter(e)){")+"}",
            sNew2 = s2.replace(s2.match(/\(\)\ ?{/g)[0],"(e){if($(el).isMouseLeaveOrEnter(e)){")+"}";
        eval("this.each(function(el){el.onmouseover="+sNew1+";el.onmouseout="+sNew2+";});");
    },
    
    
    
    /*以下是dom位置相关*/
    
    /*获取所匹配元素距窗口最左端的偏移量（包括由于滚动条隐藏的部分）
     *参数:-> 无
     *返回值: Number
    */
    gapsX: function(){
        return this.getDom(0).offsetParent?this.getDom(0).offsetLeft+$(this.getDom(0).offsetParent).gapsX():this.getDom(0).offsetLeft;
    },
    /*获取所匹配元素距窗口最顶端的偏移量（包括由于滚动条隐藏的部分）
     *参数:-> 无
     *返回值: Number
    */
    gapsY: function(){
        return this.getDom(0).offsetParent?this.getDom(0).offsetTop+$(this.getDom(0).offsetParent).gapsY():this.getDom(0).offsetTop;
    },
    /*获取所匹配元素相对于父级元素的偏移量(水平方向)
     *参数:-> 无
     *返回值: Number
    */
    parentX: function(){
        return this.getDom(0).parentNode==this.getDom(0).offsetParent?this.getDom(0).offsetLeft:this.gapsX()-this.parent().gapsX();
    },
    /*获取所匹配元素相对于父级元素的偏移量(垂直方向)
     *参数:-> 无
     *返回值: Number
    */
    parentY: function(elem){
        return this.getDom(0).parentNode==this.getDom(0).offsetParent?this.getDom(0).offsetTop:this.gapsY()-this.parent().gapsY();
    },
    /*add by zhenn in 2010-01-13*/
    /*给所匹配元素设置水平滚动条的位置(由于水平滚动条被隐藏的宽度)，或者返回所匹配元素中第一个元素的水平滚动条的位置(由于水平滚动条被隐藏的宽度)
     *参数:-> val(Number)：可选参数，用于设定水平滚动条的位置
     *返回值: 1,传参，则为赋值运算，返回zlib
     *        2,无参，返回Number，所匹配元素中第一个元素的水平滚动条的位置(由于水平滚动条被隐藏的宽度)
    */
    scrollLeft: function(val){
        if(typeof val=="undefined"){
            return this.getDom(0).scrollLeft;
        }
        this.getDom(0).scrollLeft = parseInt(val);
        return this;
    },
    /*add by zhenn in 2010-01-13*/
    /*给所匹配元素设置垂直滚动条的位置(由于垂直滚动条被隐藏的高度)，或者返回所匹配元素中第一个元素的垂直滚动条的位置(由于垂直滚动条被隐藏的高度)
     *参数:-> val(Number)：可选参数，用于设定垂直滚动条的位置
     *返回值: 1,传参，则为赋值运算，返回zlib
     *        2,无参，返回Number，所匹配元素中第一个元素的垂直滚动条的位置(由于垂直滚动条被隐藏的高度)
    */
    scrollTop: function(val){
        if(typeof val=="undefined"){
            return this.getDom(0).scrollTop;
        }  
        this.getDom(0).scrollTop = parseInt(val);
        return this;
    } 
};



/************************************************************************************************/
/*以下为zlib类的静态方法(功能函数),用户可自行添加，格式如下：zlib.MethodName = funciton(){}
*所谓静态方法，只能通过zlib类名访问，例如zlib.getX(e),不能通过实例对象访问*/
/************************************************************************************************/
/*add by zhenn in 2010-01-16*/
/*扩展zLib的静态方法，如果扩展的方法名和已经存在的方法有冲突，则会弹出提示信息，并且不会破坏或者覆盖zlib中已经存在的方法，通过extend扩展的静态方法，
 *其调用方法和其它静态方法一样，通过类名访问，如zlib.extendMehtod
 *参数:-> obj(Object)：包含一系列方法的对象，用来扩展zlib的静态方法
 *返回值: 无
*/
zlib.extend = function(obj){
	var arr = [];
	for(var i in obj){
		for(var j in this){
			if(j==i){
				arr.push(i);
			}
		}
		if(arr.length==0){
			this[i] = obj[i];	
		}else{
			for(var i=0;i<arr.length;i++){
	    		alert("扩展的静态方法名和已有的方法有冲突！\n具体为:"+arr[i]);	
	    	}
		}
	}
	
};

zlib.extend({
	/*准确判断对象（数据）类型，相对于typeof，增强了null,object,array的区分
	 *参数:-> obj，任何类型的数据
	 *返回值: String,如string,function,array,object,null,undefined,number,regexp,math,date
	*/
	getType: function(obj){
		var _t = typeof(obj); 
  		return (_t=="object"?obj==null&&"null"||Object.prototype.toString.call(obj).slice(8,-1):_t).toLowerCase();	
	},
	/*解决attachEvent中this指向问题（如不做处理，this始终指向window）
	 *参数:-> e，事件对象
	 *返回值: 无
	*/
	IEEventHandler: function(e){   
		e = e || window.event;   
		var evTypeRef = '__' + e.type;
		if(this[evTypeRef]){   
			for (var ref in this[evTypeRef]){   
				if (Function.call){   
					this[evTypeRef][ref].call(this, e);   
				}else{   
					this.__fn = this[evTypeRef][ref];   
					this.__fn(e);   
					this.__fn = null;   
				}   
			}   
		}   
	},
	/**鼠标相关*/
	/*获得鼠标位置(水平方向)
	 *参数:-> e，事件对象
	 *返回值: Number
	*/
	getX: function(e){   
		e = e||window.event;
		return e.pageX?e.pageX:(e.clientX + document.documentElement.scrollLeft);
	},
	/*获得鼠标位置(垂直方向)
	 *参数:-> e，事件对象
	 *返回值: Number
	*/
	getY: function(e){   
		e = e||window.event;
		return e.pageY?e.pageY:(e.clientY + document.documentElement.scrollTop);
	},
	/*获得鼠标相对于当前元素(事件对象"e"的属性target)的水平偏移量
	 *参数:-> e，事件对象
	 *返回值: Number
	*/
	getElementX: function(e){
		e = e||window.event;
		var activeObj = e.target||e.srcElement;
		var elemX = zlib.getX(e) - $(activeObj).gapsX(activeObj);
		return elemX;
	},
	/*获得鼠标相对于当前元素(事件对象"e"的属性target)的垂直偏移量
	 *参数:-> e，事件对象
	 *返回值: Number
	*/
	getElementY: function(e){
		e = e||window.event;
		var activeObj = e.target||e.srcElement;
		var elemY = zlib.getY(e) - $(activeObj).gapsY(activeObj);
		return elemY;
	},
	/*转换颜色值的格式，16进制->rgb格式
	 *参数:-> str(String)，要转换的16进制颜色值代码，如"#f0f","#ss5236"
	 *返回值: Array，并非rgb()
	*/
	colorToRGB: function(str){
		var reg = /[^0-9a-f]/gi;
		var n1,n2,n3;
		var arr = new Array();
		str = str.replace("#","");
		if(str.match(reg)!=null){
			return;
		}
		if(str.length=3){
			n1 = parseInt(str.substring(0,1)+str.substring(0,1),16);
			n2 = parseInt(str.substring(1,2)+str.substring(1,2),16);
			n3 = parseInt(str.substring(2,3)+str.substring(2,3),16); 
		}else if(str.length=6){
			n1 = parseInt(str.substring(0,2),16);
			n2 = parseInt(str.substring(2,4),16);
			n3 = parseInt(str.substring(4,6),16);  
		}
		arr.splice(0,0,n1,n2,n3);
		return arr;
	},
	/*转换颜色值的格式，rgb格式->16进制
	 *参数:-> str(String)，要转换的rgb颜色代码，如rgb(255,45,33)
	 *返回值: String，16进制颜色代码，如"#f500ff"
	*/
	colorToNormal: function(str){
		var arr = [],s;
		var s1 = parseInt(str.substring(str.indexOf("(")+1,str.indexOf(","))).toString(16),
			s2 = parseInt(str.substring(str.indexOf(",")+1,str.lastIndexOf(","))).toString(16),
			s3 = parseInt(str.substring(str.lastIndexOf(",")+1,str.length-1)).toString(16);
		s1 = s1.length==2?s1:"0"+s1;
		s2 = s2.length==2?s2:"0"+s2;
		s3 = s3.length==2?s3:"0"+s3;
		arr.splice(0,0,"#",s1,s2,s3);
		s = arr.join("");
		return s;
	},
	/*页面(document)尺寸*/
	/*获取当前页面的宽度
	 *参数:-> 无
	 *返回值: Number
	*/
	pageWidth: function(){
		return document.body.offsetWidth;
	},
	/*获取当前页面的高度
	 *参数:-> 无
	 *返回值: Number
	*/
	pageHeight: function(){
		return document.body.offsetHeight;
	},
	/*获取页面滚动条的位置(当前页面由于滚动条被隐藏的宽度)
	 *参数:-> 无
	 *返回值: Number
	*/
	scrollX: function(){
		return self.pageXOffset || document.documentElement.scrollLeft/*ie,ff,opera*/||document.body.scrollLeft;/*chrome,safari*/
	},
	/*获取页面滚动条的位置(当前页面由于滚动条被隐藏的高度)
	 *参数:-> 无
	 *返回值: Number
	*/
	scrollY: function(){
		return self.pageYOffset || document.documentElement.scrollTop/*ie,ff,opera*/||document.body.scrollTop;/*chrome,safari*/
	},
	/*获取视口宽度（浏览器工作区的宽度）
	 *参数:-> 无
	 *返回值: Number
	*/
	windowWidth: function(){
		return document.documentElement.clientWidth;
	},
	/*获取视口高度（浏览器工作区的高度）
	 *参数:-> 无
	 *返回值: Number
	*/
	windowHeight: function(){
		return document.documentElement.clientHeight;
	},
	/**以下为DOM事件相关*/
	/*取消事件冒泡
	 *参数:-> e，事件对象
	 *返回值: 无
	*/
	stopBubble: function(e){
		e = e||window.event;
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
	},
	/*取消默认动作
	 *参数:-> e，事件对象
	 *返回值: 无
	*/
	preventDefault: function(e){
		e = e||window.event;
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue = false;
		}
	},
	/*获取事件发生的目标元素
	 *参数:-> e，事件对象
	 *返回值: dom元素
	*/
	getTarget: function(e){
		e = e||window.event;
		var targetElem = e.target||e.srcElement;
		return targetElem;
	},
	/*访问键盘，返回键盘的键码*/
	getKey: function(e){
		e = e||window.event;
		var _keyCode = e.keyCode||e.which;
		return _keyCode;
	},
	/*动态载入外联样式表stylesheet
	 *参数:-> url(String)，样式表的url地址
	 *        _media(String)，应用类型如"screen","print" 等
	 *返回值: 无 
	*/
	addStyleSheet: function(url,_media){
		_media = _media||"screen";
		var newlink = $("*link");
		newlink.getDom(0).setAttribute("href",url);
		newlink.getDom(0).setAttribute("rel","stylesheet");
		newlink.getDom(0).setAttribute("type","text/css");
		newlink.getDom(0).setAttribute("media",_media);
		newlink.appendTo($("head"));
	},
	/*删除已经载入的外联样式表stylesheet
	 *参数:-> url(String)，样式表的url地址
	 *返回值: 无
	*/
	removeStyleSheet: function(url){
		var linkCss = $("link");
		for(var i=0;i<linkCss.size();i++){
			alert(linkCss.getDom(i).href);
			if(window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+url==linkCss.getDom(i).href||linkCss.getDom(i).href==url){
				
				$(linkCss.getDom(i)).remove();
			}
		}
	},
	/*保存cookie
	 *param:-> name(String),cookie名
	 *         value(String),cookie值
	 *         hour(Number),cookie有效时间，单位是小时
	 *返回值：无
	*/
	setCookie: function(name,value,hour){
		var exp = new Date();
		exp.setTime(exp.getTime() + hour*60*60*1000);
		document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
	},
	/*读取cookie
	 *param:-> name(String),cookie名
	 *返回值： cookie值
	*/
	getCookie: function(name){
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if(arr != null){ 
			return unescape(arr[2]); 
		}
		return null;
	},
	/*删除cookie
	 *param:-> name(String),cookie名
	 *返回值：无
	*/
	deleteCookie: function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.getCookie(name);
		if(cval!=null){ 
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		}
	},
	/*ajax
	 *参数:-> options(Object) 
	 *options中的属性：
	 *        type(String)
	 *        url(String)
	 *        timeout(Number)
	 *        onComplete(Function)
	 *        onError(Function)
	 *        onSuccess(Function)
	 *        dataType(String)
	 *返回值: 无 
	*/
	ajax: function(options){
		options = {
			/*发送请求的方法*/
			type: options.type || "post",
			/*请求的url地址*/
			url: options.url || "",
			/*超时时间*/
			timeout: options.timeout || 5000,
			/*完成请求的回调函数*/
			onComplete: options.onComplete || function(){},
			/*请求失败的回调函数*/
			onError: options.onError || function(){},
			/*请求成功的回调函数*/
			onSuccess: options.onSuccess || function(){},
			/*返回数据的数据类型*/
			dataType: options.dataType || "xml"
		};
		
		if(typeof XMLHttpRequest == "undefined"){
			XMLHttpRequest = function(){
				return new ActiveXObject(navigator.userAgent.indexOf("MSIE 5")>=0?"Miscosoft.XMLHTTP":"Msxml2.XMLHTTP");
			};
		}
		
		var xml = new XMLHttpRequest();
		xml.open(options.type,options.url,true);
		
		var timeoutLength = options.timeout;
		var requestDone = false;
		
		setTimeout(function(){requestDone = true;},timeoutLength);
		
		xml.onreadystatechange = function(){
			if(xml.readyState==4&&!requestDone){
				if(httpSuccess(xml)){
					options.onSuccess(httpData(xml,options.dataType))
				}else{
					options.onError();
				}
				options.onComplete();
				xml = null;
			}
		};
		xml.send();
		
		function httpSuccess(r){
			try{
				return !r.status&&location.protocol=="file"||(r.status>=200&&r.status<=300)||r.status==304||navigator.userAgent.indexOf("Safari")>=0&&typeof r.status=="undefined";
			}catch(e){}
			return false;
		}
		
		function httpData(r,type){
			var ct = r.getResponseHeader("content-type");
			var data = !type&&ct&&ct.indexOf("xml")>=0;
			data=type=="xml"||data?r.responseXML:r.responseText;
			if(type=="Script"){
				eval.call(window,data);
			}
			return data;
		}
	}
	
});
