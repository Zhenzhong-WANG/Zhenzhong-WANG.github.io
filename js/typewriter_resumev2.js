


var cvtimeInterval=2;
var cur = 0;
var posTop = 30;
var posLeft;
var canvasWidth
var canvasPadding=0.112;
var canvasTimeLocationSize=canvasPadding*3;
var Block=function (type,content) {
	this.type=type
	this.content=content
	if (this.type=="Section") {
		this.fontSize="20"
		this.fontStyle="normal bold "+this.fontSize+"px Times";
		this.padding=12;//padding before the section
		this.posleft=canvasWidth*canvasPadding*0.66;
	}else if (this.type=="EndSection") {
		this.padding=20;//padding after the section
	}else if (this.type=="EndList") {
		this.padding=8;//lie biao jian ge
	}else if (this.type=="Line"||this.type=="LineTime"||this.type=="LineLocation"||this.type=="List") {
		this.fontSize="18"
		if (this.type=="LineTime"||this.type=="LineLocation") {
			this.posleft=canvasWidth*0.734;
			this.posleft=canvasWidth*0.15;
		}
		else{
			this.posleft=canvasWidth*canvasPadding;
		}
		
		this.padding=5;
		this.fontStyle=this.fontSize+"px Times";
	}else if (this.type=="Title") {
		this.fontSize="28"
		this.posleft=100;
		this.padding=10;
		this.fontStyle="normal bold "+this.fontSize+"px Times";
	}else if (this.type=="Region"||this.type=="Contact") {
		this.fontSize="18"
		this.posleft=100;
		this.padding=10;
		this.fontStyle=this.fontSize+"px Times";
	}else if (this.type=="LineBf") {
		this.fontSize="18"
		this.padding=5;
		this.fontStyle="bold "+this.fontSize+"px Times";
		this.posleft=canvasWidth*canvasPadding;
	}else if (this.type=="LineIta") {
		this.fontSize="18"
		this.padding=5;
		this.fontStyle="italic "+this.fontSize+"px Times";
		this.posleft=canvasWidth*canvasPadding;
	}else if (this.type=="Link") {
		this.fontSize="18"
		this.padding=5;
		this.fontStyle="normal bold "+this.fontSize+"px Times";
		this.posleft=canvasWidth*canvasPadding;
	}
	
}
Block.prototype.savePosTop = function(posTop) {
	if (!this.posTop) {
		this.posTop=posTop;
	}
	
};



var CV = function(ctx, json) {
	this.ctx = ctx;
	this.ctx.textBaseline="top"
	this.json=json;
	this.backgroundColor="white";
	this.canvasWidth = ctx.canvas.offsetWidth;
	canvasWidth=this.canvasWidth
	this.canvasHeight = ctx.canvas.offsetHeight;
}

CV.prototype.renderBackground = function() {
	var ctx = this.ctx;
	ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	ctx.fillStyle = this.backgroundColor;
	ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	ctx.fill();
};

CV.prototype.haselement=function (json) {
	var keys=["Title","Sections","Lines","List","Location","Time","Name"]
	for (var i = 0; i < keys.length; i++) {
		if (json.hasOwnProperty(keys[i])) {
			return true
		}
	}
	return false;
	
}

CV.prototype.processInLine=function (str,renderObject) {
	//console.log(str)
	var re = new RegExp("\\$text{([^}]+)}{([^}]+)}");
	var re_res=str.match(re);
	if (!re_res) {
		var lineObject=new Block("Line",str);
		renderObject.push(lineObject)
		return renderObject
	}
	while (1){
		var beforeRe=str.substring(0,re_res.index);

		var afterRe=str.substr(re_res.index+re_res[0].length);
		//console.log(beforeRe,afterRe)
		var lineObject=new Block("Line",beforeRe);
		renderObject.push(lineObject)
		if (re_res[1]=="bf") {
			var lineObject=new Block("LineBf",re_res[2]);
			renderObject.push(lineObject)
		}else if (re_res[1]=="ita") {
			var lineObject=new Block("LineIta",re_res[2]);
			renderObject.push(lineObject)
		}else if (re_res[1]=="link") {
			var lineObject=new Block("Link",re_res[2]);
			renderObject.push(lineObject)
		}
		
		
		
		str=afterRe;
		var re_res=str.match(re);
		//console.log(re_res)
		if (!re_res) {
			var lineObject=new Block("Line",afterRe);
			renderObject.push(lineObject)
			break;
		}
	}
	
	return renderObject;
}

CV.prototype.parserjson=function (json) {
	var renderObject=[];

	var title=json["Title"]
	var titleObject=new Block("Title",title.Name);
	renderObject.push(titleObject)
	var regionObject=new Block("Region",title.Region);
	renderObject.push(regionObject)
	var contactObject=new Block("Contact",title.Contact);
	renderObject.push(contactObject)

	var Sections=json["Sections"];
	for (var i = 0 ;i <= Sections.length - 1; i++) {
		var jsonSec=Sections[i];
		for (prop in jsonSec) {
			if (prop=="Lines") {
				var lines=jsonSec[prop]
				for (var j =0; j<=lines.length - 1; j++) {
					renderObject=this.processInLine(lines[j],renderObject)
					// var lineObject=new Block("Line",lines[j]);
					// renderObject.push(lineObject)
				}
			}
			if (prop=="List") {	
				var lists=jsonSec[prop];
				for (var k=0;k<=lists.length-1;k++){
					var listObject=new Block("List");
					renderObject.push(listObject);
					var lines=lists[k]["Lines"];
					for (var j =0; j<=lines.length - 1; j++) {
						// var lineObject=new Block("Line",lines[j]);
						// renderObject.push(lineObject)
						renderObject=this.processInLine(lines[j],renderObject)
						if (lists[k].Time&&j==0) {
							var lineTimeObject=new Block("LineTime",lists[k]["Time"]);
							renderObject.push(lineTimeObject)
						}
						if (lists[k].Location&&j==1) {
							var lineLocationObject=new Block("LineLocation",lists[k]["Location"]);
							renderObject.push(lineLocationObject)
						}
					}
					var listObject=new Block("EndList");
					renderObject.push(listObject);
				}
			}
			if (prop=="Name") {
				var sectionObject=new Block("Section",jsonSec[prop]);
				renderObject.push(sectionObject)
			}
		}
		var endSectionObject=new Block("EndSection");
		renderObject.push(endSectionObject)
	}
	return renderObject;
}



var renderCanvas=function (ctx,posTop,posLeft) {
	var ro=renderObject[0];
	if (!ro) {
		return;
	}
	else if (ro.type=="List") {
		var ro=renderObject.shift();
		ctx.beginPath();
  		ctx.arc(ro.posleft-10,posTop+Number(ro.fontSize)/1.38,3,0,2*Math.PI);
 	 	ctx.fillStyle="black";
  		ctx.fill();
  		setTimeout(function() {
			posTop=posTop+ro.padding;
			renderCanvas(ctx,posTop,posLeft);
		}, cvtimeInterval)
	}
	else if (ro.type=="EndSection"||ro.type=="EndList") {
		var ro=renderObject.shift();
		posLeft=canvasWidth*canvasPadding;
		setTimeout(function() {
			posTop=posTop+ro.padding;
			renderCanvas(ctx,posTop,posLeft);
		}, cvtimeInterval)
	}
	else if (ro.type=="Title"||ro.type=="Region"||ro.type=="Contact") {
		if (cur < ro.content.length) {
			var txt=ro.content
			var tmp = txt.substr(0, cur + 1)
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(ro.posleft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "center"
			ctx.fillText(tmp,ctx.canvas.offsetWidth/2,posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject.shift();
				if (nextRo.type!="LineBf") {
					posTop=posTop+Number(ro.fontSize)+ro.padding;
				}
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}	

	}
	else if (ro.type=="Section") {
		if (cur < ro.content.length) {
			var txt=ro.content
			var tmp = txt.substr(0, cur + 1)
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(ro.posleft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			ctx.fillText(tmp,ro.posleft,posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject.shift();
				if (nextRo.type!="LineBf") {
					posTop=posTop+Number(ro.fontSize)+ro.padding;
				}
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}	
	}
	else if (ro.type=="Line") {
		var txt=ro.content
		var tmp = txt.substr(0, cur + 1)
		var nextRo;
		if(renderObject[1]){
			nextRo=renderObject[1]
		}
		if (cur < ro.content.length && posLeft+ctx.measureText(tmp+"-").width<canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime") ) {
			
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			ctx.fillText(tmp,posLeft,posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else if (cur < ro.content.length && posLeft+ctx.measureText(tmp+"-").width<canvasWidth*(1-canvasTimeLocationSize) && (nextRo.type=="LineLocation"||nextRo.type=="LineTime") ) {
			
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			ctx.fillText(tmp,posLeft,posTop);
			nextRo.savePosTop(posTop)
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else if (posLeft+ctx.measureText(tmp+"-").width>=canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime")) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop,ctx.measureText(tmp+"-").width, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			
			var nextlineStr=txt.substr(cur+1, txt.length)
			console.log(nextlineStr)
			//
			renderObject.shift()
			if (nextlineStr.length==1) {
				ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			}else if (!nextlineStr) {
				ctx.fillText(tmp,posLeft,posTop);
			}else if (nextlineStr.length>=1) {
				var re = new RegExp("([a-zA-Z\d]+)");
				var re_res=nextlineStr.match(re);
				console.log(re_res)
				if (re_res&&re_res[0]&&re_res[0].length==1) {
					ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
					nextlineStr=nextlineStr.substr(1,nextlineStr.length);
					while(nextlineStr.substr(0,1)==" "){
						nextlineStr=nextlineStr.substr(1,nextlineStr.length)
					}
					var lineObject=new Block("Line",nextlineStr);
					renderObject.splice(0,0,lineObject)
				}else if(nextlineStr.substr(0,1)==","||nextlineStr.substr(0,1)==" "){
					ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
					nextlineStr=nextlineStr.substr(1,nextlineStr.length);
					while(nextlineStr.substr(0,1)==" "){
						nextlineStr=nextlineStr.substr(1,nextlineStr.length)
					}
					var lineObject=new Block("Line",nextlineStr);
					renderObject.splice(0,0,lineObject)
				}else{
					var lineObject=new Block("Line",nextlineStr);
					renderObject.splice(0,0,lineObject)
					ctx.fillText(tmp+"-",posLeft,posTop);
				}
			}
			// 	//
			// if (nextlineStr.substr(0,1)==","||nextlineStr.substr(0,1)==" ") {
			// 	ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
			// }
			// else if(tmp[tmp.length-1]==","||tmp[tmp.length-1]==" "){
			// 	ctx.fillText(tmp,posLeft,posTop);
			// }
			// else if(nextlineStr.length==1){
			// 	ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			// } 
			// else if(!nextlineStr){
			// 	ctx.fillText(tmp,posLeft,posTop);
			// } 
			// else if(re_res[0]&&re_res[0].length==1){
			// 	ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			// 	nextlineStr=nextlineStr.substr(1,nextlineStr.length)
			// } 
			// else{
			// 	ctx.fillText(tmp+"-",posLeft,posTop);
			// }		
			// posTop=posTop+Number(ro.fontSize)+ro.padding;
			// renderObject.shift()
			// if (nextlineStr.length!=1 && nextlineStr) {
			// 	var nextlineStr=txt.substr(cur+1, txt.length)
			// 	if (nextlineStr.substr(0,1)==" "||nextlineStr.substr(0,1)==",") {
			// 		nextlineStr=nextlineStr.substr(1,nextlineStr.length)
			// 	}
			// 	while(nextlineStr.substr(0,1)==" "){
			// 		nextlineStr=nextlineStr.substr(1,nextlineStr.length)
			// 	}
			// 	var lineObject=new Block("Line",nextlineStr);
			// 	renderObject.splice(0,0,lineObject)
			// }
			
			cur=0;
			posTop=posTop+Number(ro.fontSize)+ro.padding;
			posLeft=canvasWidth*canvasPadding;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else if (posLeft+ctx.measureText(tmp+"-").width>=canvasWidth*(1-canvasTimeLocationSize) && (nextRo.type=="LineLocation"||nextRo.type=="LineTime")) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop,ctx.measureText(tmp+"-").width, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			
			var nextlineStr=txt.substr(cur+1, txt.length)
			if (nextlineStr.substr(0,1)==","||nextlineStr.substr(0,1)==" ") {
				ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
			}
			else if(tmp[tmp.length-1]==","||tmp[tmp.length-1]==" "){
				ctx.fillText(tmp,posLeft,posTop);
			}
			else if(nextlineStr.length==1){
				ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			} 
			else if(!nextlineStr){
				ctx.fillText(tmp,posLeft,posTop);
			} 
			else{
				ctx.fillText(tmp+"-",posLeft,posTop);
			}			
			posTop=posTop+Number(ro.fontSize)+ro.padding;
			renderObject.shift()
			if (nextlineStr.length!=1 && nextlineStr) {
				var nextlineStr=txt.substr(cur+1, txt.length)
				if (nextlineStr.substr(0,1)==" "||nextlineStr.substr(0,1)==",") {
					nextlineStr=nextlineStr.substr(1,nextlineStr.length)
				}
				while(nextlineStr.substr(0,1)==" "){
					nextlineStr=nextlineStr.substr(1,nextlineStr.length)
				}
				var lineObject=new Block("Line",nextlineStr);
				renderObject.splice(0,0,lineObject)

				var nextRo;
				var ith=1;
				nextRo=renderObject[ith]
				while(nextRo && nextRo.type!="EndList"){
					if (nextRo.type=="LineLocation") {
						nextRo.savePosTop(posTop)
						break;
					}
					if (ith>99) {
						break;
					}
					ith=ith+1;
					nextRo=renderObject[ith]
				}
				//console.log(renderObject[0],renderObject[1])
				
			}
			
			cur=0;
			posLeft=canvasWidth*canvasPadding;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject[1]
				renderObject.shift();
				if (nextRo.type=="LineBf"||nextRo.type=="LineIta") {
					posLeft=posLeft+ctx.measureText(ro.content).width;
				}else{
					posTop=posTop+Number(ro.fontSize)+ro.padding;
				}
				setTimeout(function() {
					//console.log(posLeft)
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}	
	}
	else if (ro.type=="LineBf") {
		var txt=ro.content
		var tmp = txt.substr(0, cur + 1)
		var nextRo;
		if(renderObject[1]){
			nextRo=renderObject[1]
		}
		if (cur < ro.content.length && posLeft+ctx.measureText(tmp+"-").width<canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime")) {
			
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			
			ctx.fillText(tmp,posLeft,posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else if (posLeft+ctx.measureText(tmp+"-").width>=canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime")) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop,ctx.measureText(tmp+"-").width, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			var nextlineStr=txt.substr(cur+1, txt.length)
			if (nextlineStr.substr(0,1)==","||nextlineStr.substr(0,1)==" ") {
				ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
			}
			else if(tmp[tmp.length-1]==","||tmp[tmp.length-1]==" "){
				ctx.fillText(tmp,posLeft,posTop);
			}
			else if(nextlineStr.length==1){
				ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			} 
			else if(!nextlineStr){
				ctx.fillText(tmp,posLeft,posTop);
			} 
			else{
				ctx.fillText(tmp+"-",posLeft,posTop);
			}			
			
			posTop=posTop+Number(ro.fontSize)+ro.padding;
			renderObject.shift()

			if (nextlineStr.length!=1 && nextlineStr) {
				var nextlineStr=txt.substr(cur+1, txt.length)
				if (nextlineStr.substr(0,1)==" "||nextlineStr.substr(0,1)==",") {
					nextlineStr=nextlineStr.substr(1,nextlineStr.length)
				}
				while(nextlineStr.substr(0,1)==" "){
					nextlineStr=nextlineStr.substr(1,nextlineStr.length)
				}
				var lineObject=new Block("LineBf",nextlineStr);
				renderObject.splice(0,0,lineObject)
			}

			cur=0;
			posLeft=canvasWidth*canvasPadding;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject[1]
				renderObject.shift();
				if (nextRo.type=="LineBf"||nextRo.type=="Line"||nextRo.type=="LineIta") {
					posLeft=posLeft+ctx.measureText(ro.content).width;
				}else{
					posTop=posTop+Number(ro.fontSize)+ro.padding;
				} 
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}	
	}
	else if (ro.type=="LineIta") {
		var txt=ro.content
		var tmp = txt.substr(0, cur + 1)
		var nextRo;
		if(renderObject[1]){
			nextRo=renderObject[1]
		}
		if (cur < ro.content.length && posLeft+ctx.measureText(tmp+"-").width<canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime")) {
			
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			
			ctx.fillText(tmp,posLeft,posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else if (posLeft+ctx.measureText(tmp+"-").width>=canvasWidth*(1-canvasPadding) && (nextRo.type!="LineLocation"&&nextRo.type!="LineTime")) {
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(posLeft, posTop,ctx.measureText(tmp+"-").width, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			var nextlineStr=txt.substr(cur+1, txt.length)
			console.log(nextlineStr)
			//
			renderObject.shift()
			if (nextlineStr.length==1) {
				ctx.fillText(tmp+nextlineStr,posLeft,posTop);
			}else if (!nextlineStr) {
				ctx.fillText(tmp,posLeft,posTop);
			}else if (nextlineStr.length>=1) {
				var re = new RegExp("([a-zA-Z\d]+)");
				var re_res=nextlineStr.match(re);
				console.log(re_res)
				if (re_res&&re_res[0]&&re_res[0].length==1) {
					ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
					nextlineStr=nextlineStr.substr(1,nextlineStr.length);
					while(nextlineStr.substr(0,1)==" "){
						nextlineStr=nextlineStr.substr(1,nextlineStr.length)
					}
					var lineObject=new Block("LineIta",nextlineStr);
					renderObject.splice(0,0,lineObject)
				}else if(nextlineStr.substr(0,1)==","||nextlineStr.substr(0,1)==" "){
					ctx.fillText(tmp+nextlineStr.substr(0,1),posLeft,posTop);
					nextlineStr=nextlineStr.substr(1,nextlineStr.length);
					while(nextlineStr.substr(0,1)==" "){
						nextlineStr=nextlineStr.substr(1,nextlineStr.length)
					}
					var lineObject=new Block("LineIta",nextlineStr);
					renderObject.splice(0,0,lineObject)
				}else{
					var lineObject=new Block("LineIta",nextlineStr);
					renderObject.splice(0,0,lineObject)
					ctx.fillText(tmp+"-",posLeft,posTop);
				}
			}
			
		
			cur=0;
			posTop=posTop+Number(ro.fontSize)+ro.padding;
			posLeft=canvasWidth*canvasPadding;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject[1]
				renderObject.shift();
				if (nextRo.type=="LineBf"||nextRo.type=="Line"||nextRo.type=="LineIta") {
					posLeft=posLeft+ctx.measureText(ro.content).width;
				}else{
					posTop=posTop+Number(ro.fontSize)+ro.padding;
				} 
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}	
	}
	else if (ro.type=="LineTime"||ro.type=="LineLocation") {
		if (cur < ro.content.length) {
			var txt=ro.content
			var tmp = txt.substr(0, cur + 1)
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(canvasWidth*(1-canvasPadding)-ctx.measureText(ro.content).width, ro.posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			ctx.fillText(tmp,canvasWidth*(1-canvasPadding)-ctx.measureText(ro.content).width,ro.posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject.shift();
				if (nextRo.type!="LineBf") {
					//posTop=posTop+Number(ro.fontSize)+ro.padding;
				}
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}			
	}
	else if (ro.type=="Link") {
		if (cur < ro.content.length) {
			var txt=ro.content
			var tmp = txt.substr(0, cur + 1)
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(canvasWidth*(1-canvasPadding)-ctx.measureText(ro.content).width, ro.posTop, ctx.canvas.offsetWidth, Number(ro.fontSize));//if delete these lines， it will render text many times， because every cur temp will be rendered
			ctx.fill();
			ctx.fillStyle = "blue";
			ctx.font=ro.fontStyle;
			ctx.textAlign = "left"
			ctx.fillText(tmp,canvasWidth*(1-canvasPadding)-ctx.measureText(ro.content).width,ro.posTop);
			cur++;
			setTimeout(function() {
				renderCanvas(ctx,posTop,posLeft);
			}, cvtimeInterval)
		}
		else{
			cur=0;
			if(renderObject[1]){
				nextRo=renderObject.shift();
				if (nextRo.type!="LineBf") {
					//posTop=posTop+Number(ro.fontSize)+ro.padding;
				}
				setTimeout(function() {
					renderCanvas(ctx,posTop,posLeft);///////////////////////////////
				},cvtimeInterval)
			}
		}			
	}
}




var renderObject;

CV.prototype.render = function(){
	json=this.json;
	renderObject=this.parserjson(json);
	for (var i = 0; i < renderObject.length; i++) {
		console.log(renderObject[i])
	}
//	console.log(renderObject)
	this.renderBackground();
	renderCanvas(this.ctx,posTop,canvasWidth*canvasPadding)

}

