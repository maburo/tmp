class Pointer {
  constructor(pos = [0, 0, 0], color = [1, 1, 1], size = 1) {
    this.pos = pos;
    this.color = color;
    this.size = size;
  }

  init(gl, renderer) {
    this.renderer = renderer;

    const vs = `#version 300 es
    precision mediump float;
    layout (location = 0) in vec3 aPos;
    uniform mat4 model;
    uniform mat4 projection;
    uniform float size;

    void main(void) {
      gl_Position = projection * model * vec4(aPos, 1.0);
      gl_PointSize = size;
    }`

    const fs = `#version 300 es
      precision mediump float;
      uniform vec3 color;
      out vec4 FragColor;

      void main() {
        FragColor = vec4(color.xyz, .01);
      }
    `;

    this.prog = renderer.initShaderProgram(vs, fs);
    this.projection = gl.getUniformLocation(this.prog, 'projection');
    this.model = gl.getUniformLocation(this.prog, 'model');
    this.aColor = gl.getUniformLocation(this.prog, 'color');
    this.aSize = gl.getUniformLocation(this.prog, 'size');

    const vb = this.vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);
  }

  draw(gl) {
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(this.model, false, m4.create());
    gl.uniformMatrix4fv(this.projection, false, this.renderer.camera.getProjMtx());
    gl.uniform3fv(this.aColor, this.color);
    gl.uniform1f(this.aSize, this.size);

    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.GL_POINTS, 0, 1);
  }
}
