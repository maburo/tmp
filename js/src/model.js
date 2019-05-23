class Model {
  createBufferObjects(gl, data) {

  }


  render(gl, transform) {
    gl.uniformMatrix4fv(uTransformLocation, false, transform);
    gl.uniform4fv(uColorLocation, modelColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVertexBufferId);
    gl.vertexAttribPointer(aVertexLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexLocation);

    gl.drawArrays(gl.TRIANGLES, 0, numTrianbles * 3);

    gl.uniform4fv(uColorLocation, edgeColor);

    for (var i = 0, start = 0; i < numTrianbles.length; i++, start += 3) {
      gl.drawArrays(gl.LINE_LOOP, start, 3);
    }
  }
}
