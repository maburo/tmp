// http://antongerdelan.net/opengl/raycasting.html

const geom = {
  ray_plane(ray, plane) {
    console.log(ray, plane);
    const denom = v3.dot(plane.normal, ray.dir);
    if (denom > EPSILON) {
      const t = v3.dot(v3.sub(plane.center, ray.origin), plane.normal) / denom;
      if (t >= 0) return true
    }

    return false;
  }
}
