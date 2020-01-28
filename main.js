let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x535353 );
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth * 0.9, window.innerHeight * .8);
document.body.appendChild( renderer.domElement );

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// let cube = new THREE.Mesh( geometry, material );

let light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

let goingDown = true;
let ball = null;
let cube = null;
let boundary = null;
let ballSize = 0.2; //This should be here
let flipped = false;
let ballMoving = true;
let repeater = null;

let spotLight = new THREE.DirectionalLight( 0xffffff , 0.5);
spotLight.position.set( 400, 300, 800 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );

let isClicked = 0;

let obj1;
let mousesX;
let mousesY;

camera.position.z = 17;
camera.position.y = 5;
camera.rotation.z = 0.00;

let savedCameraRotation = camera.rotation.z;

// // Uncomment this section in order to re-enable the mouse
// document.addEventListener( 'mousemove', onMouseMove, false );
// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
// document.addEventListener( 'mouseup', onDocumentMouseUp, false);

// instantiate a loader
let MonkeyDude = new THREE.OBJLoader();

// load a resource
MonkeyDude.load(
	// resource URL
	'BorderCube.obj',
	// called when resource is loaded
	 function ( object ) {
    object.traverse( function ( child ) {
    	if ( child instanceof THREE.Mesh ) {
          child.material.color.setHex(808080);
      }})
		obj1 = object;
	 },
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            //console.log(loaded + " % loaded");
            if (xhr.loaded / xhr.total * 100 == 100) {
                document.body.classList.remove("loading");
                console.log("DONE");
            }
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );

	}
);

function onDocumentMouseDown( event ) {
    if (isClicked === 0) {
    	isClicked = setInterval(whileMouseDown, 10);
    }

}

function onMouseMove() {
    mousesX = event.clientX;
    mousesY = event.clientY;
}

function onDocumentMouseUp( event ) {
	if( isClicked != 0) {
		clearInterval(isClicked);
		isClicked = 0;
	}
	clearInterval(isClicked);
}

function whileMouseDown() {
	let mouseX = window.innerWidth / 2 - mousesX;
    let mouseY = window.innerHeight / 2 - mousesY;
    obj1.rotation.y = -Math.PI*2*mouseX/window.innerWidth;
    // obj1.rotation.x = Math.PI*2*mouseY/window.innerHeight;
    obj1.updateMatrix();
}

function afterLoading() {
		// this becomes new main
		let floor = new THREE.BoxGeometry( 20, 1, 20 );
		let floormat = new THREE.MeshBasicMaterial( { color: 0xff0094 }  );

		boundary = obj1.clone();
		boundary.scale.x = 0.4;
		boundary.scale.y = 1;
		boundary.scale.z = 1;
		boundary.position.y = 5
		boundary.rotation.z = 1.55;
		boundary.rotation.x = 1.6;
		scene.add(boundary);

		// How to add cubes at origin
		// let testCube = addCube("fdf");
		// scene.add( testCube );


// 	// Adding Cube With texture
		//cube = addCube("stone");
		let geometry = new THREE.BoxGeometry( 2, 0.3, 2 );
		let materialboi = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, materialboi );
		cube.position.y -= 0.7;
		scene.add( cube );

    geometry = new THREE.SphereGeometry( ballSize, 32, 32 );
		let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		ball = new THREE.Mesh( geometry, material );
		ball.position.y += 4;
		ball.matrixAutoUpdate = true;
		scene.add( ball );

	  animate();
}

function flipScreen(){
		if (flipped == false) {
			camera.rotation.z += 0.01;
			if (camera.rotation.z >= Math.PI) {
				flipped = true;
				ballMoving = true;
				repeater.clearTimeout();
				repeater = null;
			}
		} else {
			camera.rotation.z = savedCameraRotation;
			flipped = false;
		}
		repeater = setTimeout(flipScreen, 10);
}

//Controls the block that the ball bounces off.
document.addEventListener('keydown',onDocumentKeyDown,false);
function onDocumentKeyDown(event){
		let delta = 1;
		event = event || window.event;
		let keycode = event.keyCode;
		switch(keycode){
				case 37 : //left arrow
				//camera.position.x = camera.position.x - delta;
				if (cube.position.x > -5) {
					cube.position.x = cube.position.x - delta;
				}
				break;
				case 38 : // up arrow
				//
				console.log(camera.rotation.z);
				ballMoving = false;
				flipScreen();



				break;
				case 39 : // right arrow
				//camera.position.x = camera.position.x + delta;
				if (cube.position.x < 5) {
					cube.position.x = cube.position.x + delta;
				}
				break;
				case 40 : //down arrow
				//camera.rotation.z += 0.1;
				break;
		}
		document.addEventListener('keyup',onDocumentKeyUp,false);
}
function onDocumentKeyUp(event){
	//document.removeEventListener('keydown',onDocumentKeyDown,false);
}

//This function gets called when the ball flies out of the screen.
function startLoseScreen() {
	//return to regular rotation
	camera.rotation.z = savedCameraRotation;
	ballMoving = false;

	let text2 = document.createElement('div');
	text2.style.position = 'absolute';
	//console.log();
	//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text2.style.width = 100;
	text2.style.height = 100;
	text2.style.backgroundColor = "red";
	text2.innerHTML = "YOU LOSE";
	text2.style.top = 100 + 'px'; // 200 + 'px'
	text2.style.left = window.innerWidth/2.6 + 'px'; //200 + 'px'
	document.body.appendChild(text2);
}

let ballX = 0.1;
let ballY = 0.1;
let ballZ = 0;

function ballPhysics(ball) {

	if (ballMoving == true) {
		ball.position.x += ballX
		ball.position.y += ballY
		ball.position.z += ballZ
	}

	let ballPos = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z);
	let cubePos = new THREE.Vector3(cube.position.x, cube.position.y, cube.position.z);
	let dist = ballPos.distanceTo(cubePos);

	if (ball.position.y > 10 - ballSize) {
		ballY = ballY * -1;
	} else if (ball.position.y < -2) {
		startLoseScreen();
	}
	if (ball.position.x < -5 + ballSize || ball.position.x > 5 - ballSize) {
		ballX = ballX * -1;
	}
	if (dist < 0.7) {
		ballY = Math.abs(ballY * -1);
		//camera.rotation.z += 1; //Math.random() +
		//boundary.rotateX(90);
	}

};

function animate() {
	requestAnimationFrame( animate );
  ballPhysics(ball);
	renderer.render( scene, camera );
}

function addCube(ballType = "dirt") {
		// Adding Cube With texture
		let geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// load a texture, set wrap mode to repeat
		let matLoader = new THREE.TextureLoader();
		let materialboi;

		if( ballType == "dirt") {
			materialboi = new THREE.MeshBasicMaterial( {
			map: matLoader.load('grass/dirt.jpg'),
			} );
		} else if ( ballType == "cobble") {
			materialboi = new THREE.MeshBasicMaterial( {
			map: matLoader.load('grass/cobblestone.png'),
			} );
		} else if ( ballType == "stone") {
			materialboi = new THREE.MeshBasicMaterial( {
			map: matLoader.load('grass/stone.jpg'),
			} );
		}  else if ( ballType == "lamp") {
			materialboi = new THREE.MeshBasicMaterial( {
			map: matLoader.load('grass/lamp.jpg'),
			} );
		} else {
			materialboi = new THREE.MeshBasicMaterial( {
			map: matLoader.load('grass/dirt.jpg'),
			} );
		}


		let cube = new THREE.Mesh( geometry, materialboi );
		return cube;
}



setTimeout(afterLoading, 1000);
