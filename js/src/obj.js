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

function parse(gl, program, text) {
  const vertices = [];
  const faces = [];

  text.split('\n').forEach((line, i) => {
    var tokens = line.split(' ');

    switch (tokens[0]) {
      case 'v': // vertex
        vertices.push(tokens[1], tokens[2], tokens[3]);
        break;
      case 'vn': // normarl
        break;
      case 'f': // face (vertex/[texute]/normal)
        const f = [];
        for (var i = 1; i < tokens.length; i++) {
          const face = tokens[i].split('/');
          f[f.length] = {v: face[0], t: face[1], n: face[2]};
        }
        faces[faces.length] = f;

        break;
      case 'vt': // vertex texture
        break;
      default:
    }
  });

  var indecies = [];
  for (var f of faces) {
    indecies = indecies.concat(f.v);
  }

  return {gl, program, vertices, indecies};
}

function createBuffers({gl, program, vertices, indecies}) {
  const vertexCount = vertices.length / 3;
  const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);

  return {
    draw: function() {
      gl.useProgram(program);

      gl.enableVertexAttribArray(aVertexPosition);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
  }
}

function objLoader(gl, vs, fs, path) {
  console.info('Load obj', path);

  const program = initShaderProgram(gl, vs, fs);

  return fetch(path)
  .then(res => res.text())
  .then(text => parse(gl, program, text))
  .then(createBuffers);
}

module.exports = objLoader;
