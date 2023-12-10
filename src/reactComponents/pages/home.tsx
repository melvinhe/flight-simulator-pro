import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import * as dat from "dat.gui"; // Import dat.gui library

function Home() {
  const threeContainer = useRef(null);

  useEffect(() => {
    let keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

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
    const cubeMaterials = [
      "red",
      "green",
      "blue",
      "yellow",
      "magenta",
      "cyan",
    ].map((color) => new THREE.MeshLambertMaterial({ color }));
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

    const gui = new dat.GUI();

    const loader = new THREE.TextureLoader();
    const height = loader.load("/static/height.png");
    const texture = loader.load("/static/texture.jpg");

    const pointLight = new THREE.PointLight(0xffffff, 100);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    gui.add(pointLight.position, "x");
    gui.add(pointLight.position, "y");
    gui.add(pointLight.position, "z");

    const col = { color: "#00ff00" };
    gui.addColor(col, "color").onChange(() => {
      pointLight.color.set(col.color);
    });

    const generatePlane = (position) => {
      const planeGeometry = new THREE.PlaneGeometry(300, 300, 32, 32);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: "green",
        displacementMap: height,
        displacementScale: 15,
        side: THREE.DoubleSide,
      });
      const newPlane = new THREE.Mesh(planeGeometry, planeMaterial);
      newPlane.rotation.x = -Math.PI / 2;
      newPlane.position.y = -8;
      newPlane.position.x = position.x;
      newPlane.position.z = position.z;
      return newPlane;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const handleMouseMove = (event) => {
      const { movementX, movementY } = event;

      // Adjust the sensitivity to control the rotation speed
      const sensitivity = 0.002;

      camera.rotation.y -= movementX * sensitivity;
      camera.rotation.z -= movementY * sensitivity;

      // Clamp vertical rotation to avoid camera flipping
      camera.rotation.z = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x)
      );
    };

    const handleKeyDown = (event) => {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 87:
          keys.forward = true;
          break;
        case 83:
          keys.backward = true;
          break;
        case 65:
          keys.left = true;
          break;
        case 68:
          keys.right = true;
          break;
        case 32:
          keys.space = true;
          break;
        case 16:
          keys.shift = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      const keyCode = event.keyCode;
      switch (keyCode) {
        case 87:
          keys.forward = false;
          break;
        case 83:
          keys.backward = false;
          break;
        case 65:
          keys.left = false;
          break;
        case 68:
          keys.right = false;
          break;
        case 32:
          keys.space = false;
          break;
        case 16:
          keys.shift = false;
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
    
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);
      const up = new THREE.Vector3(0, 1, 0);
    
      const rotation = new THREE.Euler().setFromQuaternion(camera.quaternion);
      const position = camera.position;
    
      forward.applyEuler(rotation);
      right.applyEuler(rotation);
      up.applyEuler(rotation);
    
      if (keys.forward) {
        position.add(forward.multiplyScalar(speed));
      }
      if (keys.backward) {
        position.add(forward.multiplyScalar(-speed));
      }
      if (keys.left) {
        position.add(right.multiplyScalar(-speed));
      }
      if (keys.right) {
        position.add(right.multiplyScalar(speed));
      }
      if (keys.space) {
        position.add(up.multiplyScalar(speed));
      }
      if (keys.shift) {
        position.add(up.multiplyScalar(-speed));
      }
    
      const playerPosition = {
        x: position.x,
        y: position.y,
        z: position.z,
      };
    
      const distanceTraveled = 100;
    
      let terrain = scene.getObjectByName("terrain");
      if (
        !terrain ||
        Math.abs(playerPosition.x - terrain.position.x) > distanceTraveled ||
        Math.abs(playerPosition.z - terrain.position.z) > distanceTraveled
      ) {
        if (terrain) scene.remove(terrain);
    
        terrain = generatePlane(playerPosition);
        terrain.name = "terrain";
        scene.add(terrain);
      }
    
      renderer.render(scene, camera);
    };
    

    const lockPointer = () => {
      threeContainer.current.requestPointerLock();
    };

    threeContainer.current.addEventListener("click", lockPointer);

    animate();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      renderer.dispose();
      scene.remove(cube);
      scene.remove(terrain);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
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
