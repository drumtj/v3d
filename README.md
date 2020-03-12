# v3d

[![npm version](https://img.shields.io/npm/v/@drumtj/v3d.svg?style=flat)](https://www.npmjs.com/package/@drumtj/v3d)
[![license](https://img.shields.io/npm/l/@drumtj/v3d.svg)](#)

make a simple 3d view


## Installing

Using npm:

```bash
$ npm install @drumtj/v3d
```

Using cdn:
```html
<script src="https://unpkg.com/@drumtj/v3d@1.0.10/dist/v3d.js"></script>
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
```

```js
// set onUpdate
var v3d = new V3D(".container");
v3d.onUpdate = function(time){
  if(v3d) v3d.root.rotation.y = Math.cos(time/1000);
}
```

```js
// add element
let img = new Image();
img.src = "https://lh3.googleusercontent.com/proxy/8HGxCTGmkoShDUA0NhfJebwJ9xuHxlWV1Qg1cTNemgAoVHC5ph6Zua7F4aoCZts9aWoWE9m4N3kmq4YoykXhVSDv0Eo61qYzXf1Rv91TEkDtcA";
v3d.add(img);
```

```js
// add element
let target = document.getElementById("target");
v3d.add(target);
```

```js
// add element by css selector
v3d.add("#target");
```

```js
// add element with attribute
v3d.add("#target", {
  rotation: {
    x: -10
  }
});
```

```js
// get 3d Object for control
let obj = v3d.add("#target");
obj.rotation.x = V3D.math.degToRad(-10);
```

```js
// set object name to find
v3d.add("#target", {name:"test"});
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
```


```js
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
```

## examples
https://drumtj.github.io/v3d/test.html
[source](https://github.com/drumtj/v3d/blob/master/examples/test.html)

## License

MIT
