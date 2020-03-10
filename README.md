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
<script src="https://unpkg.com/@drumtj/v3d@1.0.2/dist/v3d.js"></script>
```

CommonJS
```js
import V3D from '@drumtj/v3d';
```
```js
const V3D = require('@drumtj/v3d');
```

## How To

```html
<style media="screen">
  .container {
    width: 800px;
    height: 600px;
    background-color: gray;
    overflow: auto;
    padding: 20px;
  }

  .box {
    display: inline-block;
    width: 250px;
    height: 200px;
    border: 1px solid red;
  }
</style>
<body>
  <div class="root">
  </div>

  <div class="temp" style="display:none;">
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </div>
</body>
```

```js
var v3d = new V3D(".root", {
  target:{
    selector: ".container",
    rotation: {
      x: -10
    }
  },
  camera: {
    position: {
      z: 1000
    }
  }
});
```

```js
var v3d = new V3D(".root");
let objList = v3d.add(".container");
objList.forEach(obj=>obj.rotation.x=V3D.math.degToRad(-10));
v3d.camera.position.z = 1000;
```


## License

MIT
