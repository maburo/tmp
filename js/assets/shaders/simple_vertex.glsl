#version 300 es
// in vec3 aPos;
// in vec3 aNorm;
//
// uniform mat4 projection;
// uniform mat4 model;
//
// out vec3 Normal;
//
// void main() {
//   Normal = normalize(aNorm);
//   gl_Position = projection * model * vec4(aPos, 1.0);
// }
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 FragPos;
out vec3 Normal;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    FragPos = vec3(model * vec4(aPos, 1.0));
    Normal = aNormal;

    gl_Position = projection * vec4(FragPos, 1.0);
}
