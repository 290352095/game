function setCookie(cookieName,value,data){
	document.cookie=cookieName+"="+value+";expires="+data.toGMTString();
}
function getCookie(cookieName){
	var cookie=document.cookie;
	var i=cookie.indexOf(cookieName);
	if(i==-1){
		return null;//"";
	}else{
		var starti=i+cookieName.length+1;
		var endi=cookie.indexOf(";",starti);
		if(endi==-1){
			return cookie.slice(starti);
		}else{
			return cookie.slice(starti,endi);
		}
	}
}
var game={
	RN:4,CN:4,//总行数和列数
	data:null,//保存游戏格子数据的二维数组
	score:0,//分数
	state:1,//保存游戏状态
	GANEOVER:0,//游戏结束
	RUNNING:1,//表示游戏运行中
	top:0,//游戏最高分
	revo:null,
	step:0,//记录步数
	start:function(){//游戏启动
		//获得cookie中的
		this.top=getCookie("top")||0;


		//重置游戏状态为RUNNING
		this.state=this.RUNNING;
		//分数
		this.score=0;
		//创建空数组保存在data属性中
		this.data=[];
		this.revo=[];
		//r从0开始到<RN结束
		for(var r=0;r<this.RN;r++){
			//每遍历一个空数组就保存在data  r行
			this.data[r]=[];
			//c从0开始，到<CN结束
			for(var c=0;c<this.CN;c++){
				//设置data中r行c列的值为0
				this.data[r][c]=0;
			}
		}
		this.randomNum();
		this.randomNum();
		//更新页面
		//console.log(this.data.join("\n"));
		this.undateView();
		//方向键响应，为页面绑定键盘按下事件
		document.onkeydown=function(e){
			switch(e.keyCode){
				case 37:this.moveLeft();break;
				case 38:this.moveUp();break;
				case 39:this.moveRight();break;
				case 40:this.moveDown();break;
			}
		}.bind(this);
		
	},
	
	move:function(callback){
		//将data转为String，保存在before中
		var before=String(this.data);
		this.revo[this.step]=before;
		this.step++;
		callback();
		//将data转为String，保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(before!=after){
			//随机生成一个数
			this.randomNum();
			//判断游戏是否结束
			if(this.isGameOver()==true){
				this.state=this.GAMEOVER;
				//保存最高分  如果score>top
				if(this.score>this.top){
					//当前时间now
					var now=new Date();
					//now+1年
					now.setFullYear(now.getFullYear()+1);
					//将score写入cookie
					setCookie("top",this.score,now);
				}
			}
			//更新页面
			this.undateView();
		}
		if(this.isGameOver()){return this.revo=null}
		return this.revo;
	},
	isGameOver:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				}else if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){
					return false;
				}else if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){
					return false;
				}
			}
		}
		return true;
	},
	moveLeft:function(){//左移所有行
		this.move(function(){
		//遍历data中每一行
		for(var r=0;r<this.RN;r++){
			//调用moveLeftInRow方法，传入r
			this.moveLeftInRow(r);
		}
		}.bind(this))
	},
	moveLeftInRow:function(r){//左移第r行
		//c从0开始，到<CN-1结束
		for(var c=0;c<this.CN-1;c++){
			//调用getNextInRow方法,传入参数r,c, 将返回值保存在变量nextc中
			var nextc=this.getNextInRow(r,c);
			//如果nextc是-1,退出循环
			if(nextc==-1){break;}
			else{//否则
				if(this.data[r][c]==0){
				//如果r行c位置的值是0
					//就将r行c位置的值替换为nextc位置的值
					this.data[r][c]=this.data[r][nextc];
					//将nextc位置的值置为0
					this.data[r][nextc]=0;
					//c留在原地
					c--;
				}
				//如果r行c位置的值等于r行nextc位置的值
				else if(this.data[r][c]==this.data[r][nextc]){
					//将r行c位置的值*2
					this.data[r][c]*=2;
					//分数
					this.score+=this.data[r][c];
					//将nextc位置的值置为0
					this.data[r][nextc]=0;
				}
			}
		}
	},
	//获得r行c列右侧下一个不为0的位置
	getNextInRow:function(r,c){
		//c+1
		c++;
		//c<CN结束,c++
		for(;c<this.CN;c++ ){
			 //如果r行c位置不是0
			 if(this.data[r][c]!=0){
				//返回c
				return c;
			 }
		//(遍历结束)
		}
		//返回-1
		return -1;
	},
	moveRight:function(){//左移所有行
		this.move(function(){
		//遍历data中每一行
		for(var r=0;r<this.RN;r++){
			//调用moveRightInRow右移第r行
			this.moveRightInRow(r);
		//(遍历后)
		}
		}.bind(this))
	},
	moveRightInRow:function(r){//左移第r行
		//c从CN-1开始，到>0结束,c每次递减1
		for(var c=this.CN-1;c>0;c--){
			//调用getPrevInRow方法，查找r行c列前一个不为0的位置，保存在prevc中
			var prevc=this.getPrevInRow(r,c);
			//如果prevc等于-1，就退出循环
			if(prevc==-1){break;}
			//否则
			else{
				//如果r行c位置的值为0
				if(this.data[r][c]==0){
					//将r行c位置的值替换为prevc位置的值
					this.data[r][c]=this.data[r][prevc];
					//将prevc位置的值置为0
					this.data[r][prevc]=0;
					//c留在原地
					c++;
				}
				//否则，如果r行c位置的值等于r行prevc位置的值
				else if(this.data[r][c]==this.data[r][prevc]){
					//将r行c位置的值*2
					this.data[r][c]*=2;
					//分数
					this.score+=this.data[r][c];
					//将prevc位置的值置为0
					this.data[r][prevc]=0;
				}
			}
		}
	},
	//查找r行c列右侧下一个不为0的位置
	getPrevInRow:function(r,c){
		//c-1
		c--
		//循环,c>=0,c每次递减1
		for(;c>=0;c--){
			//如果c位置的值不为0
			if(this.data[r][c]!=0){
				//返回c
				return c;
			}
			//(遍历结束)
		}
			//返回-1
			return -1;
	},
	moveUp:function(){
		this.move(function(){
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
		}
		}.bind(this))
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					this.data[nextr][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[nextr][c]){
					this.data[r][c]*=2;
					//分数
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}
		}
	},
	getNextInCol:function(r,c){
		r++;
		for(;r<this.RN;r++){
			if(this.data[r][c]!=0){
				return r;
			}
		}
		return -1;
	},
	moveDown(){
		this.move(function(){
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		}.bind(this))
	},
	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[prevr][c];
					this.data[prevr][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[prevr][c]){
					this.data[r][c]*=2;
					//分数
					this.score+=this.data[r][c];
					this.data[prevr][c]=0;
				}
			}
		}
	},
	getPrevInCol:function(r,c){
		r--;
		for(;r>=0;r--){
			if(this.data[r][c]!=0){
				return r;
			}
		}
		return -1;
	},
	//将数组中每个元素更新到页面div中
	undateView:function(){
		//遍历data中的每个元素
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//找到页面上id为“c”+r+c的div
				var div=document.getElementById("c"+r+c);
				//如果div的内容不是0
				if(this.data[r][c]!=0){
					//设置div的内容为当前元素值
					div.innerHTML=this.data[r][c];
					//设置div的className为"cell n"+当前元素值
					div.className="cell n"+this.data[r][c];
				}else{//否则
					//设置div的内容为""
					div.innerHTML="";
					//设置div的className为"cell"
					div.className="cell";
				}
			}
		}
		document.getElementById("score").innerHTML=this.score;
		//游戏结束
		if(this.state==this.GAMEOVER){
			document.getElementById("gameOver")
							.style.display="block";
			document.getElementById("fScore")
							.innerHTML=this.score;
		}else{
			document.getElementById("gameOver")
							.style.display="none";
		}
		//设置id为topScore的内容为
		document.getElementById("topScore").innerHTML=this.top;
	},
	
	//随机生成一个2/4
	randomNum:function(){
		while(true){
			//在0~RN-1之间生成一个随机数r
			r=Math.floor(Math.random()*(this.RN));
			//在0~CN-1之间生成一个随机数c
			c=Math.floor(Math.random()*(this.CN));
			if(this.data[r][c]==0){
				this.data[r][c]=(Math.random()>0.3?2:4);
				break;
			}
		}
	}
}
function Revocation(){
		console.log(game.revo);
		console.log(game.revo[game.step-1]);
		console.log(game.step);
	if(game.revo[game.step-1]!=undefined){
		game.step--;
		var newRevo=game.revo;
		newRevo=newRevo[game.step].split(/[,]/);
		for(var i=0,n=0,data1=[];i<newRevo.length;n++){
			data1[n]=newRevo.slice(i,i+=4);
		}
		game.data=data1;
		game.undateView();
		console.log(data1);
	}
}
document.getElementById("revocation").addEventListener("click",Revocation);
game.start();