function initControls() {
  console.log('Init controls...');
}

async function main() {
  initControls();

  const obj1 = await objLoader('/assets/cube.obj')
  const obj2 = await objLoader('/assets/teapot.obj')

  const camera = new Camera(45, 1);
  camera.pos = [2, 10, 20];
  camera.rotate(280, -20, 0);

  const renderer = new Renderer(camera);

  var mousedown = false;
  const mousePosBeforeClick = [0, 0];
  const movespeed = .5;
  const mousepos = [0, 0];
  const mousesense = .07;

  window.addEventListener('mousemove', e => {
    if (mousedown) {
      camera.rotate((e.x - mousepos[0]) * mousesense, (e.y - mousepos[1]) * -mousesense, 0);
    }
    mousepos[0] = e.x;
    mousepos[1] = e.y;
  });

  window.addEventListener('mousedown', e => {
    mousedown = true;
    mousePosBeforeClick[0] = e.x
    mousePosBeforeClick[1] = e.y;
  });

  window.addEventListener('mouseup', e => {
    mousedown = false;
    if (mousePosBeforeClick[0] === e.x && mousePosBeforeClick[1] === e.y) {
      renderer.rayPick(e.x, e.y);
    }
  });

  window.addEventListener('keydown', e => {
    switch (e.code) {
      case 'KeyW':
        camera.velocity[2] = 1;
        break;
      case 'KeyS':
        camera.velocity[2] = -1;
        break;
      case 'KeyA':
        camera.velocity[0] = -1;
        break;
      case 'KeyD':
        camera.velocity[0] = 1;
        break;
      case 'KeyQ':
        camera.velocity[1] = 1;
        break;
      case 'KeyE':
        camera.velocity[1] = -1;
        break;
    }
  });

  window.addEventListener('keyup', e => {
    switch (e.code) {
      case 'KeyW':
      case 'KeyS':
        camera.velocity[2] = 0;
        break;
      case 'KeyA':
      case 'KeyD':
        camera.velocity[0] = 0;
        break;
      case 'KeyQ':
      case 'KeyE':
        camera.velocity[1] = 0;
        break;
    }
  });

  await renderer.init();
  await renderer.addMesh(obj1);
  await renderer.addMesh(obj2);
  obj2.pos = [7, 4, 4]

  let time = Date.now();

  const loop = () => {
    const now = Date.now();
    renderer.drawScene((now - this.time) / 1000);
    this.time = now;

    requestAnimationFrame(loop);
  }

  loop();
}

main();

// var i = geom.ray_plane(
//   {
//     dir: v3.normalize([0, 1, 0]),
//     origin: [0, -1, 0]
//   },
//   {
//     normal: v3.normalize([0, 1, 1]),
//     center: [0, 0, 0]
//   }
// );
// console.log(i);
