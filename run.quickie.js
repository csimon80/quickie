var run = function(options , data , element ){

  //Array of variable names
  var arrNames = Object.keys(data)

  try {
    if(arrNames.length<2)
      throw new Error("Not enought data to plot, In the future version this will result in a histogram.") 
  } catch (e) {
    alert(e.name + " " +e.message)
  }

  var sketch = new Processing.Sketch();

  var mainWidth  = options.mainWidth;
  var mainLength = options.mainLength;

  var box = boxRange(data,arrNames);
  scaleX={};  scaleY={};
  scaleX.start=box[0];  scaleX.end=box[1];
  scaleY.start=box[2];  scaleY.end=box[3];

  // Mapping the canvas end points to the max and min points. No squeezing.
  var squeeze=[1,1,1,1];
  box = canvasBoxBoundary(mainWidth,mainLength,options,squeeze);

  scaleX.x0 = box[0];  scaleX.x1 = box[1];
  scaleY.x0 = box[2];  scaleY.x1 = box[3];

  // Mapping the canvas end points to the plot axis end points.
  // Squeezing to insure that data values do not end up on x or y axis.
  squeeze=[1.05,0.8,0.5,1.1];
  box = canvasBoxBoundary(mainWidth,mainLength,options,squeeze)

  var x0 = box[0];
  var x1 = box[1];
  var y0 = box[2];
  var y1 = box[3];

/////////////////////////////////////// MOUSE CLICKING START //////////////////
  $('#'+element).click(function(event) {
    var position = getPosition(event);
    var xx = toGrid(position.x,scaleX).toPrecision(4);
    var yy = toGrid(position.y,scaleY).toPrecision(4);
  });
///////////////////////////////////// MOUSE CLICKING END //////////////////////
  
  sketch.attachFunction = function(p) {

    p.setup = function () {
      error:
      p.size(mainWidth,mainLength);
      p.background(200);
      p.noLoop();
      //p.frameRate(.5);
      var fontA = p.loadFont("courier");
      p.textFont(fontA, options.fontSize1);
    }

    p.draw = function(){
      
      p.stroke(0);
      p.strokeWeight(options.axisWidth);
      //axis values
      //
      p.fill(255);
      p.line(x0,y0,x1,y0); //x-axis
      p.line(x0,y0,x0,y1); //y-axis

///////////////////////////////////// X - AXIS ////////////////////////////////
      //x - ticks
      var ticksX = tickArray(scaleX.x0, scaleX.x1, options.NumberOfTicksX);

      ticksX.forEach(function(x){
        p.fill(0);
        p.line(x,y0*0.99,x,y0*1.01);

        var gridP = toGrid(x,scaleX)
                    .toPrecision(3)
                    .toString();

        p.textAlign('CENTER');
        p.fill(10);
        p.text(gridP , x - options.fontSize1/2 , y0*1.05);

      });

///////////////////////////////////// Y - AXIS ////////////////////////////////
      //y - ticks
      var ticksY = tickArray(scaleY.x0, scaleY.x1, options.NumberOfTicksY);

      ticksY.forEach(function(y){
        p.line(x0*0.99,y,x0*1.01,y);
        var gridP = toGrid(y,scaleY)
                    .toPrecision(3)
                    .toString();
        p.textAlign('CENTER');
        p.fill(10);
        //console.log(y);
        //console.log(gridP);
        p.text(gridP, x0 - 3 * options.fontSize1, y + options.fontSize1/2);

      });
      plotType = ['lines','lines','lines','points'];

///////////////////////////////////// PLOT DATA ///////////////////////////////

      for(var j = 1 ; j < arrNames.length ; j++) {
        switch (plotType[j-1])
        {
        case 'points':
          p.fill(125);
          p.strokeWeight(options.pointWidth);
          data[arrNames[0]].forEach(function(xv,i) {
            p.ellipse(
              toPlot(xv,scaleX),
              toPlot(data[arrNames[j]][i],scaleY),
              options.pointRadius1,
              options.pointRadius1
              );
          });
        break;
        case 'lines':
          p.fill(125);
          p.strokeWeight(options.lineWidth);
          for(var i = 0; i < data[arrNames[0]].length - 1 ; i++){
            var vx1 = data[arrNames[0]][i]
            var vx2 = data[arrNames[0]][i+1]
            var vy1 = data[arrNames[j]][i]
            var vy2 = data[arrNames[j]][i+1]
            p.line(
              toPlot(vx1,scaleX),
              toPlot(vy1,scaleY),
              toPlot(vx2,scaleX),
              toPlot(vy2,scaleY)
              )
          }
        break;  
        default:
          "asdf"
        }
      }

    } // DRAW ()
  }

  var canvas = document.getElementById(element);
  // attaching the sketch to the canvas
  var p = new Processing(canvas, sketch);

  var boxBoundarydataBoundary ={};
  boxBoundarydataBoundary.x = scaleX;
  boxBoundarydataBoundary.y = scaleY;

  return boxBoundarydataBoundary;
}; ///////////////// END OF RUN /////////////////////////////