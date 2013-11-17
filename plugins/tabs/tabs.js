zlib.fn.extend({
	/*注意：如果选用动画效果（即有"effect"传入），调用此方法时，请确保所匹配元素没有设置padding-top和padding-bottom，否则会出现bug*/
	tabs: function(para){
		/*提供参数默认值*/
		para = {
			trigger: para.trigger || "click",
			defaultIndex: para.defaultIndex || 0,
			effect: para.effect || "",
			speed: para.speed || "fast",
			delayTime: para.delayTime || 0,
			intervalTime: para.intervalTime || 3000,
			titCell: para.titCell || ["h3","span"],
			titActiveClass: para.titActiveClass || "active",
			mainCell: para.mainCell || "ul",
			playAuto: para.playAuto || false
		}	
		var current = para.defaultIndex , delay = para.delayTime;
		var tit = $(this,para.titCell[0]).getDom(0);
		var mains = $(this,para.mainCell);
		
		/*初始化操作，设置选中项*/
		$(tit,para.titCell[1]).getClass(para.defaultIndex).addClass(para.titActiveClass);
		$(this,para.mainCell).getClass(para.defaultIndex).setStyle("display","block");
		
		/*自动隔时切换选项卡函数*/
		function playAutoFn(){
			$(tit,para.titCell[1]).getClass(current).removeClass(para.titActiveClass);
			mains.getClass(current).setStyle("display","");
			if($(tit,para.titCell[1]).getClass(current).next().size()>0){
				$(tit,para.titCell[1]).getClass(current).next().addClass(para.titActiveClass);
				switch(para.effect){
					case "fade":
						mains.getClass(current).next().fadeIn(para.speed);
						break;
					case "slide":
						mains.getClass(current).next().slideDown(para.speed);
						break;
					default:
						mains.getClass(current).next().setStyle("display","block");	
				}
				current++;
			}else{
				$(tit,para.titCell[1]).getClass(0).addClass(para.titActiveClass);
				switch(para.effect){
					case "fade":
						mains.getClass(0).fadeIn(para.speed);
						break;
					case "slide":
						mains.getClass(0).slideDown(para.speed);
						break;
					default:
						mains.getClass(0).setStyle("display","block");	
				}
				current = 0;
			}
		}
		
		/*交互函数，用于用户利用鼠标事件来切换选项卡*/
		function interAction(){
			for(var i=0;i<$(tit,para.titCell[1]).size();i++){
				$(tit,para.titCell[1]).getDom(i)["on"+para.trigger] = (function(index){
					/*JavaScript closure*/
					return function(){
						setTimeout(function(){
							for(var j=0;j<$(tit,para.titCell[1]).size();j++){
								$(tit,para.titCell[1]).removeClass(para.titActiveClass);
								mains.setStyle("display","");	
							}
							$(tit,para.titCell[1]).getClass(index).addClass(para.titActiveClass);
							switch(para.effect){
								case "fade":
									mains.getClass(index).fadeIn(para.speed);
									break;
								case "slide":
									mains.getClass(index).slideDown(para.speed);
									break;
								default:
									mains.getClass(index).setStyle("display","block");	
							};
							current = index;	
						},para.delayTime);
					};
				})(i);	
			}	
		}
		
		/*如果允许自动切换*/
		if(para.playAuto==true){
			timer = setInterval(playAutoFn,para.intervalTime);
			this.bindEvent("mouseover",function(){
				clearInterval(timer);
			});
			this.bindEvent("mouseout",function(){
				timer = setInterval(playAutoFn,para.intervalTime);
			});	
			interAction();
		}else{ /*无自动切换*/
			interAction();	
		}
	}
});


