function initControls() {
  console.log('Init controls...');
  window.addEventListener('keypress', onKeyPress);
}

function onKeyPress(e) {
  switch (e.code) {
    case 'KeyW':
      break;
    case 'KeyS':
      break;
    case 'KeyA':
      break;
    case 'KeyD':
      break;
    case 'KeyQ':
      break;
    case 'KeyE':
      break;
  }
}

// async function loadShader(path) {
//   var text = await fetch(path).then(resp => resp.text());
//   return text;
// }

async function main() {
  initControls();

  const obj1 = await objLoader('/assets/cube.obj')
  const obj2 = await objLoader('/assets/teapot.obj')

  const renderer = new Renderer();
  await renderer.init();
  renderer.addMesh(obj1);
  renderer.addMesh(obj2);
  obj2.pos = [7, 4, 4]

  let time = Date.now();

  const loop = () => {
    const now = Date.now();
    renderer.drawScene(now - this.time);
    this.time = now;

    requestAnimationFrame(loop);
  }

  loop();

  // var s = await loadShader('src/shaders/simple_fragment.glsl')
}

main();
