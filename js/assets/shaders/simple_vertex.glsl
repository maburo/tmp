#version 300 es
in vec3 aPos;
in vec3 aNormal;

uniform mat4 projection;
uniform mat4 model;

out vec3 Normal;

void main() {
    gl_Position = projection * model * vec4(aPos, 1.0);
    Normal = aNormal;
}
