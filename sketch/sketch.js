let b, n, N, bSlider, nSlider, bx, by, newbx, newby, aButton;
let setnx = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let setny = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let newSetnx = [];
let newSetny = [];
let annotate = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  N = 20;
  
  bSlider = createSlider(0, 5, 2.5, 0.5);
  bSlider.input(biasCycle);
  bSlider.position(0, height-26);
  nSlider = createSlider(0, 5, 3, 0.5);
  nSlider.input(noiseSetNew);
  nSlider.position(width-138, height-26);
  
  aButton = createButton("Toggle Annotation");
  aButton.position(width-130, 4);
  aButton.mousePressed(toggleAnnotation);
  
  biasCycle();
  noiseSetNew();
  
  b = bSlider.value();
  n = bSlider.value();
  
  bx = width/2;
  by = height/2;
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bSlider.position(0, height-26);
  nSlider.position(width-138, height-26);
  aButton.position(width-130, 4);
}

function toggleAnnotation() {
  
  annotate = !annotate;
  
}

function draw() {
  
  
  n = lerp(n, nSlider.value(), 0.2);
  b = lerp(b, bSlider.value(), 0.2);

  noiseDraw();
  
  background(255);
  
  target(width/2, height/2);
  
  if (annotate) {
    annotateBias(bx, by, width/2, height/2);
  }
  
  //Bullseye
  fill(200, 50, 50);
  strokeWeight(3);
  noStroke();
  ellipse(width/2, height/2, 12);
  
  bx = lerp(bx, newbx, 0.2);
  by = lerp(by, newby, 0.2);
  
  shots(N, bx, by, n);
  
  annotateSliders();  
   
}

function noiseSetNew() {

  for (i = 0; i < N; i++) {
  
    newSetnx[i] = randomGaussian(0, nSlider.value())*nSlider.value()*2;
    newSetny[i] = randomGaussian(0, nSlider.value())*nSlider.value()*2;
    
  }
  
}

function noiseDraw() {

  for (i = 0; i < N; i++) {
  
    setnx[i] = lerp(setnx[i], newSetnx[i], 0.2)
    setny[i] = lerp(setny[i], newSetny[i], 0.2)
    
  }

}

function annotateSliders() {

  fill(0);
  noStroke();
  textSize(24);
  text("Bias", 8, height-30);
  
  text("Noise", width-130, height-30);
  

}

function target(x, y) {

  ellipseMode(CENTER);
  
  
  // Drawing circles (biggest first)
  
  strokeWeight(3);
  stroke(0, 255); // big circle has outline
  fill(200, 50, 50); 
  ellipse(x, y, 288);
  noStroke();
  fill(255); 
  ellipse(x, y, 242);
  fill(200, 50, 50); 
  ellipse(x, y, 196);
  fill(255); 
  ellipse(x, y, 150);
  fill(200, 50, 50); 
  ellipse(x, y, 104);
  fill(255);
  ellipse(x, y, 58);
  
}

function shots(N, x, y, n) {
  
    if (n < 0.5) {
      fill(255, 200, 50, 255);
      strokeWeight(1);
      stroke(0);
      ellipse(x + setnx[0], y + setny[0], 8);
      
    } else {
      
      
      fill(255, 200, 50, 255);
      stroke(0, 0, 255, 200);
      strokeWeight(1);
      
      if (annotate) {
        for (i = 0; i < N; i++) {
          linedash(x + setnx[i], y + setny[i], bx, by, 4);
        }  
      }
      
      stroke(0);
      
      for (i = 0; i < N; i++) {
        
        ellipse(x + setnx[i], y + setny[i], 8);
    
      }
      
      
    }
  
  
}

function annotateBias(x1, y1, x2, y2) {
  
  
  noFill();
  strokeWeight(3);
  stroke(0, 0, 255, 150);
  ellipse(x2, y2, b*64);
  line(x1, y1, x2, y2);

  ellipse(x1, y1, 10);
  
}

function biasCycle() {
  
  let rand = random(TWO_PI);
  newbx = width/2 + cos(frameCount/100)*bSlider.value()*32;
  newby = height/2 + sin(frameCount/100)*bSlider.value()*32;

}

function linedash(x1, y1, x2, y2, delta, style = '-') {
  // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
  let distance = dist(x1,y1,x2,y2);
  let dashNumber = distance/delta;
  let xDelta = (x2-x1)/dashNumber;
  let yDelta = (y2-y1)/dashNumber;

  for (let i = 0; i < dashNumber; i+= 2) {
    let xi1 = i*xDelta + x1;
    let yi1 = i*yDelta + y1;
    let xi2 = (i+1)*xDelta + x1;
    let yi2 = (i+1)*yDelta + y1;

    if (style == '-') { line(xi1, yi1, xi2, yi2); }
    else if (style == '.') { point(xi1, yi1); }
    else if (style == 'o') { ellipse(xi1, yi1, delta/2); }
  }
}