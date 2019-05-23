//https://learnopengl.com/Getting-started/Camera

class Renderer {
  init() {
    console.log('Init GL...');

    this.objects = [];

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    this.gl = canvas.getContext('webgl');
    this.gl.clearColor(0, 0, 0, 1);

    this.cam = {
      pos: [0, 0, 4],
      target: [0, 0, 0]
    };

    const mousepos = [0, 0];
    const mousesense = .04;
    window.addEventListener('mousemove', e => {
      if (e.buttons && e.button === 0) {
        this.cam.target[0] += (e.x - mousepos[0]) * mousesense;
        this.cam.target[1] += (e.y - mousepos[1]) * mousesense;
      }
      mousepos[0] = e.x;
      mousepos[1] = e.y;
    });

    const frag = `
      void main() {
        gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0);
      }`;

    const vert = `
      attribute vec3 aPos;
      uniform mat4 transform;
      void main() {
          gl_Position = transform * vec4(aPos, 1.0);
      }`;

    this.prog = this.initShaderProgram(this.gl, vert, frag);
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

    const fov = 90 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    const lookAtMtx = m4.lookAt(this.cam.pos, this.cam.target, [0, 1, 0]);

    var vertices = [
      -.5, -.25, 0.0,
      .5, -.25, 0.0,
      0.0, .5, 0.0
    ];

    const mtx = m4.translation(0, 0, -3);
    const persp = m4.perspective(fov, aspect, 0.1, 100);

    /**************************************************************************/

    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.useProgram(this.prog);

    const transform = gl.getUniformLocation(this.prog, 'transform');
    // console.log('m', m4.mul(persp, mtx));
    // console.log('mm', m4.mmul(mtx, persp));

    const m = m4.mul(persp, lookAtMtx);

    gl.uniformMatrix4fv(transform, false, m);
    const aPos = gl.getAttribLocation(this.prog, 'aPos');
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPos);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.objects.forEach(o => o.draw(gl));
    /**************************************************************************/



    // this.draw();
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
