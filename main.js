let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// let cube = new THREE.Mesh( geometry, material );

let light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

let goingDown = true;
let ball = null;
let cube = null;

let spotLight = new THREE.DirectionalLight( 0xffffff , 0.5);
spotLight.position.set( 100, 1000, 100 );

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

document.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false);

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
          child.material.color.setHex(0xeeff00);
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

	let boundary = obj1.clone();
		boundary.scale.x = 1;
		boundary.scale.y = 1;
		boundary.scale.z = 1;
		boundary.position.y = 5
		boundary.rotation.z = 1.55;
		boundary.rotation.x = 1.6;
		scene.add(boundary);


// 		// Adding Cube With texture

		let geometry = new THREE.BoxGeometry( 1, 1, 1 );
		let materialboi = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, materialboi );
		scene.add( cube );

    geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
		let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		ball = new THREE.Mesh( geometry, material );
		scene.add( ball );

	  animate();
}



document.addEventListener('keydown',onDocumentKeyDown,false);
function onDocumentKeyDown(event){
		let delta = 1;
		event = event || window.event;
		let keycode = event.keyCode;
		switch(keycode){
				case 37 : //left arrow
				//camera.position.x = camera.position.x - delta;
				cube.position.x = cube.position.x - delta;
				break;
				case 38 : // up arrow
				//camera.position.y = camera.position.y - delta;
				//cube.position.x = cube.position.x - delta;
				break;
				case 39 : // right arrow
				//camera.position.x = camera.position.x + delta;
				cube.position.x = cube.position.x + delta;
				break;
				case 40 : //down arrow
				//camera.position.y = camera.position.y + delta;
				break;
		}
		document.addEventListener('keyup',onDocumentKeyUp,false);
}
function onDocumentKeyUp(event){
	//document.removeEventListener('keydown',onDocumentKeyDown,false);
}


let ballX = 0.1;
let ballY = -0.1;
let ballZ = 0;

function ballPhysics(ball) {

	ball.position.x += ballX
	ball.position.y += ballY
	ball.position.z += ballZ
	//console.log(ball.position.y);

	if (ball.position.y < 0 || ball.position.y > 10) {
		ballY = ballY * -1;
	}
	if (ball.position.x < -5 || ball.position.x > 5) {
		ballX = ballX * -1;
		//console.log("Hit!!");
	}


};

function animate() {
	requestAnimationFrame( animate );
  ballPhysics(ball);
	renderer.render( scene, camera );
}


setTimeout(afterLoading, 1000);
