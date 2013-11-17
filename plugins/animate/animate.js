/*javascript加速,减速,运动,Tween,缓动,动画,弹簧,反弹*/
zlib.tween = {
    Linear: function(t,b,c,d){
        return c*t/d + b;
    },
    Quad: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c*(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if((t/=d/2)<1){ 
                return c/2*t*t + b;
            }
            return -c/2*((--t)*(t-2)-1) + b;
        }
    },
    Cubic: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t+1) + b;
        },
        easeInOut: function(t,b,c,d){
            if((t/=d/2)<1){ 
                return c/2*t*t*t + b;
            }
            return c/2*((t-=2)*t*t+2) + b;
        }
    },
    Quart: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c*((t=t/d-1)*t*t*t-1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2)<1){
                return c/2*t*t*t*t + b;
            }
            return -c/2*((t-=2)*t*t*t-2) + b;
        }
    },
    Quint: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t+1) + b;
        },
        easeInOut: function(t,b,c,d){
            if((t/=d/2)<1){
                return c/2*t*t*t*t*t + b;
            }
            return c/2*((t-=2)*t*t*t*t+2) + b;
        }
    },
    Sine: {
        easeIn: function(t,b,c,d){
            return -c*Math.cos(t/d*(Math.PI/2))+c+b;
        },
        easeOut: function(t,b,c,d){
            return c*Math.sin(t/d*(Math.PI/2))+b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2*(Math.cos(Math.PI*t/d)-1)+b;
        }
    },
    Expo: {
        easeIn: function(t,b,c,d){
            return (t==0)?b:c*Math.pow(2,10*(t/d-1))+b;
        },
        easeOut: function(t,b,c,d){
            return (t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;
        },
        easeInOut: function(t,b,c,d){
            if(t==0){ 
                return b;
            }
            if(t==d){ 
                return b+c;
            }
            if((t/=d/2)<1){ 
                return c/2*Math.pow(2,10*(t-1)) + b;
            }
            return c/2*(-Math.pow(2,-10*--t)+2) + b;
        }
    },
    Circ: {
        easeIn: function(t,b,c,d){
            return -c*(Math.sqrt(1-(t/=d)*t)-1) + b;
        },
        easeOut: function(t,b,c,d){
            return c*Math.sqrt(1-(t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if((t/=d/2)<1){ 
                return -c/2*(Math.sqrt(1-t*t)-1) + b;
            }
            return c/2*(Math.sqrt(1-(t-=2)*t)+1) + b;
        }
    },
    Elastic: {
        easeIn: function(t,b,c,d,a,p){
            if(t==0){ 
                return b;
            }
            if((t/=d)==1){ 
                return b + c;
            }
            if(!p){
                p = d * .3;
            }
            if(!a||a<Math.abs(c)){
                a = c;
                var s = p / 4;
            }else{ 
                var s = p / (2 * Math.PI) * Math.asin (c / a);
            }
            return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if(t==0){
                return b;
            }
            if((t/=d)==1){
                return b + c;
            }
            if(!p){
                p = d*.3;
            }
            if(!a||a<Math.abs(c)){
                a = c;
                var s=p/4;
            }else{
                var s = p/(2*Math.PI)*Math.asin(c/a);
            }
            return (a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if(t==0){
                return b;
            }
            if((t/=d/2)==2){
                return b+c;
            }
            if(!p){
                p = d*(.3*1.5);
            }
            if(!a||a<Math.abs(c)){
                a = c;
                var s = p/4;
            }else{ 
                var s = p/(2*Math.PI)*Math.asin(c/a);
            }
            if(t<1){ 
                return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)) + b;
            }
            return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5 + c + b;
        }
    },
    Back: {
        easeIn: function(t,b,c,d,s){
            if(s==undefined){
                s = 1.70158;
            }
            return c*(t/=d)*t*((s+1)*t-s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if(s==undefined){
                s = 1.70158;
            }
            return c*((t=t/d-1)*t*((s + 1)*t+s)+1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if(s==undefined){ 
                s = 1.70158;
            }
            if((t/=d/2)<1){ 
                return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
            }
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
        }
    },
    Bounce: {
        easeIn: function(t,b,c,d){
            return c - zlib.tween.Bounce.easeOut(d-t,0,c,d)+b;
        },
        easeOut: function(t,b,c,d){
            if((t/=d)<(1/2.75)){
                return c*(7.5625*t*t)+b;
            }else if (t<(2/2.75)){
                return c*(7.5625*(t-=(1.5/2.75))*t+.75)+ b;
            }else if (t<(2.5/2.75)){
                return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;
            }else{
                return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;
            }
        },
        easeInOut: function(t,b,c,d){
            if(t<d/2){ 
                return zlib.tween.Bounce.easeIn(t*2,0,c,d)*.5+b;
            }else{ 
                return zlib.tween.Bounce.easeOut(t*2-d,0,c,d)*.5+c*.5+b;
            }
        }
    }
};



zlib.fn.extend({
	/*通过设置所匹配元素的top或left值来实现所匹配元素的加速运动,减速运动,Tween,缓动,弹簧,反弹
	 *注意：选择此种动画形式，务必设置所匹配元素的position:absolute;
	 *      至于top,left,bottom,right的值，会根据para.direc的不同，分别做不同处理将有本方法自行处理
	 *      para.direc = "right"
	 *参数:-> para(Object)：默认结构如下
	 *para = {
	 *    c: para.c || 50,
	 *    d: para.d || 100,
	 *    beginPos: para.beginPos || 0,
	 *    direc: para.direc || "toRight",
	 *    tweenName: para.tweenName || "Linear",
	 *    easeName: para.easeName || "easeIn"
	 * }               
	 *[para.c](Number)，参数para的可选属性，所匹配元素的运动跨度，默认值为50
	 *[para.d](Number)，参数para的可选属性，所匹配元素的运动速度，值越大，速度越慢，反之，值越小，速度越快，d的取值范围在50~500之间运动效
	 *                  果最佳，用户可自行调节，默认值为100；
	 *[para.beginPos](Number)， 参数para的可选属性，所匹配元素开始运动的起始位置，默认值为0
	 *[para.direc](String)，    参数para的可选属性，所匹配元素开始运动的方向，默认值为toRight
	 *[para.tweenName](String)，参数para的可选属性，所选择的运动类型
	                            可选值分别为Linear,Quad,Cubic,Quart,Quint,Sine,Expo,Circ,Elastic,Back,Bounce
	 *[para.easeName](String)， 参数para的可选属性，所选运动类型的执行阶段，可选值分easeIn,easeOut,easeInOut，
	 *                          总体来说，利用tweenName和easeName可以构建数十种动画形式。  
	 *返回值: 无
	*/
	animateSelf: function(para){
	    para = {
	        c: para.c || 50,
	        d: para.d || 100,
	        beginPos: para.beginPos || 0,
	        direc: para.direc || "toRight",
	        tweenName: para.tweenName || "Linear",
	        easeName: para.easeName || "easeIn"
	    }
	    var fn = para.tweenName=="Linear"?zlib.tween["Linear"]:zlib.tween[para.tweenName][para.easeName];
	    var t = 0, timer = null, that = this;
	    clearTimeout(timer);
	    function _run(){
	        var setDirec;
	        switch(para.direc){
	            case "toRight":
	                setDirec = "left";
	                break;
	            case "toLeft":
	                that.setStyle("left","auto");
	                setDirec = "right";
	                break;
	            case "toBottom":
	                setDirec = "top";
	                break;
	            case "toTop":
	                that.setStyle("top","auto");
	                setDirec = "bottom";
	                break;
	        }
	        if(t < para.d){
	            t++;
	            that.setStyle(setDirec,para.beginPos + Math.ceil(fn(t, 0, para.c, para.d))+"px");
	            timer = setTimeout(_run, 10);
	        }
	        else{
	            that.setStyle(setDirec,para.beginPos + para.c+"px");
	        }
	    }
	    _run();
	},
	
	
	focusImg: function(para){
	    para = {
	        c: para.c || 50,
	        d: para.d || 100,
	        direc: para.direc || "toLeft",
	        tweenName: para.tweenName || "Linear",
	        easeName: para.easeName || "easeIn"
	    }
	    var fn = para.tweenName=="Linear"?zlib.tween["Linear"]:zlib.tween[para.tweenName][para.easeName];
	    var t = 0, timer = null, that = this, count = 0, evalStatus = false;
	    
	    clearTimeout(timer);
	    function _run(){
			switch(para.direc){
				case "toLeft":
					if(t < para.d){
						t++;
						that.scrollLeft(count + Math.ceil(fn(t, 0, para.c, para.d)));
						timer = setTimeout(_run, 10);
					}else{
						t = 0;
						count += para.c;
						if(count==para.c*$(that,"li").size()/2){
							count = 0;
						}
						clearTimeout(timer);
						timer = setTimeout(_run,2000);
					}
					break;
				case "toRight":
					if(t < para.d){
						t++;
						that.scrollLeft($(that,"li").size()/2*para.c - Math.ceil(fn(t, 0, para.c, para.d)) - count);
						timer = setTimeout(_run, 10);
					}else{
						t = 0;
						count += para.c;
						if(count==para.c*$(that,"li").size()/2){
							count = 0;
						}
						clearTimeout(timer);
						timer = setTimeout(_run,2000);
					}
					break;
			}
	    }
	    _run();
	}
});