

function Clock(selector,options){
	this.box=$(selector);//表的容器
	
	this.size=options.size||300;	
	this.bgColor=options.bgColor||'#333';

	this.init()
}


Clock.prototype={
	init:function(){//初始化
		this.createCanvas();
		this.drawPan();
		this.drawStep();
		this.runClock();
		this.drawSecondPointer();
		this.drawNumber();
	},
	createCanvas:function(){//创建canvas
		var $canvas=$("<canvas>");
		this.canvas=$canvas[0];
		this.box.append($canvas);
		this.canvas.width=this.size;
		this.canvas.height=this.size;	
		this.ctx=this.canvas.getContext('2d')
	},
	drawStep:function(){//画刻度
		var ctx=this.ctx;
		var that=this;
		var pi=Math.PI;
		var w=15;
		for(var i = 0;i<60;i++){
			if(i%5==0){
				w=20;
			}else{
				w=15;
			}
			this.safeDraw(function(){
				ctx.translate(that.size/2,that.size/2);
				ctx.rotate(pi/30*i);
				
				ctx.moveTo(that.size/2-w,0)
				ctx.lineTo(that.size/2-5,0);
				ctx.strokeStyle="#45e644"
				ctx.stroke()
			})
		}
		
	},
	runClock:function(){//让表动起来
		var that=this;
		var ctx=this.ctx;
		
		setInterval(function(){
			ctx.clearRect(0,0,that.size,that.size)
			that.drawPan();
			that.drawStep();
			that.drawSecondPointer();
			that.drawNumber();
		},1000)		
	},
	drawSecondPointer:function(){//画秒针
		var ctx=this.ctx;
		var that=this;
		var pi=Math.PI;
		var second = new Date().getSeconds();
		this.safeDraw(function(){
			
			ctx.translate(that.size/2,that.size/2)
			ctx.rotate(pi/30*second-pi/2)
			ctx.moveTo(0,0)
			ctx.lineTo(that.size/2-30,0)
			ctx.strokeStyle="#45e644"
			ctx.stroke()
		
		})

	},
	drawNumber:function(){//画出数字时钟
		
		var ctx=this.ctx;
		var that=this;
		
		this.safeDraw(function(){
			
			ctx.lineWidth=5;
			ctx.fillStyle="#45e644"
			ctx.font="normal "+(that.size/10)+"px 微软雅黑";
			ctx.textBaseline = "middle";// top  bottom  middle 设置垂直对齐方式
			ctx.textAlign = "center";//设置水平对齐方式   left right center

			ctx.fillText(that.transformTime(),that.size/2,that.size/4)
		
		})
	},
	drawPan:function(){//画表盘
		var ctx=this.ctx;
		var that=this;
		this.safeDraw(function(){
			ctx.arc(that.size/2,that.size/2,that.size/2,0,Math.PI*2)
			ctx.fillStyle=that.bgColor;
			ctx.fill()
		})
	},
	safeDraw:function(cb){//安全绘画方法
		var ctx=this.ctx;		
		ctx.save();
		ctx.beginPath();
		cb();
		ctx.closePath();
		ctx.restore();
	},
	transformTime:function(){//获取所需格式的时间
		var date = new Date();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		
		return this.tranNum(hour)+':'+this.tranNum(minute)+":"+this.tranNum(second)
		
	},
	tranNum:function(num){//给数字补零
		if(num<10){
			return '0'+num;
		}else{
			return num;
		}
	}

}
