import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../../styling/App.css";

function Home() {
  const threeContainer = useRef(null);

  useEffect(() => {
    let keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.current.appendChild(renderer.domElement);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterials = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan'].map(color => new THREE.MeshLambertMaterial({ color }));
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    cube.castShadow = true;
    scene.add(cube);

    const light = new THREE.PointLight(0xffffff, 10, 10);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(0, 0, 2);
    light.castShadow = true;
    scene.add(light);
    scene.add(ambientLight);

    camera.position.z = 5;

    const generateGrassTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 512;
      const ctx = canvas.getContext("2d");

      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const value = Math.random() * 255;
          ctx.fillStyle = `rgb(0, ${Math.floor(value * 1.5)}, 0)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      return new THREE.CanvasTexture(canvas);
    };

    const generatePlane = (position) => {
      const planeGeometry = new THREE.PlaneGeometry(30, 30, 32, 32);
      const grassTexture = generateGrassTexture();
      const planeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -2;
      plane.position.x = position.x;
      plane.position.z = position.z;
      return plane;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const controls = new OrbitControls(camera, renderer.domElement);

    const handleKeyDown = (event) => {
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
    };

    const handleKeyUp = (event) => {
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
    };

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      const speed = 0.1;

      if (keys.up) {
        camera.position.z -= speed;
      }
      if (keys.down) {
        camera.position.z += speed;
      }
      if (keys.left) {
        camera.position.x -= speed;
      }
      if (keys.right) {
        camera.position.x += speed;
      }

      const playerPosition = { x: camera.position.x, z: camera.position.z };

      const planeSize = 30;
      const buffer = 5;

      let plane = scene.getObjectByName("plane");
      if (!plane || Math.abs(playerPosition.x) > plane.position.x + planeSize - buffer || Math.abs(playerPosition.z) > plane.position.z + planeSize - buffer) {
        if (plane) scene.remove(plane);

        plane = generatePlane(playerPosition);
        plane.name = "plane";
        scene.add(plane);
      }

      renderer.render(scene, camera);
    };

    animate();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      renderer.dispose();
      scene.remove(cube);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="App" role="region">
      <div className={"threeContainer"} ref={threeContainer} />
    </div>
  );
}

export default Home;
