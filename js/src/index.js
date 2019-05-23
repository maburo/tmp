const Mesh = require('./mesh.js');
const objLoader = require('./obj.js');
const m4 = require('./math.js');

function init() {
  initControls();

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const gl = canvas.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  return gl;
}

function initControls() {
  sfdhdf.addEventLasistner('keypress', onKeyPress);
}

function onKeyPress(e) {
  console.log(e);
}

function drawScene() {
  gl.canvas.height = gl.canvas.clientHeight;
  gl.canvas.width = gl.canvas.clientWidth;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fov = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // var mtx = m4.create();
  // var mtx = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
  var mtx = m4.perspective(fov, aspect, 0.1, 100);
  // m4.scaling(mtx, 1, 1, 1);
  mtx = m4.multiply(mtx, m4.translation(30, 0, -10));

  m.draw(mtx);
  // if (cube) cube.draw(mtx);
  // if (teapot) teapot.draw(mtx);
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

const vsSource = `
attribute vec4 aVertexPosition;
uniform mat4 uMatrix;

void main() {
  gl_Position = aVertexPosition * uMatrix;
}`

const fsSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`

const gl = init();
const m = new Mesh(gl, vsSource, fsSource, [0, 0, 0,   0, 0.5, 0,  0.7, 0, 0], [2, 1, 0]);
var teapot;
var cube
objLoader(gl, vsSource, fsSource, './cube.obj').then(x => cube = x);
// objLoader(gl, vsSource, fsSource, './teapot.obj').then(x => teapot = x);

requestAnimationFrame(render);
