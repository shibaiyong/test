//日期转成字符串
/*----------------------------------------*/
        //var strDate=new Date();
		function dateStr(strDate,mark){
			if(mark==undefined){
				mark="-";
			}
			var year=strDate.getFullYear();
			var month=strDate.getMonth()+1;
			var date=strDate.getDate();
			return year+mark+month+mark+date;
		}
/*-----------------------------------------*/
//取消冒泡兼容写法。
/*-------------------------------------------*/
		document.body.onclick=function(ev){
			var e=ev||event;
			//取消冒泡
			//e.cancelBubble=true
			e.stopPropagation?e.stopPropagation():e.cancelBubble=true		
			//e.stopPropagation()
			alert("我被点击了,我是body");
		}
/*-------------------------------------------*/











