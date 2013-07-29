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

	var factor = 1/zoom,
			imgData = __getImageData(image),
			scaledImgData = context.createImageData(width, height),
			destIndex = 0;

	// Draw the zoomed-up pixels to a different canvas context
	for (var x=0;x<width;++x){
		var xf = x * factor;
		var	xOffset = (xf | 0) * srcWidth;
	  for (var y=0;y<height;++y){
			var yf = y * factor;
	    // Find the starting index in the one-dimensional image data
	    var i = (yf + xOffset) << 2;
	    var a = imgData[i+3];
	    if (a == 0) {
	    	var c = image.naturalHeight/8; // checker size
	    	if(xf%c >= c/2 && yf%c < c/2 || yf%c >= c/2 && xf%c < c/2) {
	    		scaledImgData.data[destIndex  ] = 255;
			    scaledImgData.data[destIndex+1] = 255;
			    scaledImgData.data[destIndex+2] = 255;
			    scaledImgData.data[destIndex+3] = 255;
	    	} else {
	    		scaledImgData.data[destIndex  ] = 230;
			    scaledImgData.data[destIndex+1] = 230;
			    scaledImgData.data[destIndex+2] = 230;
			    scaledImgData.data[destIndex+3] = 255;
	    	}
	    } else {
		    scaledImgData.data[destIndex  ] = imgData[i  ];
		    scaledImgData.data[destIndex+1] = imgData[i+1];
		    scaledImgData.data[destIndex+2] = imgData[i+2];
				scaledImgData.data[destIndex+3] = a;
	    }
	    destIndex += 4;
	  }
	}
	context.putImageData(scaledImgData, 0, 0);

	return canvas;
};

var sizes = [64, 100, 128, 128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  128,  150, 200, 256, 300, 500, 500,500,500,500];
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