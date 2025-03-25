// A simple Three.js setup file that can be imported into components

// Import Three.js from CDN for GitHub Pages compatibility
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';

// Basic scene setup
export function createScene(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  container.appendChild(renderer.domElement);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  
  return { scene, camera, renderer };
}

// Example: Create a cube
export function createCube(scene, color = 0x00ff00) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // Add some light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  return cube;
}

// Animation loop helper
export function createAnimationLoop(sceneObj, animateFn) {
  if (!sceneObj) return;
  
  const { scene, camera, renderer } = sceneObj;
  
  function animate() {
    requestAnimationFrame(animate);
    if (animateFn) animateFn();
    renderer.render(scene, camera);
  }
  
  animate();
} 