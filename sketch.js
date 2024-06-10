new p5();

console.log(windowWidth, windowHeight);
let widthmult = windowWidth/1991;
let heightmult = windowHeight/1120;
let charges = [
  {x:windowWidth*2/5, y:windowHeight/2, ch:1},
  {x:windowWidth*3/5, y:windowHeight/3, ch:2},
];
let charge_diam = 50*heightmult; 
let surfaces = [];
let selected_pt = -1;

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function dist(x1, y1, x2, y2){
  return sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function get_potential(x, y){
  let res = 0;
  for(let c of charges){
    res += 20*c.ch/dist(x, y, c.x, c.y);
  }
  return res;
}

// function get_mag(x, y){
//   return sqrt(x*x + y*y);
// }

function mouseDragged(){
  for(let i = 0; i < charges.length; i++){
    if(dist(mouseX, mouseY, charges[i].x, charges[i].y) < charge_diam/2 && selected_pt == -1){
      surfaces = [];
      selected_pt = i;
    }
  }

  if(selected_pt != -1){
    Object.defineProperty(charges[selected_pt], "x", {value:mouseX, configurable:true});
    Object.defineProperty(charges[selected_pt], "y", {value:mouseY, configurable:true});
  }
}

function mouseReleased(){
  selected_pt = -1;
}

function mousePressed(){
  let surface = [[mouseX, mouseY]];
  let const_pot = get_potential(surface[0][0], surface[0][1]);
  angleMode(DEGREES);
  while(surface.length == 1 || !(abs(surface[surface.length-1][0] - surface[0][0]) < 0.1 && abs(surface[surface.length-1][1] - surface[0][1]) < 0.1)){
    let best_pt = [];
    let best_mag = -1;
    for(let j = 0; j < 360; j++){
      let new_pt = [surface[surface.length-1][0] + 5*cos(j), surface[surface.length-1][1] + 5*sin(j)];
      let pot = get_potential(new_pt[0], new_pt[1]);
      let ok = true;
      for(let k = 1; k < 10; k++){
        if(surface.length >= k && abs(surface[surface.length - k][0] - new_pt[0]) < 0.1 && abs(surface[surface.length - k][1] - new_pt[1]) < 0.1){
          ok = false;
        }
      }
      if((best_mag == -1 || abs(pot - const_pot) < best_mag) && abs(pot - const_pot) < 0.1 && ok){
        best_pt = [new_pt[0], new_pt[1]];
        best_mag = abs(pot - const_pot);
      }
    }
    append(surface, best_pt);
    if(surface.length > 2 && abs(surface[0][0] - best_pt[0]) < 0.1 && abs(surface[0][1] - best_pt[1]) < 0.1){
      console.log("laksjdf;lkajsd;lfkasd");
      break;
    }
  }
  console.log(surface);
  append(surfaces, surface);
}

function draw() {
  background("#000000");

  let gridsize = 40*windowHeight/1120;
  for(let i = 0; i < windowWidth; i += gridsize){
    stroke(100);
    line(i, 0, i, windowHeight);
  }

  for(let i = 0; i < windowHeight; i += gridsize){
    stroke(100);
    line(0, i, windowWidth, i);
  }

  for(let c of charges){
    let t = String(c.ch);
    if(c.ch > 0){
      t = '+'.concat(t);
      fill(255, 50, 50);
    }
    else if(c.ch == 0){
      fill(255, 255, 255);
    }
    else{
      fill(50, 50, 255);
    }
    noStroke();
    circle(c.x, c.y, charge_diam);
    textAlign(CENTER, CENTER);
    textSize(20*heightmult);
    if(c.ch != 0){
      fill(255);
    }
    else{
      fill(0);
    }
    text(t, c.x, c.y);
  }

  stroke('white');
  strokeWeight(1);
  for(let j = 0; j < surfaces.length; j++){
    noFill();
    beginShape();
    for(let i = 0; i < surfaces[j].length-1; i++){
      curveVertex(surfaces[j][i][0], surfaces[j][i][1]);
    }
    endShape();
  }
}
