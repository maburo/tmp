#version 300 es
// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
precision mediump float;

in vec3 Normal;
uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;

out vec4 fragColor;

void main() {
  float ambientStrength = 0.25;
  vec3 ambient = ambientStrength * lightColor;
  vec3 result = ambient * objectColor;

  // gl_FragColor = vec4(1.0, 1, 1, 1);
  fragColor = vec4(result, 1.0);
}
