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
// Map physical data |->  canvas value
function toCanvas (x, canvas, physical) {
  return (canvas.min + Math.round( (canvas.max - canvas.min) *   (x - physical.min) / (physical.max - physical.min)));
}
// Map canvas value |->  physical data
function toPhysical (X, canvas, physical) {
  return (physical.min +(physical.max - physical.min) * (X - canvas.min) / (canvas.max - canvas.min));
}

function tickArray(a, b, NumberOfTicks){
  for (var i=0, arr=[];i < NumberOfTicks; i++) arr.push(a + i * (b - a) / (NumberOfTicks - 1));
  return arr;
}

function boxRange(data, dataKeys , subStateObj){
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

  subStateObj.x.min = (tmpRange = range(data[dataKeys[0]]))[0]
  subStateObj.x.max = tmpRange[1]

  var ymin = (tmpRange = range(data[dataKeys[1]]))[0]
  var ymax = tmpRange[1]

  for(var i = 2 ; i < dataKeys.length ; i++){
    ymin = Math.min((tmpRange = range(data[dataKeys[i]]))[0],ymin)
    ymax = Math.max(tmpRange[1],ymax)
  }
  subStateObj.y.min = ymin;
  subStateObj.y.max = ymax;
}

function canvasBoxBoundary(opt , squeezeFactors , subStateObj){
  subStateObj.x.min = opt.mainWidth - Math.round( squeezeFactors[0]*opt.mainWidth * (1 - opt.boxPadx));
  subStateObj.x.max = opt.mainWidth - Math.round( squeezeFactors[1]*opt.mainWidth * (opt.boxPady));

  subStateObj.y.min = opt.mainLength - Math.round( squeezeFactors[2]*opt.mainLength * (opt.boxPadx));
  subStateObj.y.max = opt.mainLength - Math.round( squeezeFactors[3]*opt.mainLength * (1 - opt.boxPady));
}

function getIntersectDataAndMouse(data, state, startClick, endClick){
  var arrNames = Object.keys(data)
  var tmpData = {};

  var lBoundx = toPhysical(Math.min(endClick.x , startClick.x ) , state.canvas.x, state.data.x );
  var uBoundx = toPhysical(Math.max(endClick.x , startClick.x ) , state.canvas.x, state.data.x );

  var lBoundy = toPhysical(Math.max(endClick.y , startClick.y ) , state.canvas.y, state.data.y );
  var uBoundy = toPhysical(Math.min(endClick.y , startClick.y ) , state.canvas.y, state.data.y );

  
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