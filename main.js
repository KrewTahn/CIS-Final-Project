var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var goingDown = true;

var spotLight = new THREE.DirectionalLight( 0xffffff , 0.5);
spotLight.position.set( 100, 1000, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );

var isClicked = 0;

var obj1;
var mousesX;
var mousesY;

camera.position.z = 20;
camera.position.y = 5;


document.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false);

// instantiate a loader
var MonkeyDude = new THREE.OBJLoader();

// load a resource
MonkeyDude.load(
	// resource URL
	'BorderCube.obj',
	// called when resource is loaded
	function ( object ) {


    object.traverse( function ( child ) {
    	if ( child instanceof THREE.Mesh ) {
          child.material.color.setHex(0xeeff00);
         }
    } );	
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
	var mouseX = window.innerWidth / 2 - mousesX;
    var mouseY = window.innerHeight / 2 - mousesY;
    obj1.rotation.y = -Math.PI*2*mouseX/window.innerWidth;
    // obj1.rotation.x = Math.PI*2*mouseY/window.innerHeight;
    obj1.updateMatrix();
}

function afterLoading() {
	// this becomes new main
	var floor = new THREE.BoxGeometry( 20, 1, 20 );
	var floormat = new THREE.MeshBasicMaterial( { color: 0xff0094 }  );

	let boundary = obj1.clone();
		boundary.scale.x = 1;
		boundary.scale.y = 1;
		boundary.scale.z = 1;
		boundary.position.y = 5
		boundary.rotation.z = 1.55;
		boundary.rotation.x = 1.6;
		scene.add(boundary);


		// Adding Cube With texture

		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var materialboi = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, materialboi );
		scene.add( cube );

	    animate();
}


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}


setTimeout(afterLoading, 1000);