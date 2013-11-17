/*单体模式*/
var drag = {
	dragObj: null,   //所拖动对象
	newDiv1: null,   //两个预留位置的div
	newDiv2: null,    
	that: null,	 //存放指针this,保持作用域
	innerElem: "",
		
	
	
	//获得可存放拖动元素的所占区域,返回一个数组
	getArea: function(classname,targetObj){
		var arr = new Array();
		var objs = $("#container",classname);
		for(var i=0;i<objs.size();i++){
			var onePos = {};
			onePos.leftGaps = objs.getClass(i).gapsX();
			onePos.topGaps = objs.getClass(i).gapsY();
			if(targetObj=="child"){
				onePos.width = objs.getClass(i).parent().getWidth();
				onePos.height = objs.getClass(i).parent().getHeight();
				onePos.obj = objs.getClass(i).parent();
			}else if(targetObj=="parent"){
				onePos.width = objs.getClass(i).getWidth();
				onePos.height = objs.getClass(i).getHeight();
				onePos.obj = objs.getClass(i);
			}
			arr.push(onePos);
		}
		return arr;
	},
	
	init: function(){
		/*监听目标元素上的鼠标按下事件*/
		$("#container",".title").bindEvent("mousedown",function(e){
			drag.that = this;
			drag.dragObj = $(this).parent();
			//记录鼠标相对于当前事件对象的水平、垂直偏移量
			var x = zlib.getElementX(e);
			var y = zlib.getElementY(e);
			
			//获得所拖动元素的初始位置、宽度、高度
			var objX = $(this).gapsX();
			var objY = $(this).gapsY();
			var w = $(this).parent().getWidth();
			var h = $(this).parent().getHeight();
			var gaps = $(this).parent().getCss("marginBottom")
			
			//设置所拖动元素的绝对位置，宽度、高度
			$(this).parent().setCss({
				position: "absolute",
				top: objY + "px",
				left: objX + "px",
				width: w + "px",
				height: h + "px"
			});
			
			//在所拖动元素之前插入一个节点，保留位置
			drag.newDiv1 = $(this).parent().before($("*div"));
			drag.newDiv1.setCss({
				border: "2px dashed #d5d5d5",
				height: h -4 + "px",
				width: w - 4 + "px",
				marginBottom: gaps
			});
			
			//得到所有的可拖动元素的位置区域，并且去除当前所拖动的元素
			var arr = drag.getArea(".title","child");
			for(var i=0;i<arr.length;i++){
				if(arr[i].leftGaps == $(this).gapsX() && arr[i].topGaps==$(this).gapsY() && arr[i].width==$(this).getWidth() && arr[i].height==$(this).parent().getHeight()){
					arr.splice(i,1);
				}
			}
			
			//鼠标移动时的处理函数，处理拖动元素的实时位置
			var a,b;
			function move(e){
				//istFind用于检测在.container中是否有div存在
				var isFind = false;
				
				$(drag.that).parent().setOpacity(40);
				$(drag.that).parent().setCss({
					left: zlib.getX(e)-x+"px",
					top: zlib.getY(e)-y+"px"
				});
				
				for(var i=0;i<arr.length;i++){
					if(zlib.getX(e)>arr[i].leftGaps && zlib.getX(e)<arr[i].leftGaps + arr[i].width && zlib.getY(e)>arr[i].topGaps && zlib.getY(e)<arr[i].topGaps + arr[i].height){
						b = a;
						a = arr[i].obj;
						if(b!=a){
							if(drag.newDiv2){
								drag.newDiv2.remove();
							}
							isFind = true;
							drag.newDiv2 = arr[i].obj.before($("*div"));
							drag.newDiv2.setCss({
								border: "2px dashed #d5d5d5",
								height: h - 4 + "px",
								width: arr[i].width - 4 + "px",
								marginBottom: arr[i].obj.getCss("marginBottom")
							});
							break;
						}
					}
				}
				
				//当在.container内找不到div时
				if(!isFind){
				    var carr = drag.getArea(".container","parent");
				    for(var j= 0;j<carr.length;j++){
						//当拖动元素到一个不包含div的.container中时（不包含所拖动元素的父级元素）   
				        var check = carr[j].obj.html().replace(/\s+/ig,'')=='' && carr[j].obj!=drag.dragObj.parent();
				        if(check && zlib.getX(e)>carr[j].leftGaps && zlib.getX(e)<carr[j].leftGaps + carr[j].width && zlib.getY(e)>carr[j].topGaps && zlib.getY(e)<carr[j].topGaps + carr[j].height){
				            if(drag.newDiv2){
								drag.newDiv2.remove();
							}
				            drag.newDiv2 = $("*div").appendTo(carr[j].obj);
				            drag.newDiv2.setCss({
								border: "2px dashed #d5d5d5",
								height: h-4 + "px",
								width: carr[j].width - 4 +"px"
							});
				            break;
				        }
				    }
				}
				//阻止鼠标move的默认操作，即选中html的文档内容
				zlib.preventDefault(e);
			};
			
			//监听mousemove事件
			$(document).bindEvent("mousemove",move);
			
			//监听mouseup事件，删除对mousemove的监听
			$(document).bindEvent("mouseup",function(){
			    $(this).removeEvent("mousemove",move);
				//当有拖动动作时
				if(drag.dragObj){
				    if(drag.newDiv2){
				        $(drag.that).parent().insertBefore(drag.newDiv2);
				        drag.newDiv2.remove();
				    }else{
				        $(drag.that).parent().insertBefore(drag.newDiv1);
				    }
				    if(drag.newDiv1){
				        drag.newDiv1.remove();
				    }
					$(drag.that).parent().setCss({
				        position: "",
				        width: "",
						height: "",
						top: "",
						left: ""
			        });
				    drag.dragObj.setOpacity(100);
					//虽然在dom中移除操作，但是变量在内存中依然存在，为了以上代码中if(drag.newDiv1){..} ..正确执行，故而设置为null
				    drag.newDiv2 = null;
				    drag.newDiv1 = null;
				    drag.dragObj = null;
				}
			});
		});
	}
}

drag.init();