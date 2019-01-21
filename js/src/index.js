class Glx {

  // constructor(gl) {
  //   this.gl = gl;
  // }

  /**
  * Load vertex/fragment shader
  */
  loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }

    return shader;
  }

  /**
  * Initialize shader program
  */
  initShaderProgram(vsSrc, fsSrc) {
    const program = gl.createProgram();
    gl.attachShader(program, this.loadShader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(program, this.loadShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to init shader', gl.getProgramInfoLog(program));
    }

    return program;
  }
}

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

  if (teapot) teapot.draw();
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

const vsSource = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`

// const fsSource = `
// varying lowp vec4 vColor;
//
// void main() {
//  	gl_FragColor = vColor;
// }`

const fsSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`

const gl = init();
const glx = new Glx();
const program = glx.initShaderProgram(vsSource, fsSource);
requestAnimationFrame(render);
var teapot;

const objLoader = require('./obj.js')
objLoader.load(gl, program, './teapot.obj')
.then(function(obj) {
  teapot = obj;
})
