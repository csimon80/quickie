var run = function(options , data , element ){
  "use strict";
  /*
                      --- Creation of State ---
  A state is defined with two spaces, the data space, that is the physical or
  imported values to be plotted; and the canvas space, which are the integer 
  values representing the pixel locations, a state also includes a one2one and
  onto map between the two spaces. So, a state is a function of data, and
  transformations.
  */  
  var s = {
    axis:{
      x:{min:0,max:0},
      y:{min:0,max:0}
    },
    data:{
      x:{min:0,max:0},
      y:{min:0,max:0}
    },
    canvas:{
      x:{min:0,max:0},
      y:{min:0,max:0}
    }
  };

  //Array of variable names
  var arrNames = Object.keys(data)

  try {
    if(arrNames.length<2)
      throw new Error("Not enought data to plot, In future versions this might result in a histogram.") 
  } catch (e) {
    alert(e.name + " " +e.message)
  }

  var sketch = new Processing.Sketch();
  // Get min,max for both x and y of physical data.
  boxRange(data , arrNames , s.data);
  // Mapping the canvas end points |-> to physcial data. No squeezing.
  var squeeze=[1,1,1,1];
  canvasBoxBoundary(options , squeeze , s.canvas);
  // Mapping the canvas end points to physcial data.
  // Squeezing to insure that data values do not end up on x or y axis.
  squeeze=[1.05 , 0.8 , 0.5 , 1.1];
  canvasBoxBoundary(options , squeeze , s.axis)

/*///////////////////////////////////// MOUSE CLICKING START //////////////////
  $('#'+element).click(function(event) {
    var position = getPosition(event);
    var xx = toGrid(position.x,scaleX).toPrecision(4);
    var yy = toGrid(position.y,scaleY).toPrecision(4);
  });
*//////////////////////////////////// MOUSE CLICKING END //////////////////////
  
  sketch.attachFunction = function(p) {

    p.setup = function () {
      error:
      p.size(options.mainWidth,options.mainLength);
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

///////////////////////////////////// X - AXIS ////////////////////////////////
      //x - ticks
      var typeXaxis = "date";
      p.line(s.axis.x.min,
             s.axis.y.min,
             s.axis.x.max,
             s.axis.y.min); //x-axis
      //Determine tick positions at physcial data scale.
      tickArray(s.canvas.x.min, s.canvas.x.max, options.NumberOfTicksX)
      .forEach(function(x){
        p.fill(0);
        p.line(x,
               s.axis.y.min*0.99,
               x,
               s.axis.y.min*1.01
               );
        switch(typeXaxis){
          case 'index':
            var physcialValueText = toPhysical(x,s.canvas.x,s.data.x)
                                    .toPrecision(4)
                                    .toString();
          break;
          case 'date':
            var physcialValueText = moment
                                    .unix(toPhysical(x,s.canvas.x,s.data.x)|0)
                                    .format("YYYY-MM-DD");
          break;
          case 'datetime':
          break;
        }
        
        p.textAlign('CENTER');
        p.fill(10);
        p.text(physcialValueText , x - options.fontSize1/.4 , s.canvas.y.min*1.15);
      });

///////////////////////////////////// Y - AXIS ////////////////////////////////
      //y - ticks
      p.line(s.axis.x.min,
             s.axis.y.min,
             s.axis.x.min,
             s.axis.y.max); //y-axis
      //Determine tick positions at physcial data scale.
      tickArray(s.canvas.y.min, s.canvas.y.max, options.NumberOfTicksY)
      .forEach(function(y){
        p.line(s.axis.x.min*0.99,
               y,
               s.axis.x.min*1.01,
               y
               );

        var physcialValueText = toPhysical(y,s.canvas.y,s.data.y)
                    .toPrecision(3)
                    .toString();
        p.textAlign('CENTER');
        p.fill(10);
        p.text(physcialValueText, s.canvas.x.min - 7 * options.fontSize1, y + options.fontSize1/3);

      });

///////////////////////////////////// PLOT DATA ///////////////////////////////
      var plotType = ['lines','lines','lines','lines'];

      for(var j = 1 ; j < arrNames.length ; j++) {
        switch (plotType[j-1])
        {
        case 'points':
          p.fill(125);
          p.strokeWeight(options.pointWidth);
          data[arrNames[0]].forEach(function(xv,i) {
            p.ellipse(
              toCanvas(xv , s.canvas.x , s.data.x),
              toCanvas(data[arrNames[j]][i], s.canvas.y, s.data.y),
              options.pointRadius1,
              options.pointRadius1
              );
          });
        break;
        case 'lines':
          p.fill(125);
          p.strokeWeight(options.lineWidth);
          for(var i = 0; i < data[arrNames[0]].length - 1 ; i++){
            p.line(
              toCanvas(data[arrNames[0]][i]   , s.canvas.x, s.data.x),
              toCanvas(data[arrNames[j]][i]   , s.canvas.y, s.data.y),
              toCanvas(data[arrNames[0]][i+1] , s.canvas.x, s.data.x),
              toCanvas(data[arrNames[j]][i+1] , s.canvas.y, s.data.y)
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

  return s;
}; ///////////////// END OF RUN /////////////////////////////