(function () {

var __createCanvas = function (width, height) {
	var canvas = document.createElement('canvas');
	canvas.setAttribute("width", width);
	canvas.setAttribute("height", height);
	return canvas;
};

var __getImageData = function (image) {
	var sourceContext = document.createElement('canvas').getContext('2d');
	sourceContext.drawImage(image,0,0);
	return sourceContext.getImageData(0,0,image.naturalWidth,image.naturalHeight).data;
};

var __scale = function (image, zoom) {
	var srcWidth = image.naturalWidth;
	var srcHeight = image.naturalHeight;
	var width = Math.round(zoom * srcWidth);
	var height = Math.round(zoom * srcHeight);

	var canvas = __createCanvas(width, height);
	var context = canvas.getContext('2d');

	if (zoom > 1) {
		// Nearest neightbor
		var factor = 1/zoom,
			imgData = __getImageData(image);

		var xOffset = 0, yOffset = 0;
		var yRanges = {};
		// Draw the zoomed-up pixels to a different canvas context
		for (var x=0;x<srcWidth;++x){
			var	tmpX = xOffset; // => Math.floor(xf) * srcHeight ?
			while (((tmpX*factor)|0) < x+1) {tmpX++}
			xRange = tmpX - xOffset;
		  for (var y=0;y<srcHeight;++y){
				var	tmpY = yOffset; // => Math.floor(xf) * srcHeight ?
				if (yRanges[y+""]) {
					yRange = yRanges[y+""]
				} else {
					while (((tmpY*factor)|0) < y+1) {tmpY++}
					yRange = tmpY - yOffset;
					yRanges[y+""] = yRange;
				}
		    var i = (y*srcWidth + x)*4;
		    var r = imgData[i  ];
		    var g = imgData[i+1];
		    var b = imgData[i+2];
		    var a = imgData[i+3];
		    if (a == 0) {
		    	var c = image.naturalHeight/8; // checker size
		    	if(x%c >= c/2 && y%c < c/2 || y%c >= c/2 && x%c < c/2) {
		    		context.fillStyle = "rgba(255,255,255,1)";	
		    	} else {
		    		context.fillStyle = "rgba(230,230,230,1)";
		    	}
		    } else {
		    	context.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
		    } 
		    context.fillRect(xOffset,yOffset,xRange,yRange);
		    yOffset += yRange;
		  }
			yOffset = 0;
		  xOffset += xRange;
		}
		return canvas;
	} else {
		for (var x=0;x<image.naturalWidth;++x){
	  	for (var y=0;y<image.naturalHeight;++y){
	    	var c = image.naturalHeight/8; // checker size
	    	if(x%c >= c/2 && y%c < c/2 || y%c >= c/2 && x%c < c/2) {
	    		context.fillStyle = "rgba(255,255,255,1)";	
	    	} else {
	    		context.fillStyle = "rgba(230,230,230,1)";
	    	}
		    context.fillRect(x*zoom,y*zoom,zoom,zoom);
	    }
	  }
		var canvas2 = __createCanvas(width, height);
		var context2 = canvas2.getContext('2d');
		context2.save();
  	context2.drawImage(canvas, 0, 0);
  	context2.translate(canvas2.width/2, canvas2.height/2);
		context2.scale(zoom, zoom);
  	context2.drawImage(image, -srcWidth/2, -srcHeight/2);
  	context2.restore();
  	canvas2.setAttribute("data-src", image.src);

		return canvas2;
	}
	
};

// var sizes = [64, 100, 128, 128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  150, 200, 256, 300, 500, 500,500,500,500];
var sizes = [32, 64, 100, 128, 200, 256, 300, 350, 500, 512];
window.scaleAndReplace = function (piskelId, event) {
	var image = event.target || document.getElementById("image" + piskelId);
	for (var i = 0 ; i < sizes.length ; i++) {
		var targetSize = sizes[i];
	
		var zoom = targetSize / image.naturalWidth;
		var preview_canvas = __scale(image, zoom);

		var canvas = __createCanvas(zoom * image.naturalWidth, zoom * image.naturalHeight);
		canvas.getContext('2d').drawImage(preview_canvas,0,0);
		canvas.className = "animated-preview-widget";
		

		image.parentNode.appendChild(canvas);
	}
};
})();	