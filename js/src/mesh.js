class Mesh {
  constructor(faces) {
    this.faces = faces;
    this.pos = [0, 0, 0];
  }

  async init(gl, renderer) {
    this.renderer = renderer;

    const frag = await fetch('assets/shaders/simple_fragment.glsl')
      .then(resp => resp.text());
    const vert = await fetch('assets/shaders/simple_vertex.glsl')
      .then(resp => resp.text());

    this.prog = renderer.createShaderProgram('mesh_shader', vert, frag);

    /*************************************************************************/
    this.projection = gl.getUniformLocation(this.prog, 'projection');
    this.model = gl.getUniformLocation(this.prog, 'model');
    this.objectColor = gl.getUniformLocation(this.prog, 'objectColor');
    this.lightColor = gl.getUniformLocation(this.prog, 'lightColor');
    this.lightPos = gl.getUniformLocation(this.prog, 'lightPos');
    /*************************************************************************/

    const vertexData = [];
    const normalData = [];

    this.faces.forEach(f => {
      const v1 = f.v[0];
      const v2 = f.v[1];
      const v3 = f.v[2];
      const n1 = f.n[0];
      const n2 = f.n[1];
      const n3 = f.n[2];

      vertexData.push(
        v1[0], v1[1], v1[2],
        v2[0], v2[1], v2[2],
        v3[0], v3[1], v3[2]);

      normalData.push(
        n1[0], n1[1], n1[2],
        n2[0], n2[1], n2[2],
        n3[0], n3[1], n3[2]);
    });

    this.vertexCount = this.faces.length * 3;

    const vb = this.vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const nb = this.nb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
  }

  draw(gl) {
    gl.useProgram(this.prog);
    gl.uniformMatrix4fv(this.projection, false, this.renderer.camera.getProjMtx());
    gl.uniformMatrix4fv(this.model, false, m4.translation(this.pos[0], this.pos[1], this.pos[2]));

    gl.uniform3fv(this.objectColor, [.5, .5, .5]);
    gl.uniform3fv(this.lightColor, [1, 1, 1 ])
    gl.uniform3fv(this.lightPos, [0, 14, 10]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.nb);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
  }
}
