class Grid {
  init(gl, renderer) {
    this.renderer = renderer;

    const vs = `#version 300 es
    layout (location = 0) in vec3 aPos;
    uniform mat4 model;
    uniform mat4 projection;

    void main(void) {
      gl_Position = projection * model * vec4(aPos, 1.0);
    }`

    const fs = `#version 300 es
      precision mediump float;
      uniform vec4 lineColor;
      out vec4 FragColor;

      void main() {
        FragColor = vec4(lineColor.xyz, .01);
      }
    `;

    this.prog = renderer.initShaderProgram(gl, vs, fs);
    this.projection = gl.getUniformLocation(this.prog, 'projection');
    this.model = gl.getUniformLocation(this.prog, 'model');
    this.lineColor = gl.getUniformLocation(this.prog, 'lineColor');

    const size = 10;
    this.cells = 20;
    const vertexData = [
      -size, 0, 0,
      size, 0, 0,

      0, -size, 0,
      0, size, 0,

      0, 0, -size,
      0, 0, size,

      -size, 0, -size,
      -size, 0, size,

      -size, 0, size,
      size, 0, size,

      size, 0, size,
      size, 0, -size,

      size, 0, -size,
      -size, 0, -size
    ];

    const vb = this.vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  }

  draw(gl) {
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(this.model, false, m4.create());
    gl.uniformMatrix4fv(this.projection, false, this.renderer.camera.projMtx());
    gl.uniform4fv(this.lineColor, [1, 0, 0, 1]);

    gl.enableVertexAttribArray(0);

    const offset = 12;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, 2);

    gl.uniform4fv(this.lineColor, [0, 1, 0, 1]);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 12 * 2);
    gl.drawArrays(gl.LINES, 0, 2);

    gl.uniform4fv(this.lineColor, [0, 0, 1, 1]);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 12 * 4);
    gl.drawArrays(gl.LINES, 0, 2);

    gl.uniform4fv(this.lineColor, [.001, .001, .001, .1]);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 12 * 6);
    gl.drawArrays(gl.LINES, 0, 8);
  }
}
