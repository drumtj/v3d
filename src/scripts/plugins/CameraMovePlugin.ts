export default class CameraMovePlugin {
  v3d;
  _state = "home";
  get state(){
    return this._state;
  }
  homeObject;
  option;
  tweens = [];
  constructor(v3d, opt?:{
    tweenDuration?: number;
    lookAtDistance?: number;
    homeObject?: any;
  }){
    this.option = Object.assign({
      tweenDuration: 1500
    }, opt || {});
    this.homeObject = this.option.homeObject || v3d.cloneEmptyObject(v3d.camera);
    this.v3d = v3d;
  }

  moveTarget(target, duration?){
    return new Promise(resolve=>{
      duration = typeof duration === "number" ? duration : this.option.tweenDuration;
      this._state = "move";
      this.v3d.killTween(this.tweens);
      this.tweens = this.v3d.tween(this.v3d.camera, target, duration, {
        lookAtDistance: this.option.lookAtDistance,
        onComplete: ()=>{
          this._state = "target";
          resolve();
        }
      });
    })
  }

  moveHome(duration?){
    return new Promise(resolve=>{
      duration = typeof duration === "number" ? duration : this.option.tweenDuration;
      this._state = "move";
      this.v3d.killTween(this.tweens);
      this.tweens = this.v3d.tween(this.v3d.camera, this.homeObject, duration, {
        onComplete: ()=>{
          this._state = "home";
          resolve();
        }
      });
    })
  }
}
