//https://learnopengl.com/Getting-started/Camera

class Renderer {
  constructor(camera) {
    this.camera = camera;
  }

  async init() {
    console.log('Init GL...');

    this.objects = [];

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const gl = this.gl = canvas.getContext('webgl2');
    this.gl.clearColor(0, 0, 0, 1);

    const frag = await fetch('assets/shaders/simple_fragment.glsl')
      .then(resp => resp.text());

    const vert = await fetch('assets/shaders/simple_vertex.glsl')
      .then(resp => resp.text());

    this.prog = this.initShaderProgram(this.gl, vert, frag);

    this.grid = new Grid();
    this.grid.init(gl, this);

    /*************************************************************************/
    this.projection = gl.getUniformLocation(this.prog, 'projection');
    this.model = gl.getUniformLocation(this.prog, 'model');
    this.objectColor = gl.getUniformLocation(this.prog, 'objectColor');
    this.lightColor = gl.getUniformLocation(this.prog, 'lightColor');
    this.lightPos = gl.getUniformLocation(this.prog, 'lightPos');
    /*************************************************************************/
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

  initShaderProgram(gl, vsSrc, fsSrc) {
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

  addMesh(mesh) {
    mesh.init(this.gl);
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
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(this.projection, false, this.camera.projMtx());

    this.objects.forEach(o => {
      gl.uniformMatrix4fv(this.model, false, m4.translation(o.pos[0], o.pos[1], o.pos[2]));
      gl.uniform3fv(this.objectColor, [.5, .5, .5]);
      gl.uniform3fv(this.lightColor, [1, 1, 1])
      gl.uniform3fv(this.lightPos, [0, 14, 10]);

      o.draw(gl);
    });
    /**************************************************************************/
  }

  // async createMesh() {
  //   const mesh = new Mesh();
  //   await mesh.init(this.gl,
  //     'src/shaders/simple_vertex.glsl',
  //     'src/shaders/simple_fragment.glsl',
  //     [0, 0, 0, 1, 1, 1, 0, 1, 1],
  //     [0, 1, 2]);
  //
  //   return mesh;
  // }
}
