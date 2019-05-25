// https://learnopengl.com/Getting-started/Camera

class Camera {
  constructor(fov, aspect) {
    this.fov = fov * Math.PI / 180;
    this.aspect = aspect;
    this.pos = [2, 5, 10];
    this.dir = [0, 0, -1];
    this.up = [0, 1, 0];
    this.rot = [0, 0, 0];
    this.rotate(270, -20, 0)
  }

  move(x, y, z) {
    if (z > 0) {
      this.pos = v3.add(this.pos, this.dir);
    } else if (z < 0) {
      this.pos = v3.sub(this.pos, this.dir);
    }

    if (x > 0) {
      const d = v3.normilize(v3.cross(this.dir, this.up));
      this.pos = v3.add(this.pos, d);
    } else if (x < 0) {
      const d = v3.normilize(v3.cross(this.dir, this.up));
      this.pos = v3.sub(this.pos, d);
    }
  }

  setPosition(x, y, z) {
    this.pos = [x, y, z];
  }

  rotate(x, y, z) {
    this.rot[0] += x;
    this.rot[1] += y;
    this.rot[2] += z;

    const rx = toRadian(this.rot[0]);
    const ry = toRadian(this.rot[1]);
    const rz = toRadian(this.rot[2]);

    const cosY = Math.cos(ry);
    const vx = cosY * Math.cos(rx);
    const vy = Math.sin(ry);
    const vz = cosY * Math.sin(rx);
    this.dir = v3.normilize([vx, vy, vz]);
  }

  setRotation(x, y, z) {
    this.rot = [x, y, z];
  }

  projMtx() {
    const lookAtMtx = m4.lookAt(this.pos, v3.add(this.pos, this.dir), this.up);
    const perspMtx = m4.perspective(this.fov, this.aspect, 0.1, 100);

    return m4.mul(perspMtx, lookAtMtx);
  }
}
