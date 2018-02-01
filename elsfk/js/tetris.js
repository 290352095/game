var tetris={
	RN:20,CN:10,//总行数，总列数
	CSIZE:26,//每个格子的大小
	OFFSET:15,//边框修正
	pg:null,//保存游戏容器div
	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存下一个备胎图形
	timer:null,//保存定时器序号
	interval:null,//保存下落的速度
	wall:null,//方块墙，保存所有停止下落的方块
	lines:0,//保存游戏删除的行数
	score:0,//保存游戏的得分
	level:0,//保存关卡数
	SCOTES:[0,10,30,60,100],//删除函数对应的得分
	state:1,//保存游戏状态
	RUNNING:1,//运行状态
	GAMEOVER:0,//游戏结束
	PAUSE:2,//游戏暂停
	start:function(){//启动游戏
		this.state=this.RUNNING;//重置游戏状态
		this.lines=0;this.score=0;//重置游戏的行数和分数
		//将wall复制为空数组
		this.wall=[];
		//r从0开始，到<RN结束
		for(var r=0;r<this.RN;r++){
			//在wall中压入一个CN个空元素的数组
			this.wall[r]=new Array(this.CN);
		}
		//找到class为playground的div保存在pg中
		this.pg=document.getElementsByClassName("playground")[0];
		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.paint();
		//this.timer=setInterval(this.moveDown.bind(this),this.interval);
		this.Timer();
		//为当前页面绑定键盘按下事件
		document.onkeydown=function(e){
			//判断键盘号
			switch(e.keyCode){
				case 37:this.state==this.RUNNING&&
					this.moveLeft();break;//是37：调用左移方法
				case 39:this.state==this.RUNNING&&
					this.moveRight();break;//是39：调用右移方法
				case 40:this.state==this.RUNNING&&
					this.moveDown();break;//是40：调用下移方法
				case 32:this.state==this.RUNNING&&
					this.hardDrop();break;//是32：一落到底
				case 38:this.state==this.RUNNING&&
					this.rotateR();break;//是38: 调右转方法
				case 90:this.state==this.RUNNING&&
					this.rotateL();break;//是90: 调左转方法
				case 80:this.state==this.RUNNING&&
					this.pause();break;//暂停
				case 67:this.state==this.PAUSE&&
					this.myContinue();break;//继续
				case 81:this.state==this.RUNNING&&
					this.gameOver();break;//结束
				case 83:this.state==this.GAMEOVER&&
					this.start();break;//开始
			}
		}.bind(this)
	},
	
	Level:function(){//游戏关卡  下落速度
		if(this.score>800){
			this.level=10;
			this.interval=100;
		}else if(this.score>=700){
			this.level=9;
			this.interval=200;
		}else if(this.score>=600){
			this.level=8;
			this.interval=300;
		}else if(this.score>=500){
			this.level=7;
			this.interval=400;
		}else if(this.score>=400){
			this.level=6;
			this.interval=500;
		}else if(this.score>=300){
			this.level=5;
			this.interval=600;
		}else if(this.score>=200){
			this.level=4;
			this.interval=700;
		}else if(this.score>=150){
			this.level=3;
			this.interval=800;
		}else if(this.score>=100){
			this.level=2;
			this.interval=900;
		}else{
			this.level=1;
			this.interval=1000;
		}
		return this.interval;
		},
	Timer:function(){
		clearInterval(this.timer);
		this.timer=null;
		this.Level();
		this.timer=setInterval(this.moveDown.bind(this),this.Level());
		console.log(this.Level());
		},
	gameOver:function(){
		this.state=this.GAMEOVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	pause:function(){//暂停
		this.state=this.PAUSE;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	myContinue:function(){//继续
		this.state=this.RUNNING;
		this.timer=setInterval(this.moveDown.bind(this),this.Level());
	},
	canRotate:function(){
		//遍历主角图形中每个cell	
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			//如果r<0或r>=RN或如果c<0或c>=CN或wall中和cell相同位置有格
			if(cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>=this.CN||this.wall[cell.r][cell.c]!==undefined){
			//返回false
			return false;
			}
		//遍历结束
		}
		//返回true
		return true;
	},
	rotateR:function(){
		this.shape.rotateR();
		//如果不可旋转
		if(!this.canRotate()){
			this.shape.rotateL();
		}else{
			this.paint();
		}
	},
	rotateL:function(){
		this.shape.rotateL();
		//如果不可旋转
		if(!this.canRotate()){
			this.shape.rotateR();
		}else{
			this.paint;
		}
	},
	hardDrop:function(){//空格  一落到底
		while(this.canDown()){
			this.moveDown();
		}	
	},
	canLeft:function(){//判断能否左移
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将cell保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c=0或wall中cell左侧有格
			if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){
			return false;//返回false
			}
		//遍历结束
		}
		return true;//返回true
	},
	moveLeft:function(){//左移
		//如果可以左移
		if(this.canLeft()){
			//调用主角图形左移方法
			this.shape.moveLeft();
			//重构
			this.paint();
		}
	},
	canRight:function(){//判断能否右移
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将cell保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c=0或wall中cell右侧有格
			if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){
				return false;//返回false
			}
		}//遍历结束
		return true;//返回true
	},
	moveRight:function(){//右移
		//如果可以右移
		if(this.canRight()){
			//调用主角图形右移方法
			this.shape.moveRight();
			//重构
			this.paint();
		}
	},
	canDown:function(){//判断能否下落
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果r=this.RN-1，或者wall中当前cell的下方位置有格
			if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){return false;}//返回false
		}//遍历结束
		return true;//返回true
	},
	landIntoWall:function(){//将主角图形的格落到墙中
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在变量cell中
			var cell=this.shape.cells[i];
			//设置wall中当前cell相同位置的元素值为cell
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){
		//如果可以下落
		if(this.canDown()){
			//调用moveDown方法
			this.shape.moveDown();
		}else{//否则
			//落到墙中
			this.landIntoWall();
			var ln=this.deleteRows();
			this.score+=this.SCOTES[ln];//分数
			this.lines+=ln;//行数
			if(!this.isGameOver()){//游戏没有结束
				this.shape=this.nextShape;//备胎转正
				//新建主角图像
				this.nextShape=this.randomShape();
			}else{//否则  修改游戏状态 停止计时器 清空timer
				this.state=this.GAMEOVER;
				clearInterval(this.timer);
				this.timer=null;
			}
		}
		//重绘主角图形
		this.paint();
	},
	isGameOver:function(){//判断游戏结束
		//遍历备胎图形中每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			//判断墙中和cell相同位置是否有格
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){
				//返回true
				return true;
			}
		}//遍历结束
		//返回false
		return false;
	},
	paintState:function(){//绘制状态图片
		//如果游戏状态为gameover，新建img元素，
		if(this.state==this.GAMEOVER){
			//设置img的src为img/game-over.png
			var img=new Image();
			img.src="img/game-over.png";
			//将img追加到pg中
			this.pg.appendChild(img);
		}else if(this.state==this.PAUSE){//否则 如果游戏状态为pause
			//设置img的src为img/pause.png
			var img=new Image();
			img.src="img/pause.png";
			//将img追加到pg中
			this.pg.appendChild(img);
		}
	},
	deleteRows:function(){//检查并删除所有满格行
		//自底向上遍历wall中的每一行
		for(var r=this.RN-1,ln=0;r>=0;r--){
			//如果r行为空行或ln等于4   就退出循环
			if(this.wall[r].join("")==""||ln==4){
				break;
			}
			//如果是满格行。就删除
			if(this.isFullRow(r)){
				this.deleteRow(r);
				r++;//让r留在原地
				ln++;//保存删除行数
				this.Timer();
			}
		}
		return ln;
	},
	isFullRow:function(r){//判断当前行是否满格
		//如果wall中r行转为字符串后包含^,或,,或,$就返回false
		return String(this.wall[r]).search(/^,|,,|,$/)==-1
	},
	deleteRow:function(r){//删除行
		//从r行开始，反向遍历wall中每一行
		for(;r>=0;r--){
			//用r-1行，替换r行
			this.wall[r]=this.wall[r-1];
			//将r行赋值为CN格空元素的数组
			this.wall[r-1]=new Array(this.CN);
			//遍历wall中r行的每个格
			for(var c=0;c<this.CN;c++){
				//如果当前格不是undefined
				if(this.wall[r][c]!==undefined){
					//将当前格的r+1
					this.wall[r][c].r++;
				}
			}//遍历结束
			//如果r-2行为空行退出循环
			if(this.wall[r-2].join("")==""){
				break;
			}
		}
	},
	randomShape:function(){//随机生成图形
		//在0~2之间生成一个随机整数r
		var r=Math.floor(Math.random()*(6+1));
		//判断r
		switch(r){
			case 0:return new O;break;//是0：返回O
			case 1:return new I;break;//是1：返回I
			case 2:return new T;break;//是2：返回T
			case 3:return new S;break;//是3：返回S
			case 4:return new Z;break;//是4：返回Z
			case 5:return new L;break;//是5：返回L
			case 6:return new J;break;//是6：返回J
		}
	},
	paint:function(){//重绘一切
		//将pg的内容中所有的img元素替换为""
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img\s[^>]+>/g,"");
		this.Level();
		this.paintShape();
		this.paintWall();
		this.paintNext();
		this.paintScore();
		this.paintState();
	},
	paintScore:function(){//重绘成绩
		document.getElementById("score").innerHTML=this.score;
		document.getElementById("lines").innerHTML=this.lines;
		document.getElementById("level").innerHTML=this.level;
	},
	paintNext:function(){//绘制备胎图形
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历备胎图形nextShape中每个cell对象
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=this.paintCell(frag,this.nextShape.cells[i]);
			//修改备胎的位置
			img.style.top=parseFloat(img.style.top)+this.CSIZE+"px";
			img.style.left=parseFloat(img.style.left)+this.CSIZE*10+"px";
		}
		//将frag追加到pg上
		this.pg.appendChild(frag);
	},
	paintWall:function(){//绘制墙中的内容
		var frag=document.createDocumentFragment();
		//自底向上遍历wall中每一行
		for(var r=this.RN-1;r>=0;r--){
			//如果当前行不是空行
			if(this.wall[r].join("")!=""){
				//遍历每个格
				for(var c=0;c<this.CN;c++){
					//如果当前格有效
					if(this.wall[r][c]){
						this.paintCell(frag,this.wall[r][c]);
					}
				}
			}else{break;}
		}
		//将frag追加到pg上
		this.pg.appendChild(frag);
	},
	paintCell:function(frag,cell){//绘制一个格的方法
			//创建img元素
			var img=new Image();
			//设置img的src为cell的src
			img.src=cell.src;
			//设置img的宽为CSIZE
			img.style.width=this.CSIZE+"px";
			//设置img的top为OFFSET+cell的r*CSIZE
			img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
			//设置img的left为OFFSET+cellc*CSIZE
			img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
			//将img追加到frag中
			frag.appendChild(img);
			return img;
	},
	paintShape:function(){//专门绘制主角图形
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历主角图形shape中每个cell对象
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell，临时保存在变量cell中
			this.paintCell(frag,this.shape.cells[i]);
		}
		//将frag追加到pg上
		this.pg.appendChild(frag);
	}
}
tetris.start();