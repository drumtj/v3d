import V3D from "./index";

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

// var v3d = new V3D(".root");
// let t = v3d.add(".container").forEach(v=>v.rotation.x=-3);
// console.error(t);
