

var V3D;
export default class SliderPlugin {
  slides;
  v3d;
  currentIndex;
  option;
  pageTransform;
  constructor(v3d, slides, option?:{
    duration?:number;
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
    this.pageTransform = [
      {
        rotation: {
          y: V3D.math.degToRad(60)
        },
        position: {
          x: -500,
          z: -200
        },
        opacity: 0
      },
      {
        rotation: {
          y: V3D.math.degToRad(50)
        },
        position: {
          x: -400,
          z: -150
        },
        opacity: 0.3
      },
      {
        rotation: {
          y: V3D.math.degToRad(40)
        },
        position: {
          x: -300,
          z: -120
        },
        opacity: 0.5
      },
      {
        rotation: {
          y: V3D.math.degToRad(35)
        },
        position: {
          x: -200,
          z: -100
        },
        opacity: 0.7
      },
      {
        rotation: {
          y: 0
        },
        position: {
          x: 0,
          z: 400
        },
        opacity: 1
      },
      {
        rotation: {
          y: V3D.math.degToRad(-35)
        },
        position: {
          x: 200,
          z: -100
        },
        opacity: 0.7
      },
      {
        rotation: {
          y: V3D.math.degToRad(-40)
        },
        position: {
          x: 300,
          z: -120
        },
        opacity: 0.5
      },
      {
        rotation: {
          y: V3D.math.degToRad(-50)
        },
        position: {
          x: 400,
          z: -150
        },
        opacity: 0.3
      },
      {
        rotation: {
          y: V3D.math.degToRad(-60)
        },
        position: {
          x: 500,
          z: -200
        },
        opacity: 0
      }
    ]
  }

  select(index){
    if(this.currentIndex == index) return;
    this.currentIndex = index;
    V3D.TWEEN.removeAll();
    var center = Math.floor(this.pageTransform.length / 2);
    var s = index - center;
    for(var i=0; i<this.slides.length; i++){
      if(this.pageTransform[i-s]){
        this.v3d.tween(this.slides[i], this.pageTransform[i-s], this.option.duration);
      }else{
        if(i-s < 0){
          this.v3d.tween(this.slides[i], this.pageTransform[0], this.option.duration);
        }else{
          this.v3d.tween(this.slides[i], this.pageTransform[this.pageTransform.length-1], this.option.duration);
        }
      }
    }
  }
}
