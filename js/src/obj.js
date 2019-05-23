function parse(text) {
  const vertices = [];
  const faces = [];

  text.split('\n').forEach((line, i) => {
    var tokens = line.split(/\s+/);

    switch (tokens[0]) {
      case 'v': // vertex
        vertices.push([parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3])]);
        break;
      case 'vn': // normarl
        break;
      case 'f': // face (vertex/[texute]/normal)
        const f = [];
        for (var i = 1; i < tokens.length; i++) {
          const face = tokens[i].split('/');
          f[f.length] = {v: parseInt(face[0]), t: parseInt(face[1]), n: parseInt(face[2])};
        }
        faces[faces.length] = f;
        break;
      case 'vt': // vertex texture
        break;
      default:
    }
  });

  var indecies = [];
  for (const f of faces) {
    for (const v of f) {
      indecies.push(v.v);
    }
  }

  return {vertices, faces};
  // return {gl, program, vertices, indecies};
}

// function createBuffers({gl, program, vertices, indecies}) {
//   const vertexCount = vertices.length / 3;
//   const aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
//   const aMatrix = gl.getUniformLocation(program, "uMatrix");
//
//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//   const indexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);
//
//   return {
//     draw: function(matrix) {
//       gl.useProgram(program);
//       gl.uniformMatrix4fv(aMatrix, false, matrix);
//
//       gl.enableVertexAttribArray(aVertexPosition);
//       gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//       gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
//
//       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
//       gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
//     }
//   }
// }

function createMesh(data) {
  const triangles = data.faces.map(f => {
    const v1 = data.vertices[f[0].v - 1]
    const v2 = data.vertices[f[1].v - 1]
    const v3 = data.vertices[f[2].v - 1]

    return [
      v1[0], v1[1], v1[2],
      v2[0], v2[1], v2[2],
      v3[0], v3[1], v3[2]
    ];
  })

  // const triangles = [
  //   [-1, -1, 0.0,
  //   1, -1, 0.0,
  //   0.0, 1, 0.0 ]
  // ]

  return new Mesh(triangles);
}

function objLoader(path) {
  console.info('Load obj', path);

  // const program = initShaderProgram(gl, vs, fs);

  return fetch(path)
  .then(res => res.text())
  .then(text => parse(text))
  .then(createMesh)
}
