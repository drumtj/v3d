import * as THREE from 'three';
// import axios from 'axios';
// import $ from "jquery";
// import TWEEN from "@tweenjs/tween.js";
import {$, math} from "./Util";
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// import { WEBGL } from 'three/examples/jsm/WebGL.js';
// import screenfull from "screenfull";
// import checkIE from "check-ie";4
// import loadJS from "load-js";


// import {DEBUG, PRELOAD, CAMERA_DISTANCE, TTS_MAX_LENGTH} from "./dev.json";


export default class V3D {
  prevTime = performance.now();
  time = 0;
  delta = 0;
  ui = null;
  scene:THREE.Scene = null;
  // clickRaycaster = null;
  camera:THREE.PerspectiveCamera = null;
  renderer:CSS3DRenderer = null;
  // webGLRenderer:THREE.WebGLRenderer = null;
  // controls = null;

  // cameraTransform = null;



  $container = null;
  root = null;
  onUpdate = null;
  //트윈상태 파악용
  // isTypeTweening = false;
  // isTweening = false;
  // 트윈객체 관리용
  // cameraTweens = [];
  // transformTweens = [];
  // 트윈 기본옵션
  // tweenDefOpt = {
  //   withPosition: true,
  //   withRotation: true,
  //   delay: 0,
  //   easing: TWEEN.Easing.Exponential.InOut
  // }

  options;

  static math = math;

  constructor(selector, opts?) {
    this.init(selector, opts);
  }

  static instance;
  // static create(data?, options?){
  static create(param){
    // this.instance = new BiscuitViewer(data, options);
    this.instance = new V3D(param);
  }

  static getInstance(selector?, opts?){
    if(!this.instance){
      this.instance = new V3D(selector, opts);
    }
    return this.instance;
  }


  async init(selector, opts?) {
    this.$container = $(selector);
    if(this.$container.length == 0){
      throw "not found root";
    }

    this.options = Object.assign({
      // default options
    }, opts||{});

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
    this.camera.position.z = 1000;

    // this.scene.fog = new THREE.FogExp2( 0x001932, 0.00015 );
    // this.scene.background = null;
    // this.webGLRenderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
    // // this.webGLRenderer.setClearColor( 0x000000, 0 );
		// this.webGLRenderer.setPixelRatio( window.devicePixelRatio );
		// this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
		// this.$root.append( this.webGLRenderer.domElement );


    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.className = 'viewport';
    this.renderer.domElement.style.position = 'absolute';
		this.renderer.domElement.style.top = "0";
    this.$container[0].appendChild(this.renderer.domElement);

    window.addEventListener('resize', ()=>{
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // this.webGLRenderer.setPixelRatio( window.devicePixelRatio );
      // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    }, false);


    let el_root = document.createElement("div");
    el_root.className = "root";
    this.root = new CSS3DObject(el_root);

    // this.root = new THREE.Group();


    // this.root = new THREE.Object3D();
    this.scene.add(this.root);

    window['camera'] = this.camera;
    window['root'] = this.root;

    let target = this.options.target;
    if(target && target.selector){
      let list = this.add(target.selector);
      if(list.length){
        list.forEach(obj=>{
          if(target.rotation){
            for(let axis in target.rotation){
              if(/^(x|y|z)$/.test(axis)){
                obj.rotation[axis] = math.degToRad(target.rotation[axis]);
              }
            }
          }

          if(target.position){
            for(let axis in target.position){
              if(/^(x|y|z)$/.test(axis)){
                obj.position[axis] = target.position[axis];
              }
            }
          }
        })
      }
    }

    let camera = this.options.camera;
    if(camera){
      if(camera.rotation){
        for(let axis in camera.rotation){
          if(/^(x|y|z)$/.test(axis)){
            this.camera.rotation[axis] = math.degToRad(camera.rotation[axis]);
          }
        }
      }

      if(camera.position){
        for(let axis in camera.position){
          if(/^(x|y|z)$/.test(axis)){
            this.camera.position[axis] = camera.position[axis];
          }
        }
      }
    }

    if(this.options.onUpdate){
      this.onUpdate = time=>{
        this.options.onUpdate(time);
      }
    }




    ////////////////
    ////////////////

    this.animate();
  }

  add(element){
    let $el = $(element);
    if($el.length){
      return $el.map(el=>{
        let obj = new CSS3DObject(el);
        this.root.add(obj);
        return obj;
      })
      // return obj;
    }else{
      return [];
    }
  }



  // 카메라의 뷰 범위에 들어오는 대상들 리턴
  getObjectsInCamera(){
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    let frustum = new THREE.Frustum();
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

    return this.root.children.filter(biscuit=>frustum.intersectsObject(biscuit.mesh))
  }

  frustum = new THREE.Frustum();
  cameraMatrix = new THREE.Matrix4();
  // 카메라의 뷰 범위에 들어오는지 확인,
  checkInCamera(objects){
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.cameraMatrix.set(0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0);
    this.cameraMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    // new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    this.frustum.setFromMatrix(this.cameraMatrix);

    if(Array.isArray(objects)){
      return objects.map(obj=>this.frustum.intersectsObject(obj.mesh));
    }else{
      return this.frustum.intersectsObject(objects.mesh);
    }
  }


  delay(v){
    return new Promise(resolve=>{
      setTimeout(resolve, v);
    })
  }


  normalRad(rad){
    return Math.atan2(Math.sin(rad), Math.cos(rad));
  }

  // radToDeg(r){
  //   return r/Math.PI*180;
  // }

  getDestinationRad(from, to){
    // if(Math.abs(to - from) > Math.PI){
    //   Math.PI*2 +
    // }
    // console.error("getDestinationRad", this.radToDeg(from), this.radToDeg(to));
    if(Math.abs(to-from) > Math.PI){
      if(to > 0){
        // console.error(this.radToDeg(Math.PI*2 * to));
        return from + (to-from) - Math.PI*2;
        // return Math.PI*2 * to;
      }else{
        return from + (to-from) + Math.PI*2;
        // console.error(this.radToDeg(Math.PI*2 - to));
        // return Math.PI*2 - to;
      }
    }else{
      return to;
    }
    // if(Math.abs(to-from)>Math.PI){
    //   return from + Math.abs(to-from);
    // }
    // return to;
  }

  printDegree(rotation, memo?){
    console.error("[printDegree]", memo, "xyz".split('').map(ax=>rotation[ax]/Math.PI*180));
  }




  // tween(object, target, duration=2000, option?:{
  //   withPosition?: boolean;
  //   withRotation?: boolean;
  //   delay?: number;
  //   rotationDelay?: number;
  //   onComplete?: ()=>void;
  //   easing?: any;
  // }):any[]{
  //   // if(!object || !target){
  //   //   // console.error("tween param error", object, target);
  //   //   return [];
  //   // }
  //   // console.error("tween", object, target);
  //   let opt = Object.assign({}, this.tweenDefOpt, option);
  //   let tws = [];
  //   let tw, promises = [];
  //   if(object && target && opt.withPosition){
  //     promises.push(new Promise(resolve=>{
  //       tw = new TWEEN.Tween( object.position )
  //       .to( { x: target.position.x, y: target.position.y, z: target.position.z }, duration )
  //       // .interpolation( TWEEN.Interpolation.Bezier )
  //       .delay(opt.delay||0)
  //       .onComplete(resolve)
  //       .easing( opt.easing );
  //       // if(opt.delay > 0){
  //       //   tw.delay(opt.delay);
  //       // }
  //       tws.push(tw);
  //     }))
  //   }
  //
  //   if(object && target && opt.withRotation){
  //     promises.push(new Promise(resolve=>{
  //       let rotation = ["x","y","z"].reduce((r,ax)=>{
  //         //출발점 rotation 노멀라이징.
  //         object.rotation[ax] = this.normalRad(object.rotation[ax]);
  //         //목적 회전값과의 거리를 최단회전거리로 변경
  //         r[ax] = this.getDestinationRad(object.rotation[ax], this.normalRad(target.rotation[ax]));
  //         return r;
  //       }, {})
  //       // console.error("rotationDelay", opt.rotationDelay, object);
  //       // if(object instanceof THREE.PerspectiveCamera && this.selectedBiscuit == null){
  //       //   console.error("rotation", rotation);
  //       // }
  //       tw = new TWEEN.Tween( object.rotation )
  //       .to( rotation, duration )
  //       // .onUpdate((obj, target, duration)=>{
  //       //   if(object instanceof THREE.PerspectiveCamera && this.selectedBiscuit == null){
  //       //     console.error(target, duration);
  //       //   }
  //       // })
  //       .onComplete(resolve)
  //       .delay(opt.rotationDelay || opt.delay || 0)
  //       .easing( opt.easing );
  //       // if(opt.rotationDelay > 0){
  //       //   tw.delay(opt.rotationDelay);
  //       // }else if(opt.delay > 0){
  //       //   tw.delay(opt.delay);
  //       // }
  //       tws.push(tw);
  //     }))
  //   }
  //
  //   if(opt.onComplete){
  //     Promise.all(promises).then(opt.onComplete);
  //     // tw = new TWEEN.Tween({}).to({}, duration).onComplete(opt.onComplete);
  //     // if(opt.delay > 0){
  //     //   tw.delay(opt.delay);
  //     // }
  //     // tws.push(tw);
  //   }
  //
  //   tws.forEach(tw=>tw.start());
  //   return tws;
  // }
  //
  // tweenEmpty(duration){
  //   let tween;
  //   let promise = new Promise(resolve=>{
  //     tween = new TWEEN.Tween({}).to({}, duration).onComplete(resolve);
  //     tween.start();
  //   })
  //   return {tween, promise};
  // }



  animate = ()=>{
    requestAnimationFrame(this.animate);
    this.time = performance.now();
    this.delta = (this.time - this.prevTime) / 1000;
    this.prevTime = this.time;
    if (this.delta < 0.08){
      this.render();
      // TWEEN.update();
      if(this.onUpdate){
        this.onUpdate(this.time);
      }
    }
  }



  render() {
    this.renderer.render(this.scene, this.camera);
    // this.webGLRenderer.render(this.scene, this.camera);
  }
}
