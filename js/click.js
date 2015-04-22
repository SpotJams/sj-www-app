var spotjams = spotjams || {};
spotjams.ui = spotjams.ui || {};
spotjams.clickbuster = spotjams.clickbuster || {};

spotjams.ui.FastButton = function(element, handler) {
  this.element = element;
  this.handler = handler;

  element.addEventListener('touchstart', this, false);
  element.addEventListener('click', this, false);
};

spotjams.ui.FastButton.prototype.handleEvent = function(event) {
  switch (event.type) {
    case 'touchstart': this.onTouchStart(event); break;
    case 'touchmove': this.onTouchMove(event); break;
    case 'touchend': this.onClick(event); break;
    case 'click': this.onClick(event); break;
  }
};

spotjams.ui.FastButton.prototype.onTouchStart = function(event) {
  // console.log("FastButton.onTouchStart() - ENTER ");
  event.stopPropagation();

  this.element.addEventListener('touchend', this, false);
  document.body.addEventListener('touchmove', this, false);

  this.startX = event.touches[0].clientX;
  this.startY = event.touches[0].clientY;
};

spotjams.ui.FastButton.prototype.onTouchMove = function(event) {
  if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
      Math.abs(event.touches[0].clientY - this.startY) > 10) {
    this.reset();
  }
};

spotjams.ui.FastButton.prototype.onClick = function(event) {
  // console.log("FastButton.onClick() - ENTER ");
  event.stopPropagation();
  this.reset();
  this.handler(event);

  if (event.type == 'touchend') {
    spotjams.clickbuster.preventGhostClick(this.startX, this.startY);
  }
};

spotjams.ui.FastButton.prototype.reset = function() {
  this.element.removeEventListener('touchend', this, false);
  document.body.removeEventListener('touchmove', this, false);
};

spotjams.clickbuster.preventGhostClick = function(x, y) {
  spotjams.clickbuster.coordinates.push(x, y);
  window.setTimeout(spotjams.clickbuster.pop, 500);
};

spotjams.clickbuster.pop = function() {
  spotjams.clickbuster.coordinates.splice(0, 2);
};

spotjams.clickbuster.onClick = function(event) {
  if(event == undefined || event == null || event == false) {
    return true;
  }
  // console.log("clickbuster - ENTER ", spotjams.clickbuster.coordinates, event);

  if (event.type === "tap") {
      event.clientX = event.center.x
      event.clientY = event.center.y
  } 

  if (event.clientX === 0 && event.clientY === 0) {
    // console.log("clickbuster - ZERO");
    return false;
  }
  for (var i = 0; i < spotjams.clickbuster.coordinates.length; i += 2) {
    var x = spotjams.clickbuster.coordinates[i];
    var y = spotjams.clickbuster.coordinates[i + 1];
    if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }      
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
  }
  spotjams.clickbuster.preventGhostClick(event.clientX, event.clientY);
  // console.log("clickbuster - PASS ");
  return true;
};

document.addEventListener('click', spotjams.clickbuster.onClick, true);
spotjams.clickbuster.coordinates = [];
