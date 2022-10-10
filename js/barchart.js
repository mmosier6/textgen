
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
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    
    if(typeof(options.dataLabels) === 'undefined'){
    	this.dataLabels = false;
    }else{
    	this.dataLabels = options.dataLabels;
    }
  
    this.draw = function(){
        var maxValue = 100;
        for (var categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ]);
        }
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;
 
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
 							var xx = (this.options.padding + barIndex * barSize) + (barSize/2);
 							var yy = this.canvas.height - barHeight - this.options.padding
 							if(val > 0){
 								this.ctx.fillText(val + "%", xx, yy);
 							}else if(val === -9999){
 								this.ctx.fillText("0%", xx, yy);
 							}else{
 								this.ctx.fillText("<1%", xx, yy);
 							}
 							
 							//Data name below axis
 							var xx = (this.options.padding + barIndex * barSize) + (barSize/2);
 							var yy = (this.canvas.height - barHeight - this.options.padding) + barHeight +  this.options.padding;
 							this.ctx.fillText(categ, xx, yy);
 	
 						}
            barIndex++;
        }
  
    }
}
