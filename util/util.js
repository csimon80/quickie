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