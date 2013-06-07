var run = function(options , data , element ){

  function tickArray(a, b, NumberOfTicks){
    for (var i=0, arr=[];i < NumberOfTicks; i++) arr.push(a + i * (b - a) / (NumberOfTicks - 1));
    return arr;
  }

  function range(a){
    if(data.x.length > 1) {
      var minA = Math.min.apply(Math,a);
      var maxA = Math.max.apply(Math,a);
    } else {
      var minA = a[0] - 1;
      var maxA = a[0] + 1;
    }
    return [minA,maxA];
  }
  //Array of variable names
  var arrNames = Object.keys(data)
  //Number of arrays sent
  var arrNum = Object.keys(data).length

  try {
    if(arrNum<2)
      throw new Error("Not enought data to plot, In the future version this will result in a histogram.") 
  } catch (e) {
    alert(e.name + " " +e.message)
  }

  var sketch = new Processing.Sketch();

  var mainWidth  = options.mainWidth;
  var mainLength = options.mainLength;

  var rnge;

  var minX = (rnge = range(data[arrNames[0]]))[0]
  var maxX = rnge[1]

  var minY = (rnge = range(data[arrNames[1]]))[0]
  var maxY = rnge[1]

  for(var i = 2 ; i < arrNum ; i++){
    minY = Math.min((rnge = range(data[arrNames[i]]))[0],minY)
    maxY = Math.max(rnge[1],maxY)
  }
// Mapping the canvas end points to the max and min points
  var x0data = mainWidth - Math.round( mainWidth * (1 - options.boxPadx));
  var x1data = mainWidth - Math.round( mainWidth * (options.boxPady));

  var y0data = mainLength - Math.round( mainLength * (options.boxPadx));
  var y1data = mainLength - Math.round( mainLength * (1 - options.boxPady));

  var aSData ={};
  aSData.x = [minX,maxX,x0data,x1data];
  aSData.y = [minY,maxY,y0data,y1data];

// Mapping the canvas end points to the plot axis end points
  var x0 = mainWidth - Math.round( 1.05*mainWidth * (1 - options.boxPadx));
  var x1 = mainWidth - Math.round( 0.8*mainWidth * (options.boxPady));

  var y0 = mainLength - Math.round( 0.5*mainLength * (options.boxPadx));
  var y1 = mainLength - Math.round( 1.1*mainLength * (1 - options.boxPady));

  var lowerLeftX  = x0;// * 0.95 * (mainLength/mainWidth);
  var lowerRightX = x1;// * 1.05;
  var lowerLeftY  = y0;// * 1.05;
  var upperLeftY  = y1;// * 0.95;

/////////////////////////////////////// MOUSE CLICKING START //////////////////
  $('#'+element).click(function(event) {
    var position = getPosition(event);
    var xx = toGrid(position.x,minX,maxX,x0data,x1data).toPrecision(4);
    var yy = toGrid(position.y,minY,maxY,y0data,y1data).toPrecision(4);
    p.println("X: " + xx + " Y: " +  yy);
  });
///////////////////////////////////// MOUSE CLICKING END //////////////////////
  
  sketch.attachFunction = function(p) {

    p.setup = function () {
      error:
      p.size(mainWidth,mainLength);
      p.background(200);
      p.noLoop();
      var fontA = p.loadFont("courier");
      p.textFont(fontA, options.fontSize1);
    }

    p.draw = function(){
      
      p.stroke(0);
      p.strokeWeight(options.axisWidth);
      //axis values
      //
      p.fill(255);
      p.line(lowerLeftX,y0,lowerRightX,y0); //x-axis
      p.line(x0,lowerLeftY,x0,upperLeftY); //y-axis

///////////////////////////////////// X - AXIS ////////////////////////////////
      //x - ticks
      var ticksX = tickArray(x0data, x1data, options.NumberOfTicksX);

      ticksX.forEach(function(x){
        p.fill(0);
        p.line(x,y0*0.99,x,y0*1.01);

        var gridP = toGrid(x,minX,maxX,x0data,x1data)
                    .toPrecision(3)
                    .toString();

        p.textAlign('CENTER');
        p.fill(10);
        p.text(gridP , x - options.fontSize1/2 , y0*1.05);

      });

///////////////////////////////////// Y - AXIS ////////////////////////////////
      //y - ticks
      var ticksY = tickArray(y0data, y1data, options.NumberOfTicksY);

      ticksY.forEach(function(y){
        p.line(x0*0.99,y,x0*1.01,y);
        var gridP = toGrid(y,minY,maxY,y0data,y1data)
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
      for(var j = 1 ; j < arrNum ; j++) {
        switch (plotType[j-1])
        {
        case 'points':
          p.fill(125);
          p.strokeWeight(options.pointWidth);
          data[arrNames[0]].forEach(function(xv,i) {
            p.ellipse(
              toPlot(xv,minX,maxX,x0data,x1data),
              toPlot(data[arrNames[j]][i],minY,maxY,y0data,y1data),
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
              toPlot(vx1,minX,maxX,x0data,x1data),
              toPlot(vy1,minY,maxY,y0data,y1data),
              toPlot(vx2,minX,maxX,x0data,x1data),
              toPlot(vy2,minY,maxY,y0data,y1data)
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
  return aSData;
}; ///////////////// END OF RUN /////////////////////////////