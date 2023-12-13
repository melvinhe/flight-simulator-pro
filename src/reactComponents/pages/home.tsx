import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import * as dat from "dat.gui";
import {Sky} from "three/examples/jsm/objects/Sky";
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";


function Home() {
  const threeContainer = useRef(null);

  useEffect(() => {

    class SeededRandom {
      private seed: number;
      constructor(seed = 0) {
        this.seed = seed;
      }

      random() {
        // Example of a simple LCG
        const a = 1664525;
        const c = 1013904223;
        const m = 4294967296; // 2^32
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
      }
    }

// Instantiate your custom random number generator with a seed of 0
    const seededRandom = new SeededRandom(0);

// Now, pass this to the SimplexNoise constructor
    const simplex = new SimplexNoise(seededRandom);
    // let simplex = new SimplexNoise(Math.random);
    let keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    let sky = new Sky();
    let sun = new THREE.Vector3();
    sky.scale.setScalar(500000);



    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      300000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainer.current.appendChild(renderer.domElement);

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      inclination: 0.49, // default, elevation / inclination
      azimuth: 0.25, // Facing front,
      exposure: renderer.toneMappingExposure
    };

    function updateSun() {
      const theta = Math.PI * ( effectController.inclination - 0.5 );
      const phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
      sun.x = Math.cos( phi );
      sun.y = Math.sin( phi ) * Math.sin( theta );
      sun.z = Math.sin( phi ) * Math.cos( theta );

      sky.material.uniforms['sunPosition'].value.copy( sun );
      renderer.render( scene, camera );
    }

    updateSun();
    scene.add( sky );

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


    // scene.fog = new THREE.Fog(0xffffff, 200000, 500000);
    let size = 30000; // size of your terrain
    let quality = 1; // noise quality
    let maxHeight = 5000; // maximum height of a terrain feature

    const generatePlane = (position: { x: any; y: number; z: any; }) => {

      const planeGeometry = new THREE.PlaneGeometry(size, size, 500, 500);
      const vertices = planeGeometry.getAttribute('position').array;

      for (let i = 0; i < vertices.length; i+=3) {

        let x = (vertices[i] / size) + (position.x / size);
        let z = (vertices[i + 1] / size) + (-position.z / size);

        // Get the elevation value from the noise function
        let elevation = (
            simplex.noise(x * quality * 2, z * quality * 2) * 0.5 +
            simplex.noise(x * quality * 4, z * quality * 4) * 0.25 +
            simplex.noise(x * quality * 8, z * quality * 8) * 0.125
        );

        // Adjust y position based on noise height
        vertices[i + 2] = elevation * maxHeight;
      }

      // Notify Three.js that the positions have changed.
      planeGeometry.getAttribute('position').needsUpdate = true;

      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 'green',
        map: texture,
        side: THREE.DoubleSide,
        wireframe: false, // Enable wireframe view for debugging
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

    const handleMouseMove = (event: { movementX: any; movementY: any; }) => {
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

    const handleKeyDown = (event: { keyCode: any; }) => {
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

    const handleKeyUp = (event: { keyCode: any; }) => {
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


    let grid: any[] = [];
    const gridSize = 3;
    let playerGridPos = { x: 1, y: 1 }; // Player starts at the center of the grid

// Initialize the grid
    for (let x = 0; x < gridSize; x++) {
      grid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        let terrain = generatePlane({
          x: (x - playerGridPos.x) * size,
          y: 0,
          z: (y - playerGridPos.y) * size,
        });
        terrain.name = `terrain_${x}_${y}`;
        // @ts-ignore
        grid[x][y] = terrain;
        scene.add(terrain);
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    
      const speed = 5.1;
    
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

      const clock = new THREE.Clock();



      sky.material.uniforms['turbidity'].value = effectController.turbidity;
      sky.material.uniforms['rayleigh'].value = effectController.rayleigh;
      sky.material.uniforms['mieCoefficient'].value = effectController.mieCoefficient;
      sky.material.uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

      const uniforms = sky.material.uniforms;
      uniforms['turbidity'].value = effectController.turbidity;
      uniforms['rayleigh'].value = effectController.rayleigh;
      uniforms['mieCoefficient'].value = effectController.mieCoefficient;
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
      uniforms['up'].value.copy( camera.up ).normalize();
      uniforms['sunPosition'].value.copy( sun );
      effectController.azimuth += 2 * clock.getDelta();
      if ( effectController.azimuth > 1 ) effectController.azimuth = 0;
      updateSun();

      // Track the position in grid units, not world units
      let gridPositionX = Math.floor(position.x / size);
      let gridPositionY = Math.floor(position.z / size); // Assuming +Z is north


      // If the player has moved grid cell...
      let bufferZone = 0.4; // 40% of the grid size as buffer; adjust as needed

// If the player has moved to the buffer zone...
      if (Math.abs(gridPositionX - playerGridPos.x) > bufferZone || Math.abs(gridPositionY - playerGridPos.y) > bufferZone) {
        console.log('Player moved grid cell');
        console.log(gridPositionX, gridPositionY);
        console.log(playerGridPos.x, playerGridPos.y);

        // Calculate the delta movement
        let deltaX = gridPositionX - playerGridPos.x;
        let deltaY = gridPositionY - playerGridPos.y;

        // Update terrain based on new player position
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            // Calculate the new grid position for this terrain piece
            let newX = x - Math.floor(gridSize / 2) + gridPositionX;
            let newY = y - Math.floor(gridSize / 2) + gridPositionY;

            let terrainName = `terrain_${newX}_${newY}`;
            let terrain = scene.getObjectByName(terrainName);

            if (!terrain) {
              // Create a new terrain piece
              terrain = generatePlane({
                x: newX * size,
                y: 0,
                z: newY * size,
              });
              terrain.name = terrainName;
              scene.add(terrain);
            }
          }
        }

        let minX = gridPositionX - Math.floor(gridSize);
        let maxX = gridPositionX + Math.floor(gridSize);
        let minY = gridPositionY - Math.floor(gridSize);
        let maxY = gridPositionY + Math.floor(gridSize);

        // Iterate over all terrain pieces and remove the distant ones
        scene.children.forEach((child) => {
          if (child.name.startsWith("terrain_")) {
            let [_, childX, childY] = child.name.split("_").map(Number);
            if (childX < minX || childX > maxX || childY < minY || childY > maxY) {
              scene.remove(child);
              // If you have additional cleanup to do, like disposing of geometries or materials, do it here
            }
          }
        });

        // Update the player's grid position
        playerGridPos.x = gridPositionX;
        playerGridPos.y = gridPositionY;
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
