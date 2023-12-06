import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Home() {
  const threeContainer = useRef(null);

  useEffect(() => {
    let keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // @ts-ignore
    threeContainer.current.appendChild(renderer.domElement);

    const faceColors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'];
    const material = faceColors.map((color) => new THREE.MeshLambertMaterial({ color: color }));
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, material);

    const planeGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    const grassTexture = generateGrassTexture(); // Generate grass-like texture
    const planeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be flat on the ground
    plane.position.y = -2; // Lowering the plane closer to the ground
    cube.castShadow = true;
    scene.add(cube);
    scene.add(plane);

    const light = new THREE.PointLight(0xffffff, 10, 10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(0, 0, 2);
    light.castShadow = true;
    scene.add(light);
    scene.add(ambientLight);

    camera.position.z = 5;

    const speed = 0.1; // Set motion speed
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      if (keys.up) camera.position.z -= speed;
      if (keys.down) camera.position.z += speed;
      if (keys.left) camera.position.x -= speed;
      if (keys.right) camera.position.x += speed;

      renderer.render(scene, camera);
    };

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    function handleKeyDown(event) {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 87:
          keys.up = true;
          break;
        case 83:
          keys.down = true;
          break;
        case 65:
          keys.left = true;
          break;
        case 68:
          keys.right = true;
          break;
        default:
          break;
      }
    }

    function handleKeyUp(event) {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 87:
          keys.up = false;
          break;
        case 83:
          keys.down = false;
          break;
        case 65:
          keys.left = false;
          break;
        case 68:
          keys.right = false;
          break;
        default:
          break;
      }
    }

    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      scene.remove(cube);
      scene.remove(plane);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Function to generate perlin-noise grass texture
  const generateGrassTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Draw a simple grass-like texture using noise functions
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const value = Math.random() * 255;
        ctx.fillStyle = `rgb(0, ${Math.floor(value * 1.5)}, 0)`; // Vary the green color based on noise
        ctx.fillRect(x, y, 1, 1);
      }
    }

    return new THREE.CanvasTexture(canvas);
  };

  return (
    <div className="App" role="region">
      <div className={"threeContainer"} ref={threeContainer} />
    </div>
  );
}

export default Home;
