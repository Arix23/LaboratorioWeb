// import './styleacertijo5.css'

//Se importan los componentes necesarios para la escena

import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { PMREMGenerator } from 'https://cdn.skypack.dev/three@0.136.0/src/extras/PMREMGenerator.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

//Elementos esenciales de la escena
var clock = new THREE.Clock();
var mixer;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const loader = new GLTFLoader();
renderer.setClearColor(0xffffff, 1)

//Import del objeto fountain
const objLoader = new OBJLoader();
//cargar el asset
objloader.load(
	// resource URL
	'assets/courtyard/courtyard/Castle Courtyard.obj',
	// called when resource is loaded
	function ( object ) {

		scene.add( object );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

//Creación del domo de cielo, para esto creamos una geometría esférica
// y añadimos nuestra textura de cielo

var skyGeo = new THREE.SphereGeometry(100000, 25, 25);
var textureLoader = new THREE.TextureLoader(),
  texture = textureLoader.load("/assets/sky/sky.jpg");

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(15, 15);

var material = new THREE.MeshBasicMaterial({
  map: texture,
});

// Se crea el cielo con la geometría y el material
var sky = new THREE.Mesh(skyGeo, material);
sky.material.side = THREE.BackSide;
scene.add(sky);

//Ajustes de cámara
camera.position.z = 30;
camera.position.y = 2


//Creación del pasto
//Se añade la textura
var loaderPlane = new THREE.TextureLoader();
const texturePasto = loaderPlane.load("/assets/pasto/Pasto.jpeg");
texturePasto.wrapS = THREE.RepeatWrapping;
texturePasto.wrapT = THREE.RepeatWrapping;
texturePasto.repeat.set(70, 70);

// Se genera el plano y se ajusta
const planeGeometry = new THREE.PlaneGeometry(300, 300, 10, 10);

planeGeometry.rotateX(-1.58);
const planeMaterial = new THREE.MeshBasicMaterial({ map: texturePasto });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.y = 0;
planeMesh.traverse(function (node) { if (node instanceof THREE.Mesh) { node.receiveShadow = true; } });
scene.add(planeMesh);

const shdowMaterial = new THREE.ShadowMaterial(); //material transparente en todos lados menos la sombra
shdowMaterial.opacity = 1;

const planeShadowMesh = new THREE.Mesh(planeGeometry, shdowMaterial); //otro plano con la textura de shadow
planeShadowMesh.position.y = 0;
planeShadowMesh.receiveShadow = true;
scene.add(planeShadowMesh);


renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;




//Añadimos un mapa de ambiente para la escena, para que funcionara la textura de la pokebola, tomando de base esta pregunta de stackoverflow:
//https://stackoverflow.com/questions/67183618/how-to-add-env-map-onto-gltf-object

const pmremGenerator = new PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', function (texture) {

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;

  scene.background = envMap;
  scene.environment = envMap;

  texture.dispose();
  pmremGenerator.dispose();



});
var mixer2;



//LUCES TEMPORALES
// Se añaden las luces a nuestra escena
var ambient = new THREE.AmbientLight(0xEC8950, 0.7);
const directionalLight = new THREE.DirectionalLight(0xDF834E, 0.5);
directionalLight.position.set(5, 10, -10);
var side = 100;
// Ajuste de las sombras
directionalLight.shadow.camera.top = side;
directionalLight.shadow.camera.bottom = -side;
directionalLight.shadow.camera.left = side;
directionalLight.shadow.camera.right = -side;
directionalLight.castShadow = true;
//  directionalLight.position.set(new THREE.Vector3(0,1,0));
scene.add(directionalLight);

scene.add(ambient);
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame( animate );

  var delta = clock.getDelta();

  if ( mixer ) mixer.update( delta );
  if ( mixer2 ) mixer2.update( delta );

  renderer.render( scene, camera );
}

function render() {
    renderer.setSize(962, 601)
    renderer.render(scene, camera);
    document.querySelector('#canvas').appendChild( renderer.domElement )
}

render();
animate();