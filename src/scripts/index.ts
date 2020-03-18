import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";
import {$, math} from "./Util";

import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


export default class V3D {
  prevTime = performance.now();
  time = 0;
  delta = 0;

  scene:THREE.Scene = null;
  camera:THREE.PerspectiveCamera = null;
  renderer:CSS3DRenderer = null;


  viewport = null;
  container = null;
  root = null;
  onUpdate = null;

  // 트윈 기본옵션
  tweenDefOpt = {
    withPosition: true,
    withRotation: true,
    delay: 0,
    easing: TWEEN.Easing.Sinusoidal.InOut
  }

  options;
  allowAnimate;

  static math = math;
  static THREE = THREE;
  static TWEEN = TWEEN;

  constructor(selector, opts?) {
    this.init(selector, opts);
  }



  init(selector, opts?) {
    this.container = $(selector);
    if(!this.container){
      throw "not found root";
    }

    this.options = Object.assign({
      // default option
    }, opts||{});



    let viewport = this.getViewportSize();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, viewport.width / viewport.height, 1, 1000);
    this.camera.position.z = 1000;

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(viewport.width, viewport.height);
    this.renderer.domElement.className = 'viewport';
    this.renderer.domElement.style.position = 'absolute';
		this.renderer.domElement.style.top = "0";
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', ()=>{
      let viewport = this.getViewportSize();
      this.camera.aspect = viewport.width / viewport.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(viewport.width, viewport.height);
      // this.webGLRenderer.setPixelRatio( window.devicePixelRatio );
      // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    }, false);


    let el_root = document.createElement("div");
    el_root.className = "root_element";
    this.root = new CSS3DObject(el_root);
    this.viewport = this.renderer.domElement;

    // this.root = new THREE.Group();


    // this.root = new THREE.Object3D();
    this.scene.add(this.root);



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
      this.onUpdate = this.options.onUpdate;
    }




    ////////////////
    ////////////////

    this.render();
  }

  getMouseVector(event, vector?){
    let rect = this.renderer.domElement.getBoundingClientRect();
    vector = vector || new THREE.Vector3(0, 0, 0.5);
    return vector.set(
      ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1,
      - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1,
      vector.z
    )
  }

  getViewportSize(){
    if(this.options.viewport){
      return {
        width: this.options.viewport.width,
        height: this.options.viewport.height
      }
    }else{
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }



  add(selector, opts?:{
    rotation?:{x?:number;y?:number;z?:number}|THREE.Vector3|THREE.Euler;
    position?:{x?:number;y?:number;z?:number}|THREE.Vector3;
    name?:string;
    parent?:THREE.Object3D|CSS3DObject;
  }){
    let obj, element = $(selector);
    if(element){
      opts = opts || {};
      // return list.map((el:any)=>{
      obj = new CSS3DObject(element);
      obj.element.dataset.id = obj.id;

      if(opts.name){
        obj.name = opts.name;
      }

      if(opts.rotation){
        for(let axis in opts.rotation){
          if(/^(x|y|z)$/.test(axis)){
            obj.rotation[axis] = math.degToRad(opts.rotation[axis]);
          }
        }
      }

      if(opts.position){
        for(let axis in opts.position){
          if(/^(x|y|z)$/.test(axis)){
            obj.position[axis] = opts.position[axis];
          }
        }
      }

      if(opts.parent && opts.parent.uuid){
        opts.parent.add(obj);
      }else{
        this.root.add(obj);
      }
    }
    return obj;
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


  cloneEmptyObject(object){
    let obj = new THREE.Object3D();
    obj.position.copy(object.position);
    obj.rotation.copy(object.rotation);
    return obj;
  }

  getObjectByElement(element){
    return this.root.getObjectById(Number(element.dataset.id));
  }

  // getObjectById(id){
  //   return this.root.getObjectById(id);
  // }

  tween(object, target, duration=2000, option?:{
    offsetPosition?: THREE.Vector3|{x?:number;y?:number;z?:number};
    lookAtDistance?: number;
    withPosition?: boolean;
    withRotation?: boolean;
    delay?: number;
    rotationDelay?: number;
    onComplete?: ()=>void;
    easing?: any;
    // opacity?: number;
  }):any[]{
    // console.error("tween", object, target);
    let opt = Object.assign({}, this.tweenDefOpt, option);
    let tws = [];
    let promises = [];
    let opacity;

    if(object instanceof HTMLElement){
      object = this.getObjectByElement(object);
    }

    if(target instanceof HTMLElement){
      target = this.getObjectByElement(target);
    }else{
      if(target.opacity !== undefined){
        opacity = target.opacity;
      }
      // for object
      if(!target.position || !(target.position instanceof THREE.Vector3)){
        let p = target.position || {};
        let r = target.rotation || {};
        target = new THREE.Object3D();

        target.position.copy(object.position);
        if(typeof p.x === "number") target.position.x = p.x;
        if(typeof p.y === "number") target.position.y = p.y;
        if(typeof p.z === "number") target.position.z = p.z;

        target.rotation.copy(object.rotation);
        if(typeof r.x === "number") target.rotation.x = r.x;
        if(typeof r.y === "number") target.rotation.y = r.y;
        if(typeof r.z === "number") target.rotation.z = r.z;

        // target.position.set(p.x||object.position.x, p.y||object.position.y, p.z||object.position.z);
        // target.rotation.set(r.x||object.rotation.x, r.y||object.rotation.y, r.z||object.rotation.z);
      }
    }

    if(object && target && opt.withPosition){
      promises.push(new Promise(resolve=>{
        let pos;
        if(opt.offsetPosition){
          pos = { x: target.position.x + (opt.offsetPosition.x||0), y: target.position.y + (opt.offsetPosition.y||0), z: target.position.z + (opt.offsetPosition.z||0) };
        }else{
          pos = { x: target.position.x, y: target.position.y, z: target.position.z };
        }
        if(opt.lookAtDistance){
          let dirVector = new THREE.Vector3(0, 0, opt.lookAtDistance);
          // let qt;
          // if(target.quaternion){
          //   qt = target.quaternion;
          // }else{
          //   let obj = new THREE.Object3D();
          //   obj.position.set(pos.x, pos.y, target.position.z);
          //   obj.rotation.set(target.rotation.x, target.rotation.y, target.rotation.z);
          //   qt = obj.quaternion;
          // }
          dirVector.applyQuaternion(target.quaternion);
          pos = new THREE.Vector3(pos.x, pos.y, pos.z);
          pos.add(dirVector);
        }
        // console.error("?", pos);
        let tw = new TWEEN.Tween( object.position )
        .to( pos, duration )
        // .interpolation( TWEEN.Interpolation.Bezier )
        .delay(opt.delay||0)
        .onComplete(resolve)
        .easing( opt.easing );

        tws.push(tw);
      }))
    }

    if(object && target && opt.withRotation){
      promises.push(new Promise(resolve=>{
        let rotation = ["x","y","z"].reduce((r,ax)=>{
          //출발점 rotation 노멀라이징.
          object.rotation[ax] = V3D.math.normalRad(object.rotation[ax]);
          //목적 회전값과의 거리를 최단회전거리로 변경
          r[ax] = V3D.math.getDestinationRad(object.rotation[ax], V3D.math.normalRad(target.rotation[ax]));
          return r;
        }, {})

        let tw = new TWEEN.Tween( object.rotation )
        .to( rotation, duration )
        .onComplete(resolve)
        .delay(opt.rotationDelay || opt.delay || 0)
        .easing( opt.easing );

        tws.push(tw);
      }))
    }

    if(object && target && opacity !== undefined){
      promises.push(new Promise(resolve=>{
        let tw = new TWEEN.Tween( object.element.style )
        .to( {opacity}, duration )
        .onComplete(resolve)
        .delay(opt.delay || 0)
        .easing( opt.easing );

        tws.push(tw);
      }))
    }

    if(!this.allowAnimate){
      console.error("please run v3d.startAnimate() first");
    }

    if(opt.onComplete){
      Promise.all(promises).then(opt.onComplete);
    }

    tws.forEach(tw=>tw.start());
    return tws;
  }


  killTween(tws){
    if(Array.isArray(tws)){
      tws.forEach(tw=>{
        if(tw){
          TWEEN.remove(tw);
        }
      })
      tws.length = 0;
    }else{
      if(tws){
        TWEEN.remove(tws);
      }
    }
  }

  //
  // tweenEmpty(duration){
  //   let tween;
  //   let promise = new Promise(resolve=>{
  //     tween = new TWEEN.Tween({}).to({}, duration).onComplete(resolve);
  //     tween.start();
  //   })
  //   return {tween, promise};
  // }


  animateCallback = null;
  animate = ()=>{
    this.time = performance.now();
    this.delta = (this.time - this.prevTime) / 1000;
    this.prevTime = this.time;
    if (this.delta < 0.08){
      if(typeof this.onUpdate === "function"){
        this.onUpdate(this.time);
      }
      TWEEN.update();
      this.render();
    }
  }

  stopAnimate(){
    this.allowAnimate = false;
    this.animateCallback = null;
  }

  startAnimate(){
    this.stopAnimate();
    this.allowAnimate = true;
    let cb = ()=>{
      if(this.animateCallback === cb){
        requestAnimationFrame(cb);
      }else{
        return;
      }
      this.animate();
    }
    this.animateCallback = cb;
    cb();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
