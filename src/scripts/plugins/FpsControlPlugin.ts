var THREE;
var V3D;
export default class FpsCOntrols {
  camera;
  v3d;
  moveVec;
  isMoveForward = false;
  isMoveBackward = false;
  isMoveLeft = false;
  isMoveRight = false;
  canJump = false;
  isCtrlDown = false;
  velocity;
  // direction;
  // euler;
  speed = 15000;
  onMouseDown;
  onMouseUp;
  constructor(v3d){
    this.v3d = v3d;
    this.camera = v3d.camera;
    if(!THREE){
      V3D = v3d.constructor;
      THREE = V3D.THREE;
    }

    this.moveVec = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    let euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

    document.addEventListener( 'keydown', this.onKeyDown.bind(this), false );
  	document.addEventListener( 'keyup', this.onKeyUp.bind(this), false );

    let isMouseDown = false;
    v3d.viewport.addEventListener("mousedown", event=>{
      isMouseDown = true;
      if(typeof this.onMouseDown === "function"){
        this.onMouseDown(event);
      }
      // this.lockMouse();
    })

    document.addEventListener( 'mouseup', event=>{
      isMouseDown = false;
      if(typeof this.onMouseUp === "function"){
        this.onMouseUp(event);
      }
      // this.unlockMouse();
    }, false );

    var PI_2 = Math.PI / 2;
    v3d.viewport.addEventListener("mousemove", event=>{
      if(isMouseDown){
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  		  var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        euler.setFromQuaternion( this.v3d.camera.quaternion );

    		euler.y -= movementX * 0.002;
    		euler.x -= movementY * 0.002;

    		euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

    		this.v3d.camera.quaternion.setFromEuler( euler );
      }
    });

    v3d.addUpdateCallback(()=>{
      this.velocity.x -= this.velocity.x * 10.0 * v3d.delta;
  		this.velocity.z -= this.velocity.z * 10.0 * v3d.delta;

  		// velocity.y -= 9.8 * 100.0 * this.delta; // 100.0 = mass

      direction.z = Number( this.isMoveForward ) - Number( this.isMoveBackward );
  		direction.x = Number( this.isMoveRight ) - Number( this.isMoveLeft );
  		direction.normalize(); // this ensures consistent movements in all directions

      if ( this.isMoveForward || this.isMoveBackward ) this.velocity.z -= direction.z * this.speed * v3d.delta;
  		if ( this.isMoveLeft || this.isMoveRight ) this.velocity.x -= direction.x * this.speed * v3d.delta;

      this.moveRight( - this.velocity.x * v3d.delta );
  		this.moveForward( - this.velocity.z * v3d.delta );
      // console.error(velocity);

  		// v3d.camera.position.y += ( velocity.y * this.delta ); // new behavior
      //
  		// if ( v3d.camera.position.y < 10 ) {
  		// 	velocity.y = 0;
  		// 	v3d.camera.position.y = 10;
      //
  		// 	canJump = true;
  		// }
    })
  }

  onKeyDown( event ) {
    // console.error(event.keyCode);
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				this.isMoveForward = true;
				break;

			case 37: // left
			case 65: // a
				this.isMoveLeft = true;
				break;

			case 40: // down
			case 83: // s
				this.isMoveBackward = true;
				break;

			case 39: // right
			case 68: // d
				this.isMoveRight = true;
				break;

			case 32: // space
				if ( this.canJump === true ) this.velocity.y += 350;
				this.canJump = false;
				break;

      case 17:
        this.isCtrlDown = true;
        // unlockMouse();
        // unlockWall();
        break;
		}
	}

	onKeyUp( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				this.isMoveForward = false;
				break;

			case 37: // left
			case 65: // a
				this.isMoveLeft = false;
				break;

			case 40: // down
			case 83: // s
				this.isMoveBackward = false;
				break;

			case 39: // right
			case 68: // d
				this.isMoveRight = false;
				break;

      case 17: //ctrl
        this.isCtrlDown = false;
        // lockMouse();
        // lockWall();
        break;
		}
	}

  moveForward( distance ) {
		this.moveVec.setFromMatrixColumn( this.v3d.camera.matrix, 0 );
		this.moveVec.crossVectors( this.v3d.camera.up, this.moveVec );
		this.v3d.camera.position.addScaledVector( this.moveVec, distance );
	};

	moveRight( distance ) {
		this.moveVec.setFromMatrixColumn( this.v3d.camera.matrix, 0 );
		this.v3d.camera.position.addScaledVector( this.moveVec, distance );
	};

  lockMouse(){
    this.v3d.viewport.requestPointerLock();
  }

  unlockMouse(){
    document.exitPointerLock();
  }
}
