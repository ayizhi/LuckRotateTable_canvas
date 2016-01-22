

function ZhuanPan_moCentre(obj){
    this.canvas = obj.$canvas;
    this.ctx = this.canvas.getContext('2d');
    this.scale = window.devicePixelRatio || 3;
    this.canvas.width = $(this.canvas).width()*this.scale;
    this.canvas.height = $(this.canvas).height()*this.scale;

    this.zhuanPanNum = obj.texts.length;
    this.fontSize = parseInt($(document.body).css('font-size'));
    this.outerR = obj.outerR * this.fontSize * this.scale;
    this.border = obj.border * this.fontSize * this.scale;
    this.borderColor = obj.borderColor;
    this.innerR = obj.innerR * this.fontSize * this.scale || 3 * this.fontSize * this.scale
    this.texts = obj.texts;
    this.textSize = this.fontSize * this.scale * 0.7;
    this.textColor = obj.textColor;
    this.left = $(this.canvas).width()/2*this.scale - this.outerR - this.border;


    this.color = obj.color;
    this.innerColor = obj.innerColor;
    this.arrowWidth = 2 * this.fontSize * this.scale / 2;
    this.arrowColor = obj.arrowColor
    this.startR = obj.startR * this.fontSize * this.scale || 2.3 * this.fontSize * this.scale;//开始抽奖的那个圆的半径
    this.startColor = obj.startColor;
    this.noRollColor = obj.noRollColor;

    this.RotateDeg = 0;//旋转控制

    this.ajaxURL = obj.ajaxURL;
    this.weixinData = obj.weixinData;
    this.callback = obj.callback;
    this.chance = obj.chance;

    this.theDefaultDeg = 20*Math.PI*2
    this.allDegOnce = this.theDefaultDeg;//一次默认得走的角度
    this.ableToRotate = false;
    this.Finished = false;
    this.hasJudged = false;//判断是否有prizeId的参数，只需一次
    this.theDeg = 0;//每次需要走的距离
    this.regDict = {};

    this.oldId = null;

    this.innerText = obj.innerText;
    this.innerTextColor = obj.innerTextColor;
    this.dizuo = obj.dizuo;

    this.init()
}

ZhuanPan_moCentre.prototype = {

    init:function(){
        this.drawZhuanPan();
        this.drawInner();
        this.drawBg();
        this.drawDiZuo();
        var t = this
        //点击事件
        $(this.canvas).click(function(e){
            var pageX = e.offsetX;
            var pageY = e.offsetY;
            if(pageX >= (t.outerR + t.left + t.border - t.startR)/t.scale && pageX <= (t.outerR + t.left + t.border + t.startR)/t.scale){
                if(pageY >= (t.outerR - t.startR)/t.scale && pageY <= (t.outerR + t.startR)/t.scale){
                    if(t.ableToRotate == false){
                        t.ableToRotate = true
                        $.ajax({
                                url: t.ajaxURL,
                                type:'post',
                                data: $.extend(t.weixinData,{'chance': t.chance}),
                                success:function(reply){
                                    t.prizeId = reply || t.zhuanPanNum - 1
                                    console.log(t.prizeId)
                                },
                                error:function(err){
                                }
                            }
                        )
                    }
                }
            }
        })
    },

    drawDiZuo:function(){
        this.zhuanPanDiZuo = document.createElement('canvas');
        var ctx = this.zhuanPanDiZuo.getContext('2d');
        this.zhuanPanDiZuo.width = (this.outerR + this.border) * this.scale * 2;
        this.zhuanPanDiZuo.height = (this.outerR + this.border) * this.scale * 2;
        var t = this;

        //画底座
        var img = new Image();
        this.dizuoImage = img;
        img.src = t.dizuo;
        img.onload = function(){
            var imgWidthActually = 2* t.outerR
            ctx.drawImage(this, t.outerR + t.border - imgWidthActually/2, t.outerR + t.outerR*3/4,imgWidthActually, img.height * (imgWidthActually/img.width))
        }
    },

    drawBg:function(){
        this.zhuanPanBg = document.createElement('canvas');
        var ctx = this.zhuanPanBg.getContext('2d');
        this.zhuanPanBg.width = (this.outerR + this.border) * this.scale * 2;
        this.zhuanPanBg.height = (this.outerR + this.border) * this.scale * 2;

        ctx.beginPath();
        ctx.arc(this.outerR + this.border,this.border+this.outerR,(this.border + this.outerR),0,Math.PI*2);
        ctx.fillStyle = this.borderColor;
        ctx.fill()
        ctx.closePath()

        ctx.beginPath();
        ctx.arc(this.outerR + this.border,this.border+this.outerR,(this.border + this.outerR - this.border/2),0,Math.PI*2);
        ctx.fillStyle = '#c196f6';
        ctx.fill()
        ctx.closePath()

        //画灯点
        var reg = Math.PI*2 / 12;
        var allReg = 0
        for(var i=0;i<12;i++){
            ctx.save();
            ctx.translate(this.outerR + this.border , this.border + this.outerR)
            ctx.rotate(allReg);
            ctx.translate(-(this.outerR + this.border) , -(this.border + this.outerR))
            ctx.beginPath();
            ctx.arc(this.border/2,this.border + this.outerR,this.border/2,0,2*Math.PI)
            ctx.fillStyle = 'yellow'
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            allReg += reg;
        }
    },

    drawInner:function(){
        this.innerZhuanPan = document.createElement('canvas');
        var ctx = this.innerZhuanPan.getContext('2d');
        this.innerZhuanPan.width = this.outerR * this.scale * 2;
        this.innerZhuanPan.height = this.outerR * this.scale * 2;
        var t = this;


        //画箭头
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(this.outerR - this.arrowWidth,this.outerR );
        ctx.lineTo(this.outerR ,this.outerR  - this.innerR - 60 );
        ctx.lineTo(this.outerR  + this.arrowWidth,this.outerR );
        ctx.lineTo(this.outerR  - this.arrowWidth,this.outerR );
        ctx.closePath();
        ctx.fillStyle = this.arrowColor
        ctx.fill();

        //画开始抽奖

        ctx.beginPath();
        ctx.arc(this.outerR , this.outerR ,this.startR,0,Math.PI*2);
        ctx.fillStyle = this.startColor;
        ctx.fill()
        ctx.closePath();


       //画中间的字
        var text = this.innerText.split(',')
        ctx.fillStyle="#000";
        ctx.font = 'bolder ' + this.textSize*1.3 + 'px' + " Microsoft Yahei";
        ctx.textAlign="center";
        ctx.textBaseline="bottom";
        ctx.fillStyle = t.innerTextColor;
        ctx.fillText(text[0],this.outerR,this.outerR);

        ctx.fillStyle="#000";
        ctx.font = 'bolder ' + this.textSize*1.3 + 'px' + " Microsoft Yahei";
        ctx.textAlign="center";
        ctx.textBaseline="top";
        ctx.fillStyle = t.innerTextColor;
        ctx.fillText(text[1],this.outerR,this.outerR);

        //画小紫点
        var reg = Math.PI*2 / 16;
        var allReg = 0
        for(var i=0;i<16;i++){
            ctx.save();
            ctx.translate(this.outerR, this.outerR)
            ctx.rotate(allReg);
            ctx.translate(-(this.outerR) , -(this.outerR))
            ctx.beginPath();
            ctx.arc(this.outerR - this.startR,this.outerR,this.border/4,0,2*Math.PI)

            ctx.fillStyle = this.borderColor
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            allReg += reg;
        }

    },

    drawZhuanPan:function(){
        this.baseZhuanPan = document.createElement('canvas');
        var ctx =  this.baseZhuanPan.getContext('2d');
        this.baseZhuanPan.width = this.outerR*this.scale*2;
        this.baseZhuanPan.height = this.outerR*this.scale*2;

        var t = this;
        var theStep = 2*Math.PI/this.zhuanPanNum;
        var theBegin = 0;
        var theEnd = theBegin + theStep;
        var R = t.outerR;

        ctx.arc(R,R,R,0,2*Math.PI);
        ctx.clip();

        //画扇片
        for(var i=0;i<this.zhuanPanNum;i++){
            this.regDict[i] = [theBegin,theEnd]
            var text1 = t.texts[i].content[0]
            var textRadius1 = R*5/6


            ctx.save();
            ctx.fillStyle = '#EB852A';
            ctx.shadowOffsetX = 0; // 阴影Y轴偏移
            ctx.shadowOffsetY = 0; // 阴影X轴偏移
            ctx.shadowBlur = 63; // 模糊尺寸
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; // 颜色


            ctx.save();
            ctx.translate(R,R);
            ctx.beginPath();
            ctx.arc(0,0,R,theBegin,theEnd);
            ctx.save();
            ctx.rotate(theEnd);
            ctx.moveTo(R,0);
            ctx.lineTo(0,0);
            ctx.restore();
            ctx.rotate(theBegin)
            ctx.lineTo(R,0);
            ctx.closePath();
            ctx.restore();
            ctx.fillStyle = this.color[i%this.color.length]
            ctx.fill();
            ctx.restore();


            ctx.save();
            ctx.fillStyle = this.textColor;
            ctx.font = 'bolder ' + this.textSize*1.2 + 'px' + " Microsoft Yahei";
            ctx.translate(R + Math.cos(theBegin + theStep / 2) * textRadius1, R + Math.sin(theBegin + theStep / 2) * textRadius1);
            ctx.rotate(theBegin + theStep/2 + Math.PI/2);
            ctx.fillText(text1 , -ctx.measureText(text1).width / 2, 0)
            ctx.restore();




            //确定要画的是哪一个
            if(t.texts[i].content.length == 2){
                var text2 = null
                var textRadius2 = null
            }else{
                var text2 = t.texts[i].content[1]
                var textRadius2 = R*5/7
            }

            if(text2){
                ctx.save();
                ctx.fillStyle = this.textColor;
                ctx.font = this.textSize*6/7 + 'px' + " Microsoft Yahei";
                ctx.translate(R + Math.cos(theBegin + theStep / 2) * textRadius2, R + Math.sin(theBegin + theStep / 2) * textRadius2);
                ctx.rotate(theBegin + theStep/2 + Math.PI/2);
                ctx.fillText(text2 , -ctx.measureText(text2).width / 2, 0)
                ctx.restore();
            }


            (function(i,theBegin){
                var img1 = t.texts[i].content[t.texts[i].content.length - 1]
                var imgRadius1 = R * 4/6;
                var img = new Image()
                img.src = img1;

                img.onload = function(){
                    ctx.save();
                    ctx.translate(R + Math.cos(theBegin + theStep / 2 ) * imgRadius1 , R + Math.sin(theBegin + theStep / 2) * imgRadius1 );
                    ctx.rotate(theBegin + theStep/2 + Math.PI/2);
                    if(t.texts[i].content.length == 2){
                        ctx.drawImage(img , -img.width*3/4 , -img.height/2 , 2 * t.fontSize * t.scale , 2 * t.fontSize * t.scale)
                    }else{
                        ctx.drawImage(img , -img.width/2 , 10 , t.fontSize * t.scale , t.fontSize * t.scale)
                    }
                    ctx.restore();
                    delete this;
                }
            })(i,theBegin)


            theBegin += 2*Math.PI/this.zhuanPanNum;
            theEnd = theBegin + theStep
        }

        //画内圆
        ctx.save();
        ctx.fillStyle = '#EB852A';
        ctx.shadowOffsetX = 0; // 阴影Y轴偏移
        ctx.shadowOffsetY = 0; // 阴影X轴偏移
        ctx.shadowBlur = 50; // 模糊尺寸
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'; // 颜色
        ctx.beginPath();
        ctx.arc(this.outerR , this.outerR ,this.innerR,0,Math.PI*2);
        ctx.fillStyle = this.innerColor;
        ctx.fill()
        ctx.closePath();
        ctx.restore()
    },

    RotateUpdate:function(){//点击的时候就判断

        if(this.Finished){return}

        var theSingleDeg = Math.PI*2/this.zhuanPanNum;
        var theDefaultDeg = this.theDefaultDeg;
        //var theDeg = 0;
        var Pi2 = Math.PI * 2

        if (this.prizeId && !this.hasJudged) {//首先获得总路程
            this.hasJudged = true
            for (var i = 0; i < this.zhuanPanNum; i++) {
                if (this.texts[i].id == this.prizeId) {
                    if(!this.oldId){
                        this.theDeg = Math.PI * (3 / 2) - this.regDict[i][1] % (Pi2) > 0 ? (Math.PI * (3 / 2) - this.regDict[i][1] % (Pi2) + theSingleDeg / 2) + theDefaultDeg : ( Pi2 - (this.regDict[i][0] % (Pi2) + this.regDict[i][1] % (Pi2)) / 2 + Math.PI * (3 / 2)) + theDefaultDeg//计算角度的函数
                    }else{
                        console.log(this.zhuanPanNum - (this.prizeId - this.oldId))
                        this.theDeg = theDefaultDeg + (this.zhuanPanNum - (this.prizeId - this.oldId)) * theSingleDeg
                        console.log(this.oldId)
                    }
                    this.allDegOnce += this.theDeg;//总路程
                    for (var r = 0; r < this.zhuanPanNum; r++) {
                        this.regDict[r][0] += this.theDeg;
                        this.regDict[r][1] += this.theDeg;
                    }
                    break;
                }
            }
        }


        if (this.ableToRotate && this.theDeg == 0) {
            var speed = this.allDegOnce  * 0.01
            this.allDegOnce -= speed;
            this.RotateDeg += speed

        } else if (this.ableToRotate && this.theDeg > 0) {//获得总路程后开始旋转
            if (this.allDegOnce >= 0.01) {
                var speed = this.allDegOnce * 0.05
                this.allDegOnce -= speed;
                this.RotateDeg += speed

            } else {
                this.oldId = this.prizeId;
                this.prizeId = null;
                this.allDegOnce = 0;
                this.ableToRotate = false;
                this.hasJudged = false
                this.theDeg = 0;
                this.chance = this.chance>0 ? (this.chance - 1) : 0
                if(this.callback){
                    this.callback()
                }

                if(this.chance == 0){//机会用完不能转
                    this.Finished = true
                }
            }
        }
    },

    drawAll:function(){
        //画底座
        this.ctx.drawImage(this.zhuanPanDiZuo,this.left,0)
        //画背景
        this.ctx.drawImage(this.zhuanPanBg,this.left,0)

        //旋转
        var xpos = this.outerR + this.left + this.border;
        var ypos = this.outerR + this.border;
        this.ctx.drawImage(this.baseZhuanPan,xpos - this.outerR ,ypos - this.outerR,this.outerR*2*this.scale,this.outerR*2*this.scale)
        this.ctx.save();
        this.ctx.translate(xpos, ypos);
        this.ctx.rotate(this.RotateDeg);//旋转关键
        this.ctx.translate(-xpos, -ypos);
        this.ctx.drawImage(this.baseZhuanPan,xpos - this.outerR ,ypos - this.outerR,this.outerR*2*this.scale,this.outerR*2*this.scale)
        this.ctx.restore();


        //画内圆
        this.ctx.drawImage(this.innerZhuanPan,this.left + this.border,this.border)

        //画字(还剩几次)
        var text1 = '您今日还剩';
        var text2 = this.chance;
        var text3 = '次机会';
        var imgWidthActually = 2* this.outerR;
        //var theLeft =  - this.ctx.measureText(text1).width + this.left + this.border + this.outerR + 20
        //var theTop = this.outerR + this.outerR*3/4 + (this.dizuoImage.height * (imgWidthActually/this.dizuoImage.width)) - this.fontSize*this.scale/2
        //text1
        this.ctx.fillStyle = 'black';
        this.ctx.textBaseline = 'bottom';
        this.ctx.font = this.textSize*6/7 + 'px' + " Microsoft Yahei";
        var theLeft =  - this.ctx.measureText(text1).width + this.left + this.border + this.outerR + 20
        var theTop = this.outerR + this.outerR*3/4 + (this.dizuoImage.height * (imgWidthActually/this.dizuoImage.width)) - this.fontSize*this.scale/2
        var textWidth1 = this.ctx.measureText(text1).width + this.fontSize*2/3
        this.ctx.fillText(text1,theLeft,  theTop)
        //text2
        this.ctx.fillStyle = 'red';
        this.ctx.textBaseline = 'bottom'
        this.ctx.textAlign = 'middle';
        this.ctx.font = this.textSize*9/6 + 'px' + " Microsoft Yahei";
        var textWidth2 = this.ctx.measureText(text2).width + this.fontSize*2/3
        this.ctx.fillText(text2 , theLeft + textWidth1  ,theTop + 7 )
        //text3
        this.ctx.fillStyle = 'black';
        this.ctx.textBaseline = 'bottom';
        this.ctx.font = this.textSize*6/7 + 'px' + " Microsoft Yahei";
        var theLeft =  - this.ctx.measureText(text1).width + this.left + this.border + this.outerR + 20
        var theTop = this.outerR + this.outerR*3/4 + (this.dizuoImage.height * (imgWidthActually/this.dizuoImage.width)) - this.fontSize*this.scale/2
        this.ctx.fillText(text3 , theLeft + textWidth1 + textWidth2 ,  theTop)

    },

    run:function(){
        var t = this;
        var raf = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function (callback){window.setTimeout(callback, 17);};
        function ani(){
            t.RotateUpdate()
            t.drawAll();
            raf(ani)
        }
        ani()
    },
}