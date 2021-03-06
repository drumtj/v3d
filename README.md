# v3d

[![npm version](https://img.shields.io/npm/v/@drumtj/v3d.svg?style=flat)](https://www.npmjs.com/package/@drumtj/v3d)
[![license](https://img.shields.io/npm/l/@drumtj/v3d.svg)](#)

make a simple 3d view (CSS3D based using threejs)


## Installing

Using npm:

```bash
$ npm install @drumtj/v3d
```

Using cdn:
```html
<script src="https://unpkg.com/@drumtj/v3d@1.0.29/dist/v3d.js"></script>
```

CommonJS
```js
import V3D from '@drumtj/v3d';
```
```js
const V3D = require('@drumtj/v3d');
```

## How To

```js
// init full viewport size
var v3d = new V3D(".container");
```

```js
// init full viewport size
var container = document.querySelector(".container");
var v3d = new V3D(container);
```

```js
// init with custom viewport size
var v3d = new V3D(".container", {
  viewport: {
    width: 800,
    height: 600
  }
});
```

```js
// init with camera option,  // default camera z position is 1000
var v3d = new V3D(".container", {
  camera: {
    position: {
      z: 1500
    }
  }
})
```

```js
// also you can set camera rotation when init. rotation unit is degree.
var v3d = new V3D(".container", {
  camera: {    
    position: {
      z: 1500
    },
    rotation: {
      z: -15
    }
  }
})
```

```js
// you can get camera object from instance of V3D
var v3d = new V3D(".container");
v3d.camera.position.z = 1500;
v3d.camera.rotation.z = V3D.math.degToRad(-10);
```

```js
// set onUpdate
var v3d = new V3D(".container", {
  onUpdate: function(time){
    if(v3d) v3d.root.rotation.y = Math.cos(time/1000);
  }
});
v3d.startAnimate();
```

```js
// set onUpdate
var v3d = new V3D(".container");
v3d.onUpdate = function(time){
  if(v3d) v3d.root.rotation.y = Math.cos(time/1000);
}
v3d.startAnimate();
```

```js
// add element
let img = new Image();
img.src = "https://lh3.googleusercontent.com/proxy/8HGxCTGmkoShDUA0NhfJebwJ9xuHxlWV1Qg1cTNemgAoVHC5ph6Zua7F4aoCZts9aWoWE9m4N3kmq4YoykXhVSDv0Eo61qYzXf1Rv91TEkDtcA";
v3d.add(img);
v3d.render();
```

```js
// add element
let target = document.getElementById("target");
v3d.add(target);
v3d.render();
```

```js
// add element by css selector
v3d.add("#target");
v3d.render();
```

```js
// add element by html string
v3d.add('<div class="box">');
v3d.render();
```

```js
// add element with attribute
v3d.add("#target", {
  rotation: {
    x: -10
  },
  position: {
    x: 100
  },
  // css style
  style: {
    width: "100px"
  }
});
v3d.render();
```

```js
// get 3d Object for control
let obj = v3d.add("#target");
obj.rotation.x = V3D.math.degToRad(-10);
v3d.render();
```

```js
// set object name to find
v3d.add("#target", {name:"test"});
v3d.render();
```

```js
// set object name to find
let obj = v3d.add("#target");
obj.name = "test";
```

```js
var object1 = v3d.scene.getObjectByName("test");

//to recursively search the scene graph
var object2 = v3d.scene.getObjectByName("objectName", true);

var object3 = v3d.scene.getObjectById(4, true);

var object4 = v3d.getObjectByElement(html_element);
```

```js
// tween
// In order to tween, startAnimate must be executed.
v3d.startAnimate();
var box1 = v3d.add('<div class="box">');
var tweens = v3d.tween(v3d.camera, box1);
```

```js
//  kill tween
v3d.killTween(tweens);
```

```js
// tween with option
v3d.startAnimate();
var box1 = v3d.add('<div class="box">');
v3d.tween(v3d.camera, box1, 2000, {
  lookAtDistance: 400
  //offsetPosition: THREE.Vector3|{x?:number;y?:number;z?:number};
  //withPosition?: boolean;
  //withRotation?: boolean;
  //delay?: number;
  //rotationDelay?: number;
  //onComplete?: ()=>void;
  //easing?: any;
});
```

```js
$(".box").on("click", function(event){
  v3d.tween(v3d.camera, event.target, 2000, {
    lookAtDistance: 400
  })
})
```


```js

//////// static method////////
// three js ref
V3D.THREE

// @tweenjs/tween.js ref
V3D.TWEEN

// math functions
V3D.math.getDeg(x1:number, y1:number, x2:number, y2:number):number
V3D.math.getRad(x1:number, y1:number, x2:number, y2:number):number
V3D.math.getCoord(angle:number, distance:number):{x:number, y:number}
V3D.math.degToRad(degree:number):number
V3D.math.radToDeg(radian:number):number
V3D.math.distance(x1:number, y1:number, x2:number, y2:number):number
V3D.math.normalRad(rad:number):number
V3D.math.randInt(low:number, high:number):number
V3D.math.randFloat(low:number, high:number):number
V3D.math.getDestinationRad(fromRad:number, toRad:number):number;


//////// member property////////

// https://threejs.org/docs/#api/en/scenes/Scene
v3d.scene

// https://threejs.org/docs/#api/en/cameras/Camera
v3d.camera

// https://threejs.org/docs/#examples/en/renderers/CSS3DRenderer
v3d.renderer

// html element.  by first parameter of constructor
v3d.container

// Top-level object. Added as a child of v3d.root when v3d.add()
v3d.root

// viewport element.  v3d.renderer.domElement;
v3d.viewport

// update callback
v3d.onUpdate:(time:number)=>void;




//////// member method////////
render() // once
startAnimate() // render loop
stopAnimate()
add(selector:string|HTMLElement, option?:AddOption):CSS3DObject
interface AddOption {
  rotation?:{x?:number;y?:number;z?:number}|THREE.Vector3|THREE.Euler;
  position?:{x?:number;y?:number;z?:number}|THREE.Vector3;
  name?:string;
  style?:any;
  parent?:THREE.Object3D|CSS3DObject;
}
checkInCamera(object:CSS3DObject|CSS3DObject[]): boolean|boolean[]
getMouseVector(event:MouseEvent, refVector?:THREE.Vector3):THREE.Vector3
cloneEmptyObject(object:THREE.Object3D|CSS3DObject):THREE.Object3D
getObjectByElement(element:HTMLElement):CSS3DObject

tween(
  object:HTMLElement|CSS3DObject|THREE.Object3D, target:HTMLElement|CSS3DObject|THREE.Object3D|{position?:{x?:number;y?:number;z?:number},rotation?:{x?:number;y?:number;z?:number},opacity?:number},
  duration:number,
  option?:TweenOption
):TWEEN.Tween[]

killTween(tweens:TWEEN.Tween[])
interface TweenOption {
  offsetPosition?: THREE.Vector3|{x?:number;y?:number;z?:number};
  lookAtDistance?: number;
  withPosition?: boolean;
  withRotation?: boolean;
  delay?: number;
  rotationDelay?: number;
  onComplete?: ()=>void;
  easing?: any;
}

addUpdateCallback(callback:(time:number)=>void):void
removeUpdateCallback(callbackRef:Function)
clearUpdateCallback()
```

```js
// full example-1
var v3d = new V3D(".container");
v3d.add("#target", {
  rotation: {
    x: -10,
    y: -10
  }
});
v3d.render();
```

```js
// full example-2
var v3d = new V3D(".container", {
  camera: {
    rotation: {
      x: -30
    },
    position: {
      y: 500
    }
  }
});
v3d.add("#target", {
  position: {
    z: 200
  }
});
v3d.render();
```

```js
// full example-3
var container = document.querySelector(".container");
var v3d = new V3D(container);
v3d.camera.rotation.z = V3D.math.degToRad(-10);
v3d.add("#target").position.z = 450;

var div = document.createElement("div");
v3d.add(div);

v3d.onUpdate = function(time) {
  if(v3d) v3d.root.rotation.y = Math.cos(time / 1000);
}
v3d.startAnimate();
```

```js
// full example-4
var v3d = new V3D(".container");
var box = v3d.add('<div class="box">');
box.element.contentEditable = true;
box.element.textContent = "hi~";

document.addEventListener("mousemove", function(event){
  event.preventDefault();
  // var x = (event.clientX / window.innerWidth) * 2 - 1;
  // var y = -(event.clientY / window.innerHeight) * 2 + 1;
  // box.lookAt(x, y, 0.5);

  box.lookAt(v3d.getMouseVector(event));
  v3d.render();
})
```

```js
// full example-5
var THREE = V3D.THREE;
var v3d = new V3D(".container");
var boxHtml = '<div class="box">';
var boxCount = 10;
var distance = 1400;
var angle = 120;

var angleUnit = -angle/boxCount;
var startAngle = (180 - angle) / 2;

//camera rotate speed
var mouseDistance = 1.5;
var mouse = new THREE.Vector3(0, 0, v3d.camera.position.z - mouseDistance);

for(var i=0; i<boxCount; i++){
  var box = v3d.add(boxHtml);
  var coord = V3D.math.getCoord(i*angleUnit-startAngle, distance);
  box.position.x = v3d.camera.position.x + coord.x;
  box.position.z = v3d.camera.position.z + coord.y;
  box.lookAt(v3d.camera.position);
}

document.addEventListener("mousemove", function(event){
  event.preventDefault();
  v3d.getMouseVector(event, mouse);
  mouse.y *= 0.2;
  v3d.camera.lookAt(mouse);
  v3d.render();
})
```

## examples
- [basic](https://drumtj.github.io/v3d/test1.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test1.html))
- [multi viewport](https://drumtj.github.io/v3d/test.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test.html))
- [mouse pointer lookup](https://drumtj.github.io/v3d/test2.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test2.html))
- [dynamic element insertion](https://drumtj.github.io/v3d/test3.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test3.html))
- [use CameraMovePlugin](https://drumtj.github.io/v3d/test4.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test4.html))
- [make a transform model](https://drumtj.github.io/v3d/test5.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test5.html))
- [use SliderPlugin](https://drumtj.github.io/v3d/test6.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test6.html))
- [use fpsControlPlugin](https://drumtj.github.io/v3d/test7.html) ([source](https://github.com/drumtj/v3d/blob/master/examples/test7.html))

## License

MIT
