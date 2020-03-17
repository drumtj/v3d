import V3D from "./index";
import CameraMovePlugin from "./plugins/CameraMovePlugin";

test();

function test(){
  var v3d = new V3D(".container");
  var box = v3d.add('<div class="box">');
  var mouse;
  box.element.contentEditable = true;
  box.element.textContent = "hi~";

  document.addEventListener("mousemove", function(event){
    event.preventDefault();
    // var x = (event.clientX / window.innerWidth) * 2 - 1;
    // var y = -(event.clientY / window.innerHeight) * 2 + 1;
    // box.lookAt(x, y, 0.5);

    mouse = v3d.getMouseVector(event, mouse);
    box.lookAt(mouse);

    v3d.render();
  })
}

function test_cameraMovePlugin(){
  var THREE = V3D.THREE;
  var v3d = new V3D(".container");
  window['v3d'] = v3d;
  var boxHtml = '<div class="box" style="text-align:center;"><h1 style="pointer-events:none;">click me</h1></div>';
  var boxCount = 10;
  var distance = 1400;
  var angle = 120;
  var tweenDuration = 1000;
  var lookAtDistance = 400;

  var angleUnit = -angle/boxCount;
  var startAngle = (180 - angle) / 2;

  //camera rotate speed
  var mouseDistance = 1.5;
  var mouse = new THREE.Vector3(0, 0, v3d.camera.position.z - mouseDistance);

  // window['v3d'] = v3d;

  for(var i=0; i<boxCount; i++){
    var box = v3d.add(boxHtml);
    var coord = V3D.math.getCoord(i*angleUnit-startAngle, distance);
    box.position.x = v3d.camera.position.x + coord.x;
    box.position.z = v3d.camera.position.z + coord.y;
    box.lookAt(v3d.camera.position);
  }
  // v3d.render();
  v3d.startAnimate();



  var cameraMovePlugin = new CameraMovePlugin(v3d, {
    tweenDuration: tweenDuration,
    lookAtDistance: lookAtDistance
  })

  var homeBtn = document.createElement("button");
  homeBtn.className = "home";
  homeBtn.textContent = "HOME";
  homeBtn.style.cssText = "position:absolute;left:50%;bottom:10px";
  document.body.appendChild(homeBtn);

  document.addEventListener("click", function(event:any){
    if(event.target.classList.contains("box")){
      cameraMovePlugin.moveTarget(event.target);
    }else if(event.target.classList.contains("home")){
      cameraMovePlugin.moveHome();
    }
  })

  document.addEventListener("mousemove", function(event){
    event.preventDefault();
    if(cameraMovePlugin.state == "home"){
      v3d.getMouseVector(event, mouse);
      mouse.y = 0;
      v3d.camera.lookAt(mouse);
    }
  })
}
