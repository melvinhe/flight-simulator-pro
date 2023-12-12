import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import * as dat from "dat.gui";
import {Sky} from "three/examples/jsm/objects/Sky";

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
    let sky = new Sky();
    let sun = new THREE.Vector3();
    sky.scale.setScalar(500000);



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

    const generatePlane = (position: { x: any; y?: number; z: any; }) => {
      const planeGeometry = new THREE.PlaneGeometry(300, 300, 32, 32);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: "green",
        displacementMap: height,
        displacementScale: 10,
        side: THREE.DoubleSide,
        wireframe: false
      });
      const newPlane = new THREE.Mesh(planeGeometry, planeMaterial);
      newPlane.rotation.x = -Math.PI / 2;
      newPlane.position.y = -8;
      newPlane.position.x = position.x;
      newPlane.position.z = position.z;
      return newPlane;
    };

    // gui to toggle collision:
    let collision = true;
    gui.add({ collision }, 'collision').onChange((value) => {
        collision = value;
    });

    function deformTerrain(point: THREE.Vector3, plane: THREE.Mesh){
        if (collision){
            const planeGeometry = plane.geometry;
            const vertices = planeGeometry.attributes.position.array;
            const radius = 20;
            const intensity = 30;
            // console.log(collision);
            for (let i = 0; i < vertices.length; i += 3) {
                const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
                // console.log("hi");
                // console.log("vertex before: ", vertex.clone().toArray());
                let world = vertex.applyMatrix4(plane.matrixWorld);
                let worldPoint = new THREE.Vector3(...world.clone().toArray());
                // console.log("vertex after: ", worldPoint);
                const distance = point.distanceTo(worldPoint);
                // console.log(distance);

                if (distance < radius){
                    const deformAmount = intensity * (1 - distance / radius);
                    vertices[i + 2] -= deformAmount; // adjust the z-coord
                    // console.log("deform at: ", worldPoint);
                    // console.log("intersection at: ", point);
                }
            }
            planeGeometry.attributes.position.needsUpdate = true;

        }
    }
    

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
    
      const quaternion = new THREE.Quaternion();
      const euler = new THREE.Euler();
    
      euler.setFromQuaternion(camera.quaternion, 'YXZ');
    
      euler.y -= movementX * sensitivity;
      euler.x -= movementY * sensitivity;
    
      // Clamp vertical rotation to avoid camera flipping
      euler.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, euler.x)
      );
    
      quaternion.setFromEuler(euler, 'YXZ');
    
      camera.setRotationFromQuaternion(quaternion);
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
    // bool if crashed
    let crash = false;
    let speed = 0.15; //

    const animate = () => {
      if (crash){
        speed = 0.09;
        camera.translateZ(speed);    
      }
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
        
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);
      const up = new THREE.Vector3(0, 1, 0);
    
      const rotation = new THREE.Euler().setFromQuaternion(camera.quaternion);
      const position = camera.position;
    
      forward.applyEuler(rotation);
      right.applyEuler(rotation);
      up.applyEuler(rotation);

      const playerPosition = {
        x: position.x,
        y: position.y,
        z: position.z,
      };
      const clock = new THREE.Clock();
      const distanceTraveled = 100;
      let terrain = scene.getObjectByName("terrain") as THREE.Mesh | undefined;

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
        // @ts-ignore
        if (playerPosition.y > terrain.position.y + 8) {
          position.add(up.multiplyScalar(-speed));
        }
        // Limit downward movement when shift is pressed
        //const minY = terrain.position.y + 1; // Adjust this value as needed
        //position.y = Math.max(minY, position.y - up.y * speed);
      }
    
      
    
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
      sky.material.uniforms['turbidity'].value = effectController.turbidity;
      sky.material.uniforms['rayleigh'].value = effectController.rayleigh;
      sky.material.uniforms['mieCoefficient'].value = effectController.mieCoefficient;
      sky.material.uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

      const uniforms = sky.material.uniforms;
      uniforms['turbidity'].value = effectController.turbidity;
      uniforms['rayleigh'].value = effectController.rayleigh;
      uniforms['mieCoefficient'].value = effectController.mieCoefficient;
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
      const distance = 400000;
      uniforms['up'].value.copy( camera.up ).normalize();
      uniforms['sunPosition'].value.copy( sun );
      effectController.azimuth += 2 * clock.getDelta();
      if ( effectController.azimuth > 1 ) effectController.azimuth = 0;
      updateSun();

      // Raycaster & collision logic
      const raycaster = new THREE.Raycaster();
      const rayDir = new THREE.Vector3();

      camera.getWorldDirection(rayDir);
      raycaster.set(camera.position, rayDir);
      const intersects = raycaster.intersectObject(terrain);
      // if intersects:
      if (intersects.length > 0 && intersects[0].distance < 30){ 
          console.log("intersect with terrain, point: ", intersects[0].point);
          const point = intersects[0].point;
          crash = true;
          deformTerrain(point, terrain);
      }


      renderer.render(scene, camera);
    };
    

    const lockPointer = () => {
      // @ts-ignore
      threeContainer.current.requestPointerLock();
    };
    // @ts-ignore
    threeContainer.current.addEventListener("click", lockPointer);

    animate();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      renderer.dispose();
      scene.remove(cube);
      // scene.remove(terrain);
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
