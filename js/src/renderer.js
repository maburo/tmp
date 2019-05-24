//https://learnopengl.com/Getting-started/Camera

class Renderer {
  async init() {
    console.log('Init GL...');

    this.objects = [];

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const gl = this.gl = canvas.getContext('webgl2');
    this.gl.clearColor(0, 0, 0, 1);

    this.camera = new Camera(45, gl.canvas.clientWidth / gl.canvas.clientHeight);

    const movespeed = 0.1;
    const mousepos = [0, 0];
    const mousesense = .07;
    window.addEventListener('mousemove', e => {
      if (e.buttons && e.button === 0) {
        this.camera.rotate((e.x - mousepos[0]) * mousesense, (e.y - mousepos[1]) * -mousesense, 0);
      }
      mousepos[0] = e.x;
      mousepos[1] = e.y;
    });

    window.addEventListener('keypress', e => {
      switch (e.code) {
        case 'KeyW':
          this.camera.move(0, 0, movespeed);
          break;
        case 'KeyS':
          this.camera.move(0, 0, -movespeed);
          break;
        case 'KeyA':
          this.camera.move(-movespeed, 0, 0);
          break;
        case 'KeyD':
          this.camera.move(movespeed, 0, 0);
          break;
      }
    })

    const frag = await fetch('assets/shaders/simple_fragment.glsl')
      .then(resp => resp.text());

    const vert = await fetch('assets/shaders/simple_vertex.glsl')
      .then(resp => resp.text());

    this.prog = this.initShaderProgram(this.gl, vert, frag);

    /*************************************************************************/
    this.transform = gl.getUniformLocation(this.prog, 'projection');
    this.model = gl.getUniformLocation(this.prog, 'model');
    this.aPos = gl.getAttribLocation(this.prog, 'aPos');
    this.objectColor = gl.getUniformLocation(this.prog, 'objectColor');
    this.lightColor = gl.getUniformLocation(this.prog, 'lightColor');
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
    gl.canvas.height = gl.canvas.clientHeight;
    gl.canvas.width = gl.canvas.clientWidth;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /**************************************************************************/
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(this.transform, false, this.camera.projMtx());



    this.objects.forEach(o => {
      gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(this.aPos);

      gl.uniformMatrix4fv(this.model, false, m4.translation(o.pos[0], o.pos[1], o.pos[2]));
      gl.uniform3fv(this.objectColor, [.5, .5, .5]);
      gl.uniform3fv(this.lightColor, [1, 1, 1])

      o.draw(gl)
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
