// uniform mat4 u_Transform;
// uniform vec4 u_Color;
//
// attribute vec3 a_Vertex;
//
// void main() {
//   gl_Position = u_Transform * vec4(a_Vertex, 1.0);
// }

attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
