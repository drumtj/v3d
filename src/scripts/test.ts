import V3D from "./index";
import CameraMovePlugin from "./plugins/CameraMovePlugin";
import SliderPlugin from "./plugins/SliderPlugin";

test();

function test(){
  var v3d = new V3D(".container");
  var boxCount = 10;
  var boxs = [];

  for(var i=0; i<boxCount; i++){
    boxs.push(v3d.add('<div class="box" data-index="'+i+'">'));
  }

  var slider = new SliderPlugin(v3d, boxs, {
    duration: 600
  })

  var btnContainer = document.createElement("div");
  btnContainer.style.cssText = "position:absolute;left:50%;bottom:10px";
  document.body.appendChild(btnContainer);

  for(var i=0; i<boxs.length; i++){
    boxs[i].element.onclick = function(){
      slider.select(this.dataset.index);
    }
    createBtn(i, btnContainer).onclick = (function(){
      var j=i;
      return function(){
        slider.select(j)
      }
    }())
  }

  v3d.startAnimate();
  slider.select(0);


  function createBtn(name, parent?){
    var btn = document.createElement("button");
    (parent||document.body).appendChild(btn);
    btn.textContent = name;
    return btn;
  }
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
