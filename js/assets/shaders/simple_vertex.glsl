#version 300 es
precision mediump float;
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
// precision mediump float;
// layout (location = 0) in vec3 aPos;
// uniform mat4 model;
// uniform mat4 projection;
//
// void main(void) {
//   gl_Position = projection * model * vec4(aPos, 1.0);
// }
