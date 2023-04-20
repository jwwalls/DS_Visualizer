import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import bg2 from "./bg_img/bg2.jpg";


export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

 function backgroundLoader(scene) {
  const loader = new THREE.TextureLoader();
const bgTexture = loader.load(bg2);
scene.background = bgTexture;
}
backgroundLoader(scene);





