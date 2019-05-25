#version 300 es
// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
precision mediump float;
//
// uniform vec3 objectColor;
// uniform vec3 lightColor;
// uniform vec3 lightPos;
//
// in vec3 Normal;
//
// out vec4 fragColor;
//
// void main() {
//   float ambientStrength = 0.25;
//   vec3 ambient = ambientStrength * lightColor;
//   vec3 result = ambient * objectColor;
//
//   // gl_FragColor = vec4(1.0, 1, 1, 1);
//   fragColor = vec4(result, 1.0);
// }
out vec4 FragColor;

in vec3 Normal;
in vec3 FragPos;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 objectColor;

void main()
{
    // ambient
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    // diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    vec3 result = (ambient + diffuse) * objectColor;
    FragColor = vec4(result, 1.0);
}
