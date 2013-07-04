function getPosition(e) {
  var targ;
  if (!e) e = window.event;
  if (e.target) targ = e.target;
  else if (e.srcElement)  targ = e.srcElement;
  
  if (targ.nodeType == 3) // defeat Safari bug
      targ = targ.parentNode;

  var x = e.pageX - $(targ).offset().left;
  var y = e.pageY - $(targ).offset().top;

  return {"x": x, "y": y};
};

function toGrid (x ,start, end, x0, x1) {
  return (start + (end - start) *  (x - x0) / (x1 - x0));
}

function toPlot (X ,start, end, x0, x1) {
  return (x0 + Math.round((x1 - x0) * (X - start) / (end - start)));;
}

function tickArray(a, b, NumberOfTicks){
  for (var i=0, arr=[];i < NumberOfTicks; i++) arr.push(a + i * (b - a) / (NumberOfTicks - 1));
  return arr;
}

function boxRange(data, dataKeys){
  function range(a){
    if(data[dataKeys[0]].length > 1) {
      var minA = Math.min.apply(Math,a);
      var maxA = Math.max.apply(Math,a);
    } else {
      var minA = a[0] - 1;
      var maxA = a[0] + 1;
    }
    return [minA,maxA];
  }
  var tmpRange;

  var minX = (tmpRange = range(data[dataKeys[0]]))[0]
  var maxX = tmpRange[1]

  var minY = (tmpRange = range(data[dataKeys[1]]))[0]
  var maxY = tmpRange[1]

  for(var i = 2 ; i < dataKeys.length ; i++){
    minY = Math.min((tmpRange = range(data[dataKeys[i]]))[0],minY)
    maxY = Math.max(tmpRange[1],maxY)
  }
  return [minX, maxX, minY, maxY];
}

function canvasBoxBoundary(width,length,options,squeezeFactors){
  var xLo = width - Math.round( squeezeFactors[0]*width * (1 - options.boxPadx));
  var xHi = width - Math.round( squeezeFactors[1]*width * (options.boxPady));

  var yLo = length - Math.round( squeezeFactors[2]*length * (options.boxPadx));
  var yHi = length - Math.round( squeezeFactors[3]*length * (1 - options.boxPady));
  return [xLo,xHi,yLo,yHi];
}

function getIntersectDataAndMouse(data, initBounds, startClick, endClick){
  var arrNames = Object.keys(data)
  var tmpData = {};

  var xS = initBounds.x
  var lBoundx = toGrid(Math.min(endClick.x , startClick.x ) , xS[0] , xS[1] , xS[2] , xS[3] );
  var uBoundx = toGrid(Math.max(endClick.x , startClick.x ) , xS[0] , xS[1] , xS[2] , xS[3] );

  var yS = initBounds.y
  var lBoundy = toGrid(Math.max(endClick.y , startClick.y ) , yS[0] , yS[1] , yS[2] , yS[3] );
  var uBoundy = toGrid(Math.min(endClick.y , startClick.y ) , yS[0] , yS[1] , yS[2] , yS[3] );

  
  tmpData[arrNames[0]] = [];
  for(var i = 1 ; i < arrNames.length ; i++)
    tmpData[arrNames[i]] = [];

  for (var i = 0; i< data[arrNames[0]].length; i ++) {
    
    if(data[arrNames[0]][i] <= uBoundx & data[arrNames[0]][i] >= lBoundx & data[arrNames[1]][i] >= lBoundy & data[arrNames[1]][i] <= uBoundy)
    {

      tmpData[arrNames[0]].push(data[arrNames[0]][i]);
      for(var j = 1 ; j < arrNames.length ; j++)
        tmpData[arrNames[j]].push(data[arrNames[j]][i]);
    }
  }
  return tmpData;
}