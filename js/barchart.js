
function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}

var Barchart = function(options){
    this.options = options;
    //console.log(options);
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    this.which = options.which;

    if(typeof(options.dataLabels) === 'undefined'){
    	this.dataLabels = false;
    }else{
    	this.dataLabels = options.dataLabels;
    }

   if(typeof(options.xAxisLabels) === 'undefined'){
    	this.xAxisLabels = false;
    }else{
    	this.xAxisLabels = options.xAxisLabels;
    }
	
	if(typeof(options.barBorders) === 'undefined'){
		this.barBorders = false;
	}else{
		this.barBorders = options.barBorders;
	}

  
    this.draw = function(){
        var maxValue = 100;
        for (var categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ]);
        }
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;

	//Color background on 'tornado-damage-histogram'
	if(this.options.which === 'tornado-damage-histogram'){
		console.log(this.options.data);
       		var barIndex = 0;
       		var numberOfBars = Object.keys(this.options.data).length;
        	var barSize = (canvasActualWidth)/numberOfBars;
		var coords = new Array();
		var barIdx = new Array();
		var segTotal = new Array();
		var tc = 0;
		var total = 0;
	 	for (categ in this.options.data){
			var val = this.options.data[categ];
			var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
			var xx = (this.options.padding + barIndex * barSize);
			var yy = this.canvas.height - barHeight - this.options.padding
			var xAxisValues = new Array('60', '110', '140', '166', '201');
			var tmp = categ.split("-");
			//Get total counts for ranges
			tc = tc + parseInt(val);
			console.log(categ + " => " + val + "(" + tc + ")");
			total = total + parseInt(val);
			//Get x values
			for(const xv of xAxisValues){
				var coord_tmp = new Array();
				if((tmp[0] <= xv) && (tmp[1] >= xv)){
					coords.push(xx);
					console.log(tc - parseInt(val));
					segTotal.push(tc - parseInt(val));
					tc = parseInt(val);
					console.log(tc);
					break;	
				}else if((xv == '201') && (tmp[0] == '201+')){
					coords.push(xx);
					console.log(tc - parseInt(val));
					segTotal.push(tc - parseInt(val));
					tc = parseInt(val);
					console.log(tc);
					break;	
				}
			}

			barIndex++;	
		}
		var percents = new Array();
		for(var i = 1; i < segTotal.length; i++){
			if(i == 3){
				segTotal[i] = segTotal[i] + segTotal[4];
			}
			console.log(segTotal[i] + "/" + total);
			console.log(segTotal[i] / total);
			percents.push(segTotal[i] / total);
			if(i == 3){break;}
		}
	
		//Fill boxes
		let border_thickness = 1;
		//Base
		this.ctx.save();	
		this.ctx.fillStyle = 'rgba(255, 178, 178, 0.8)';
		this.ctx.fillRect(coords[0], 0, coords[1]-coords[0], this.canvas.height);
		this.ctx.restore();

		//Draw text of percentage
		var p = (percents[0] * 100).toFixed(0) + '%';
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 16px Arial";
		//this.ctx.fillText(p, ((coords[1]+coords[0])/2)-50, 10);
		this.ctx.fillText(p, ((coords[1]+coords[0])/2)-10, this.canvas.height-10);
		this.ctx.restore();
		/*
		//Draw text of raw numbers
		//var pp = segTotal[1] + "/" + total;
		var pp = segTotal[1];
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 10px Arial";
		//this.ctx.fillText(pp, (((coords[1]+coords[0])/2)-5)-50, 20);
		this.ctx.fillText(pp, coords[1]-25, 20);
		this.ctx.restore();
		*/

		//Considerable
		this.ctx.save();	
		this.ctx.fillStyle = 'rgba(237, 28, 36, 0.8)';
		this.ctx.fillRect(coords[1], 0, coords[2]-coords[1], this.canvas.height);
		this.ctx.restore();
		//Draw text of percentage
		var p = (percents[1] * 100).toFixed(0) + '%';
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 16px Arial";
		this.ctx.fillText(p, ((coords[2]+coords[1])/2)-10, this.canvas.height-10);
		//this.ctx.fillText(p, coords[2]-25, 10);
		this.ctx.restore();
		/*
		//Draw text of raw numbers
		var pp = segTotal[2] + "/" + total;
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 10px Arial";
		this.ctx.fillText(pp, ((coords[2]+coords[1])/2)-5, 20);
		this.ctx.restore();
		*/

		//Catastrophic
		this.ctx.save();	
		this.ctx.fillStyle = 'rgba(136, 0, 21, 0.8)';
		this.ctx.fillRect(coords[2], 0, this.canvas.width-coords[2], this.canvas.height);
		this.ctx.restore();
		//Draw text of percentage
		var p = (percents[2] * 100).toFixed(0) + '%';
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 16px Arial";
		this.ctx.fillText(p, (this.canvas.width+coords[2])/2, this.canvas.height-10);
		//this.ctx.fillText(p, this.canvas.width-25, 10);
		this.ctx.restore();
		/*
		//Draw text of raw numbers
		var pp = segTotal[3] + "/" + total;
		this.ctx.save();
		this.ctx.fillStyle = 'black';
		this.ctx.font = "bold 10px Arial";
		this.ctx.fillText(pp, ((this.canvas.width+coords[2])/2)-5, 20);
		this.ctx.restore();
		*/

	}  
 
        //drawing the grid lines
        var gridValue = 0;
        while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );
             
            //writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();
 
            gridValue+=this.options.gridScale;
        }

        //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
 
	for (categ in this.options.data){
		var val = this.options.data[categ];
		var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
		if(val === -9999){barHeight = 0};
		//drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color);
		if(this.options.barBorders){
			console.log("here: " + this.options.barBorders);
			
			drawBar(
				this.ctx,
				(this.options.padding + barIndex * barSize) - 2 ,
				(this.canvas.height - barHeight - this.options.padding) - 2,
				barSize-6,
				barHeight+2,
				this.options.barBorders
			);
			
		}
		drawBar(
			this.ctx,
			this.options.padding + barIndex * barSize,
			this.canvas.height - barHeight - this.options.padding,
			barSize - 10,
			barHeight,
			this.colors[barIndex%this.colors.length]
		);

		if(this.dataLabels === true){
			//Data value label on top of plot
			this.ctx.font = "14px Arial";
			this.ctx.textAlign = 'center';
			if(this.options.which === 'tornado-damage-histogram'){
				this.ctx.font = "10px Arial";
				this.ctx.textAlign = 'center';
			}
			var xx = (this.options.padding + barIndex * barSize) + (barSize/2);
			var yy = this.canvas.height - barHeight - this.options.padding
			if(this.options.which === 'conditional-probabilities'){
				if(val > 0){
					this.ctx.fillText(val + "%", xx, yy);
				}else if(val === -9999){
					this.ctx.fillText("0%", xx, yy);
				}else{
					this.ctx.fillText("<1%", xx, yy);
				}
			}else if(this.options.which === 'tornado-damage-histogram'){
				if(val > 0){
					this.ctx.save();
					this.ctx.translate(xx,yy);
					this.ctx.rotate(-Math.PI/2);
					this.ctx.fillText(val,10,0);
					this.ctx.restore();
				}
			}else{
				this.ctx.fillText(val, xx, yy);
			}
		}
		if(this.xAxisLabels === true){
			//Data name below axis
			var xx = (this.options.padding + barIndex * barSize);
			var yy = (this.canvas.height - barHeight - this.options.padding) + barHeight +  this.options.padding;
			if(this.options.which === 'tornado-damage-histogram'){
				var xAxisValues = new Array('60', '110', '140', '166', '201');
				var tmp = categ.split("-");
				for(const xv of xAxisValues){
					if((tmp[0] <= xv) && (tmp[1] >= xv)){
						this.ctx.fillText(xv, xx-5, yy);
						break;	
					}else if((xv == '201') && (tmp[0] == '201+')){
						this.ctx.fillText(xv, xx-5, yy);
						break;	
					}
				}	
			}else{
				this.ctx.fillText(categ, xx, yy);
			}
		}
   		barIndex++;
        }
    }
}
