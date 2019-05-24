class Mesh {
  constructor(triangles) {
    this.triangles = triangles;
    this.pos = [0, 0, 0];
  }

  init(gl) {
    const vb = this.vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    const vertices = [];

    this.triangles.forEach(t => {
      vertices.push(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
    });

    this.elementCount = vertices.length / 3;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.disable(gl.CULL_FACE)
    gl.cullFace(gl.FRONT_AND_BACK)
  }

  draw(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
    gl.drawArrays(gl.TRIANGLES, 0, this.elementCount);
  }
}
