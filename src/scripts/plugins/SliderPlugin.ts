

var V3D;
var pageTransform = {
  "default": [
    {
      rotation: {
        x: 0,
        y: 60,
        z: 0
      },
      position: {
        x: -500,
        y: 0,
        z: -200
      },
      opacity: 0
    },
    {
      rotation: {
        x: 0,
        y: 50,
        z: 0
      },
      position: {
        x: -400,
        y: 0,
        z: -150
      },
      opacity: 0.3
    },
    {
      rotation: {
        x: 0,
        y: 40,
        z: 0
      },
      position: {
        x: -300,
        y: 0,
        z: -120
      },
      opacity: 0.5
    },
    {
      rotation: {
        x: 0,
        y: 35,
        z: 0
      },
      position: {
        x: -200,
        y: 0,
        z: -100
      },
      opacity: 0.7
    },
    {
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 0,
        z: 50
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: -35,
        z: 0
      },
      position: {
        x: 200,
        y: 0,
        z: -100
      },
      opacity: 0.7
    },
    {
      rotation: {
        x: 0,
        y: -40,
        z: 0
      },
      position: {
        x: 300,
        y: 0,
        z: -120
      },
      opacity: 0.5
    },
    {
      rotation: {
        x: 0,
        y: -50,
        z: 0
      },
      position: {
        x: 400,
        y: 0,
        z: -150
      },
      opacity: 0.3
    },
    {
      rotation: {
        x: 0,
        y: -60,
        z: 0
      },
      position: {
        x: 500,
        y: 0,
        z: -200
      },
      opacity: 0
    }
  ],

  "cube": function(){
    let list = [];
    let distance = 220;
    let side = 4;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "cube-inverse": function(){
    let list = [];
    let distance = 220;
    let side = 4;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle-180, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "cube-inverse-angle": function(){
    let list = [];
    let distance = 220;
    let side = 4;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "cube-inverse-angle2": function(){
    let list = [];
    let distance = 220;
    let side = 4;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*-angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "octagon": function(){
    let list = [];
    let distance = 350;
    let side = 8;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }

    return list;
  },

  "octagon-inverse": function(){
    let list = [];
    let distance = 350;
    let side = 8;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle-180, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }

    return list;
  },

  "octagon-inverse-angle": function(){
    let list = [];
    let distance = 300;
    let side = 8;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "octagon-inverse-angle2": function(){
    let list = [];
    let distance = 300;
    let side = 8;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*-angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "dodecagon": function(){
    let list = [];
    let distance = 500;
    let side = 12;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "dodecagon-inverse": function(){
    let list = [];
    let distance = 500;
    let side = 12;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle - 180, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "dodecagon-inverse-angle": function(){
    let list = [];
    let distance = 500;
    let side = 12;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: 90 - (i*angle),
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y - distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "dodecagon-inverse-angle2": function(){
    let list = [];
    let distance = 500;
    let side = 12;
    let count = side/2+1;
    let angle = 360/side;
    for(let i=0; i<count; i++){
      let c = V3D.math.getCoord(i*-angle, distance);
      list.push({
        rotation: {
          x: 0,
          y: (i*angle) - 90,
          z: 0
        },
        position: {
          x: -c.x,
          y: 0,
          z: c.y + distance
        },
        opacity: i==0||i==count-1?0:1
      })
    }
    return list;
  },

  "arc": [
    {
      rotation: {
        x: 0,
        y: -35,
        z: 45
      },
      position: {
        x: -430,
        y: -50,
        z: -320
      },
      opacity: 0
    },
    {
      rotation: {
        x: 0,
        y: -35,
        z: 45
      },
      position: {
        x: -430,
        y: -50,
        z: -300
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: -15,
        z: 20
      },
      position: {
        x: -270,
        y: 60,
        z: -150
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 100,
        z: 100
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: 15,
        z: -20
      },
      position: {
        x: 270,
        y: 60,
        z: -150
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: 35,
        z: -45
      },
      position: {
        x: 430,
        y: -50,
        z: -300
      },
      opacity: 1
    },
    {
      rotation: {
        x: 0,
        y: 35,
        z: -45
      },
      position: {
        x: 430,
        y: -50,
        z: -320
      },
      opacity: 0
    }
  ]
}

function cloneObj(obj) {
  if (obj === null || typeof(obj) !== 'object')
  return obj;

  var copy = obj.constructor();

  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = cloneObj(obj[attr]);
    }
  }

  return copy;
}

export default class SliderPlugin {
  slides;
  v3d;
  currentIndex;
  option;
  _type = "default";
  scale = 1;
  get type(){
    return this._type;
  }
  constructor(v3d, slides, option?:{
    duration?: number;
    activeSlideOffsetPosition?: {x?:number;y?:number;z?:number}
  }){
    this.v3d = v3d;
    this.slides = slides;
    this.option = Object.assign({
      duration: 1000
    }, option||{})
    V3D = this.v3d.constructor;

    this.init();
  }

  init(){
    let o = pageTransform as any;
    for(let t in o){
      if(typeof o[t] === "function"){
        o[t] = o[t]();
      }else{
        for(let p in o[t]){
          if(typeof o[t][p] === "function"){
            o[t][p] = o[t][p]();
          }
        }
      }
    }
  }

  setScale(sc){
    this.scale = sc;
  }

  setType(type){
    if(pageTransform[type]){
      this._type = type;
      return true;
    }
    return false;
  }

  getType(){
    return this._type;
  }

  changeType(type){
    if(this.setType(type)){
      this.select(this.currentIndex, true);
    }
  }

  getTransformInfo(type?){
    let info = cloneObj(pageTransform[type||this._type] || pageTransform[this._type]);
    for(let o of info){
      for(let a in o.position){
        o.position[a] = o.position[a] * this.scale;
      }
    }
    if(this.option.activeSlideOffsetPosition){
      let o = info[Math.floor(info.length/2)].position;
      let p = this.option.activeSlideOffsetPosition;
      if(o){
        if(typeof p.x === "number") o.x += p.x;
        if(typeof p.y === "number") o.y += p.y;
        if(typeof p.z === "number") o.z += p.z;
      }
    }
    // console.error(info);
    return info;
    // return pageTransform[type||this._type] || pageTransform[this._type];
  }

  addTransformInfo(name, info){
    if(name == "default"){
      console.error('The name "default" cannot be set.');
      return;
    }
    pageTransform[name] = info;
  }

  getTransformNames(){
    return Object.keys(pageTransform);
  }

  select(index, force?){
    if((!force && this.currentIndex == index)) return;
    this.currentIndex = index;
    V3D.TWEEN.removeAll();
    let transformInfo = this.getTransformInfo();
    var center = Math.floor(transformInfo.length / 2);
    var s = index - center;
    for(var i=0; i<this.slides.length; i++){
      if(transformInfo[i-s]){
        // console.error("!", i-s);
        this.v3d.tween(this.slides[i], transformInfo[i-s], this.option.duration);
      }else{
        if(i-s < 0){
          // console.error(0);
          this.v3d.tween(this.slides[i], transformInfo[0], this.option.duration);
        }else{
          // console.error(transformInfo.length-1);
          this.v3d.tween(this.slides[i], transformInfo[transformInfo.length-1], this.option.duration);
        }
      }
    }
  }
}
