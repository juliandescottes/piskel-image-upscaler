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
	var width = Math.round(zoom * image.naturalWidth);
	var height = Math.round(zoom * image.naturalHeight);

	var canvas = __createCanvas(width, height);
	var context = canvas.getContext('2d');

	var factor = 1/zoom; 
	var imgData = __getImageData(image);
	// Draw the zoomed-up pixels to a different canvas context
	for (var x=0;x<width;++x){
		var xf = x * factor;
		var	xOffset = (xf | 0) * image.naturalWidth;
	  for (var y=0;y<height;++y){
			var yf = y * factor;
	    // Find the starting index in the one-dimensional image data
	    var i = (yf + xOffset) << 2;
	    var r = imgData[i  ];
	    var g = imgData[i+1];
	    var b = imgData[i+2];
	    var a = imgData[i+3];

	    if (a == 0) {
	    	var c = image.naturalHeight/8; // checker size
	    	if(xf%c >= c/2 && yf%c < c/2 || yf%c >= c/2 && xf%c < c/2) {
	    		context.fillStyle = "rgba(255,255,255,1)";	
	    	} else {
	    		context.fillStyle = "rgba(230,230,230,1)";
	    	}
	    } else {
	    	context.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
	    } 
	    context.fillRect(y,x,1,1);
	  }
	}
	context.fillStyle = "red"
	context.fillText(width + " * " + height, 0,10);

	return canvas;
};

var sizes = [64, 100, 128, 150, 200, 256, 300, 500, 1024, 4096];
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