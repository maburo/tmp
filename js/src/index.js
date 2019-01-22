const Mesh = require('./mesh.js');
const objLoader = require('./obj.js');

function init() {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const gl = canvas.getContext('webgl');
  gl.clearColor(0, 0, 0, 1);
  return gl;
}

function drawScene() {
  gl.canvas.height = gl.canvas.clientHeight;
  gl.canvas.width = gl.canvas.clientWidth;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // m.draw();
  if (teapot) teapot.draw();
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

const vsSource = `
attribute vec4 aVertexPosition;

void main() {
  gl_Position = aVertexPosition;
}`

const fsSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`

const gl = init();
const m = new Mesh(gl, vsSource, fsSource, [0, 0, 0,   0, 0.5, 0,  0.7, 0, 0], [2, 1, 0]);
var teapot;
objLoader(gl, vsSource, fsSource, './teapot.obj').then(x => teapot = x);

requestAnimationFrame(render);
