function loadShader(gl, type, source) {
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

function initShaderProgram(gl, vsSrc, fsSrc) {
  const program = gl.createProgram();
  gl.attachShader(program, loadShader(gl, gl.VERTEX_SHADER, vsSrc));
  gl.attachShader(program, loadShader(gl, gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to init shader', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
  }

  return program;
}

class Mesh {
  constructor(gl, vs, fs, positions, indices) {
    console.log(vs, fs, positions, indices);

    this.gl = gl;
    this.program = initShaderProgram(gl, vs, fs);
    this.aVertexPosition = gl.getAttribLocation(this.program, 'aVertexPosition');

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    if (indices) {
      this.indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
  }

  draw() {
    const gl = this.gl;

    gl.useProgram(this.program);
    gl.enableVertexAttribArray(this.aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    gl.vertexAttribPointer(this.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    if (this.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}

module.exports = Mesh
