import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "../../styling/App.css";
import * as dat from "dat.gui"; // Import dat.gui library

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

    // Terrain Generation
    const gui = new dat.GUI(); // Create dat.GUI instance

    const loader = new THREE.TextureLoader();
    const height = loader.load("/static/height.png");
    const texture = loader.load("/static/texture.jpg");

    /*const planeGeometry = new THREE.PlaneGeometry(300, 300, 64, 64);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: "green",
      map: texture,
      displacementMap: height,
      displacementScale: 15,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -10;

    gui.add(plane.rotation, "x").min(0).max(2);*/

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

      const distanceTraveled = 100;
      const buffer = 5;

      let terrain = scene.getObjectByName("terrain");
      if (
        !terrain ||
        Math.abs(playerPosition.x) > terrain.position.x + distanceTraveled - buffer ||
        Math.abs(playerPosition.z) > terrain.position.z + distanceTraveled - buffer
      ) {
        if (terrain) scene.remove(terrain);

        terrain = generatePlane(playerPosition);
        terrain.name = "terrain";
        scene.add(terrain);
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
      scene.remove(terrain); // Update to remove terrain instead of plane
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
