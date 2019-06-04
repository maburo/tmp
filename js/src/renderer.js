//https://learnopengl.com/Getting-started/Camera

class Renderer {
  constructor(camera) {
    this.camera = camera;
  }

  async init() {
    console.log('Init GL...');

    this.objects = [];
    this.shaders = {};

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const gl = this.gl = canvas.getContext('webgl2');
    this.gl.clearColor(0, 0, 0, 1);

    this.grid = new Grid();
    this.grid.init(gl, this);
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader', gl.getShaderInfoLog(shader), source);
        gl.deleteShader(shader);
        return;
    }

    return shader;
  }

  initShaderProgram(vsSrc, fsSrc) {
    const gl = this.gl;
    console.log('Init shader...');
    const program = gl.createProgram();

    const vertex = this.loadShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fragment = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to init shader', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    return program;
  }

  createShaderProgram(name, vsSrc, fsSrc) {
    if (!this.shaders[name]) {
      this.shaders[name] = this.initShaderProgram(vsSrc, fsSrc);
    }

    return this.shaders[name];
  }

  async addMesh(mesh) {
    await mesh.init(this.gl, this);
    this.objects.push(mesh);
  }

  drawScene(delta) {
    const gl = this.gl;
    this.camera.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    gl.canvas.height = gl.canvas.clientHeight;
    gl.canvas.width = gl.canvas.clientWidth;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.update(delta);

    this.grid.draw(gl);

    /**************************************************************************/
    this.objects.forEach(o => {
      if (this.drawBBox) {
        o.bbox;
      }
      o.draw(gl);
    });
    /**************************************************************************/
  }

  rayPick(x, y) {
    if (!x && !y) {
      x = this.gl.canvas.clientWidth / 2;
      y = this.gl.canvas.clientHeight / 2;
    }

    this.camera.getProjMtx();
    const camPos = this.camera.pos;

    const homogeneousClipCoords = [
      (2 * x) / this.gl.canvas.clientWidth - 1,
      1 - (2 * y) / this.gl.canvas.clientHeight,
      -1
    ];

    const rayEye = v3.transformMat4(homogeneousClipCoords, m4.inverse(this.camera.perspMtx));
    const rayWor = v3.transformMat4(rayEye, m4.inverse(this.camera.viewMtx))

    var tmp = rayWor;

    tmp = v3.normalize(v3.sub(tmp, camPos))
    tmp = v3.add(camPos, v3.mul(tmp, 10))

    const p = new Pointer(tmp, [1, 1, 0], 3);
    p.init(this.gl, this)
    this.objects.push(p);
  }
}
