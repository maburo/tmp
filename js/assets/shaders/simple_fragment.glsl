#version 300 es
// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
precision mediump float;

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
    // FragColor = vec4(0.5, 0.5, 0.5, 1.0);
}

// precision mediump float;
// uniform vec4 lineColor;
// out vec4 FragColor;
//
// void main() {
//   FragColor = vec4(lineColor.xyz, .01);
// }
