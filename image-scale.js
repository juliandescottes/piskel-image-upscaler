(function() {

  var __createCanvas = function(width, height) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    return canvas;
  };

  var __getImageData = function(image) {
    var sourceContext = document.createElement('canvas').getContext('2d');
    sourceContext.drawImage(image, 0, 0);
    return sourceContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;
  };

  var _scaleNearestNeighbour = function(image, scaleInfo) {
    var canvas = __createCanvas(scaleInfo.width, scaleInfo.height);
    var context = canvas.getContext('2d');

    var factor = 1 / scaleInfo.zoom,
      imgData = __getImageData(image);

    var start = Date.now();
    var yRanges = {}, xOffset = 0,
      yOffset = 0;
    // Draw the zoomed-up pixels to a different canvas context
    for (var x = 0; x < scaleInfo.srcWidth; x++) {
      // Calculate X Range
      xRange = (((x + 1) * scaleInfo.zoom) | 0) - xOffset;

      for (var y = 0; y < scaleInfo.srcHeight; y++) {
        // Calculate Y Range
        if (!yRanges[y + ""]) {
          // Cache Y Range
          yRanges[y + ""] = (((y + 1) * scaleInfo.zoom) | 0) - yOffset;
        }
        yRange = yRanges[y + ""];

        var i = (y * scaleInfo.srcWidth + x) * 4;
        var r = imgData[i];
        var g = imgData[i + 1];
        var b = imgData[i + 2];
        var a = imgData[i + 3];

        context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
        context.fillRect(xOffset, yOffset, xRange, yRange);
        yOffset += yRange;
      }
      yOffset = 0;
      xOffset += xRange;
    }
    console.log("NEAREST NEIGHBOUR", Date.now() - start);
    return canvas;
  };

  var _scaleAntiAlias = function(image, scaleInfo) {
    var start = Date.now();
    var canvas = __createCanvas(scaleInfo.width, scaleInfo.height);
    var context = canvas.getContext('2d');

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(scaleInfo.zoom, scaleInfo.zoom);
    context.drawImage(image, -scaleInfo.srcWidth / 2, -scaleInfo.srcHeight / 2);
    context.restore();

    console.log("ANTIALIAS", Date.now() - start);
    return canvas;
  };

  var _getScaleInfo = function(image, zoom) {
    return {
      zoom: zoom,
      srcWidth: image.naturalWidth,
      srcHeight: image.naturalHeight,
      width: Math.round(zoom * image.naturalWidth),
      height: Math.round(zoom * image.naturalHeight)
    }
  };

  var _scale = function(image, zoom) {
    var canvas = null;
    if (zoom > 1) {
      canvas = _scaleNearestNeighbour(image, _getScaleInfo(image, zoom));
    } else {
      canvas = _scaleAntiAlias(image, _getScaleInfo(image, zoom));
    }
    canvas.setAttribute("data-src", image.src);
    return canvas;
  };

  var sizes = [32, 64, 100, 128, 200, 256, 300, 350, 500, 512, 4096, 10000];
  window.scaleAndReplace = function(piskelId, event) {
    var image = event.target || document.getElementById("image" + piskelId);
    for (var i = 0; i < sizes.length; i++) {

      var start = Date.now();
      var targetSize = sizes[i];

      var zoom = targetSize / image.naturalWidth;
      var preview_canvas = _scale(image, zoom);

      var canvas = __createCanvas(zoom * image.naturalWidth, zoom * image.naturalHeight);
      canvas.getContext('2d').drawImage(preview_canvas, 0, 0);
      canvas.className = "animated-preview-widget";


      image.parentNode.appendChild(canvas);
      console.log("DRAW SIZE", targetSize, Date.now() - start);
    }
  };
})();
