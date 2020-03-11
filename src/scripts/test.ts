import V3D from "./index";

let list = [
  function(){
    let img = new Image();
    img.src = "https://lh3.googleusercontent.com/proxy/8HGxCTGmkoShDUA0NhfJebwJ9xuHxlWV1Qg1cTNemgAoVHC5ph6Zua7F4aoCZts9aWoWE9m4N3kmq4YoykXhVSDv0Eo61qYzXf1Rv91TEkDtcA"

    var v3d = new V3D(".container");
    let imgObj = v3d.add(img);
    imgObj.rotation.x = V3D.math.degToRad(-10);
  },
  function(){
    let element = document.querySelector(".target1");

    var v3d = new V3D(".container");
    v3d.add(element, {
      rotation:{
        x: -10
      }
    });
  },
  function(){
    var v3d = new V3D(".container", {camera:{rotation:{z:-15}}});
    v3d.add(".target1", {
      rotation:{
        x: -10
      },
      position:{
        z: 500
      }
    });
    v3d.onUpdate = function(time){
      v3d.root.rotation.y = Math.cos(time/1000);
    }
  },
  function(){
    var v3d = new V3D(".container", {
      viewport: {
        width: 800,
        height: 600
      },
      camera: {
        position: {
          z: 1000
        }
      }
    });

    let img = new Image();
    img.src = "https://lh3.googleusercontent.com/proxy/8HGxCTGmkoShDUA0NhfJebwJ9xuHxlWV1Qg1cTNemgAoVHC5ph6Zua7F4aoCZts9aWoWE9m4N3kmq4YoykXhVSDv0Eo61qYzXf1Rv91TEkDtcA"
    v3d.add(img, {
      rotation:{
        x: -10
      }
    })
  }
];

list[2]();

// v3d.scene.getObjectByName
// v3d.scene.getObjectById
// v3d.add(document.querySelector(".container"), {
//   rotation:{
//     x: -10
//   }
// })


// var v3d = new V3D(".root");
// let t = v3d.add(".container").forEach(v=>v.rotation.x=-3);
// console.error(t);
