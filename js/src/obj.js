function parse(gl, program, text) {
  const verticies = [];
  const faces = [];

  text.split('\n').forEach((line, i) => {
    var tokens = line.split(' ');

    switch (tokens[0]) {
      case 'v': // vertex
        // verticies[verticies.length] = {x: tokens[1], y: tokens[2], z: tokens[3]};
        verticies.push(tokens[1], tokens[2], tokens[3]);
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

  const vertextBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

  var indecies = [];
  for (var f of faces) {
    indecies = indecies.concat(f.v);
  }

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);

  return {
    draw: function() {
      const vertexHandler = gl.getAttribLocation(program, 'aVertexPosition');
      gl.vertexAttribPointer(vertexHandler, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexHandler);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.useProgram(program);
      gl.drawElements(gl.TRIANGLES, 2000, gl.UNSIGNED_SHORT, 0);
    }
  };
}

function objLoader(gl, program, path) {
  console.info('Load obj', path, program);

  return fetch(path)
  .then(res => res.text())
  .then(text => parse(gl, program, text));

  // return new Promise((resolve, reject) => {
    // var file = new XMLHttpRequest();
    // file.open('GET', path, true);
    // file.send(null)
    // file.onreadystatechange = () => {
    //   console.log('1');
    //   if (file.readyState === 4 && file.status === 200) {
    //     // resolve(file.responseText);
    //   } else {
    //     console.error(file.status);
        // reject(file.status);
      // }
    // }
  // });
}

module.exports = {
  load: objLoader
}
