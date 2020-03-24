import V3D from "./index";
import CameraMovePlugin from "./plugins/CameraMovePlugin";
import SliderPlugin from "./plugins/SliderPlugin";
import FpsControlPlugin from "./plugins/FpsControlPlugin";

import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls.js';

test_fpsCameraPlugin();

function test_fpsCameraPlugin(){
  var v3d = new V3D(".container", {
    camera:{position:{y:550}}
  });

  window['v3d'] = v3d;
  var wallHeight = 1500;
  var wallWidth = 7000;
  var bottomHeight = 7000;
  var bottomWidth = 7000;

  var rightWall = v3d.add('.right-wall', {
    rotation: {y: -90},
    position: {x: bottomWidth/2, y:wallHeight/2},
    style: {
      width: wallWidth + "px",
      height: wallHeight + "px"
    }
  })

  var leftWall = v3d.add('.left-wall', {
    rotation: {y: 90},
    position: {x: -bottomWidth/2, y:wallHeight/2},
    style: {
      width: wallWidth + "px",
      height: wallHeight + "px"
    }
  })

  var frontWall = v3d.add('.front-wall', {
    position: {y:wallHeight/2, z:-wallWidth/2},
    style: {
      width: bottomWidth + "px",
      height: wallHeight + "px"
    }
  })

  var backWall = v3d.add('.back-wall', {
    position: {y:wallHeight/2, z:wallWidth/2},
    style: {
      width: bottomWidth + "px",
      height: wallHeight + "px"
    }
  })

  var top = v3d.add('.top', {
    rotation: {x: -90},
    position: {y: wallHeight},
    style: {
      width: bottomWidth + "px",
      height: bottomHeight + "px"
    }
  })

  var bottom = v3d.add('.bottom', {
    rotation: {x: -90},
    style: {
      width: bottomWidth + "px",
      height: bottomHeight + "px"
    }
  })

  function lockWall(){
    leftWall.element.style.pointerEvents = "none";
    rightWall.element.style.pointerEvents = "none";
    frontWall.element.style.pointerEvents = "none";
    backWall.element.style.pointerEvents = "none";
  }
  function unlockWall(){
    leftWall.element.style.pointerEvents = "all";
    rightWall.element.style.pointerEvents = "all";
    frontWall.element.style.pointerEvents = "all";
    backWall.element.style.pointerEvents = "all";
  }


  let controls = new FpsControlPlugin(v3d);
  controls.onMouseDown = lockWall;
  controls.onMouseUp = unlockWall;

  v3d.startAnimate();
}

function test_sliderPlugin(){
  var v3d = new V3D(".container");
  var boxCount = 10;
  var boxs = [];

  // var controls:any = new FirstPersonControls( v3d.camera, v3d.renderer.domElement );
  // controls.lookSpeed = 0.2;
  // controls.movementSpeed = 1000;
  // controls.activeLook = false;
  //
  // v3d.onUpdate = function(){
  //   if(controls.mouseDragOn){
  //     if(!controls.activeLook){
  //       controls.activeLook = true;
  //     }
  //   }else{
  //     if(controls.activeLook){
  //       controls.activeLook = false;
  //     }
  //   }
	// 	controls.update( v3d.delta );
  // }

  window['v3d'] = v3d;

  for(var i=0; i<boxCount; i++){
    boxs.push(v3d.add('<div class="box" data-index="'+i+'">'));
  }

  var slider = new SliderPlugin(v3d, boxs, {
    duration: 600,
    // activeSlideOffsetPosition: {z:200}
  })

  var btnContainer = document.createElement("div");
  btnContainer.style.cssText = "position:absolute;left:40%;bottom:10px";
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

  createBtn("camera up", btnContainer).onclick = function(){
    v3d.tween(
      v3d.camera,
      {
        rotation:{x: -20},
        position:{y: 240}
      },
      2000
    )
  }

  createBtn("camera down", btnContainer).onclick = function(){
    v3d.tween(
      v3d.camera,
      {
        rotation:{x: 0},
        position:{y: 0}
      },
      2000
    )
  }

  var typeLabel = document.createElement('label');
  typeLabel.textContent = "slide type:";
  typeLabel.style.marginLeft = "10px";
  btnContainer.appendChild(typeLabel);

  var typeSelectTag = document.createElement('select');
  slider.getTransformNames().forEach(function(name){
    var optionTag = document.createElement('option');
    optionTag.value = name;
    optionTag.textContent = name;
    typeSelectTag.appendChild(optionTag);
  })
  btnContainer.appendChild(typeSelectTag);

  typeSelectTag.onchange = function(){
    slider.changeType(typeSelectTag.value);
  }

  v3d.startAnimate();
  // slider.setScale(0.8);
  slider.select(0);


  function createBtn(name, parent){
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
