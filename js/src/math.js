// https://github.com/toji/gl-matrix/blob/master/dist/gl-matrix.js
// https://github.com/toji/gl-matrix/blob/master/src/mat4.js
var __degree = Math.PI / 180;

function toRadian(a) {
  return a * __degree;
}

const v3 = {
  sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },

  add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  },

  mul(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
  },

  normilize(vec) {
    const len = v3.mag(vec)
    return [vec[0] / len, vec[1] / len, vec[2] / len];
  },

  mag(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
  },

  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[0] * b[2] - a[2] * b[0],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
}

const m4 = {
  // lookAt(pos, target, u) {
  //   const z = v3.normilize(v3.sub(pos, target));
  //   const x = v3.normilize(v3.cross(u, z));
  //   const y = v3.cross(x, z);
  //
  //   const m1 = [
  //     x[0], y[0], z[0], 0,
  //     y[1], y[1], z[1], 0,
  //     x[2], y[2], z[2], 0,
  //     0, 0, 0, 1
  //   ];
  //   const m2 = [
  //     1, 0, 0, -pos[0],
  //     0, 1, 0, -pos[1],
  //     0, 0, 1, -pos[2],
  //     0, 0, 0, 1
  //   ];
  //
  //   return m4.mul(m1, m2);
  // },
  lookAt: function(eye, center, up) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    // if (Math.abs(eyex - centerx) < glMatrix.EPSILON &&
    //     Math.abs(eyey - centery) < glMatrix.EPSILON &&
    //     Math.abs(eyez - centerz) < glMatrix.EPSILON) {
    //   return identity(out);
    // }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    return [
      x0, y0, z0, 0,
      x1, y1, z1, 0,
      x2, y2, z2, 0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    ];
  },

  create: function() {
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1];
  },

  frustum: function() {

  },

  perspective: function(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  },

  projection: function(width, height, depth) {
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  mmul: function(... args) {
    var m = args[0];
    for (var i = 1; i < args.length - 1; i++) {
      m = m4.mul(m, args[i]);
    }

    return m;
  },

  mul: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  }
}
