// https://learnopengl.com/Getting-started/Camera

class Camera {
  constructor(fov, aspect) {
    this.dirty = true;
    this.invProjMtxDirty = true;

    this.fov = fov * Math.PI / 180;
    this.aspect = aspect;
    this.pos = [0, 0, 0];
    this.dir = [0, 0, -1];
    this.up = [0, 1, 0];
    this.rot = [0, 0, 0];

    this.velocity = [0, 0, 0];
    this.movespeed = 5;
  }

  update(delta) {
    const speed = this.movespeed * delta;
    if (this.velocity[0]) {
      const z = v3.mul(v3.normalize(v3.cross(this.dir, this.up)), speed * this.velocity[0]);
      this.pos = v3.add(this.pos, z);
      this.dirty = true;
      this.invProjMtxDirty = true;
    }

    if (this.velocity[1]) {
      this.pos = v3.add(this.pos, v3.mul(this.up, speed * this.velocity[1]));
      this.dirty = true;
      this.invProjMtxDirty = true;
    }

    if (this.velocity[2]) {
      this.pos = v3.add(this.pos, v3.mul(this.dir, speed * this.velocity[2]));
      this.dirty = true;
      this.invProjMtxDirty = true;
    }
  }

  setPosition(x, y, z) {
    this.pos = [x, y, z];
    this.dirty = true;
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
    this.dir = v3.normalize([vx, vy, vz]);
    this.dirty = true;
    this.invProjMtxDirty = true;
  }

  setRotation(x, y, z) {
    this.rot = [x, y, z];
    this.dirty = true;
    this.invProjMtxDirty = true;
  }

  getProjMtx() {
    if (this.dirty) {
      // console.log(this.pos, this.dir, this.up);
      this.viewMtx = m4.lookAt(this.pos, v3.add(this.pos, this.dir), this.up);
      this.perspMtx = m4.perspective(this.fov, this.aspect, 0.1, 100);

      this.projMtx = m4.mul(this.perspMtx, this.viewMtx);
      this.dirty = false;
    }

    return this.projMtx;
  }

  invProjMtx() {
    if (this.invProjMtxDirty) {
      this.invPMtx = m4.inverse(this.projMtx);
      this.invProjMtxDirty = false;
    }

    return this.invPMtx;
  }
}
