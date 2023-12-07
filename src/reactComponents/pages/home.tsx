import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// MESH LOADER
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Home() {
  const threeContainer = useRef(null);
  const isMouseDown = useRef(false);

  useEffect(() => {
    let keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
      control: false,
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

    ////////////////////////////////////////////////////////////////////

    //Example 3D Mesh Loader

    const fbxLoader = new FBXLoader();
    //const GLTFLoader = new FBXLoader();

    // Load Model
    fbxLoader.load("src/models/airplane.fbx", (model) => {
      // Create a simple material
      const material = new THREE.MeshStandardMaterial({
        color: 0x7f7f7f,
      });

      // Apply this material to all child meshes in the model
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) { 
            child.material = material;
            child.castShadow = true;
          }
      });

      model.scale.set(0.05, 0.05, 0.05);

      scene.add(model);
    });

    // env
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(3, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // ground

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    ////////////////////////////////////////////////////////////////////

    camera.position.z = 5;
    camera.position.y = 1;

    const speed = 0.1; // Set motion speed
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (keys.up) {
        camera.translateZ(-speed);
      }
      if (keys.down) {
        camera.translateZ(speed);
      }
      if (keys.right) {
        camera.translateX(speed);
      }
      if (keys.left) {
        camera.translateX(-speed);
      }
      if (keys.space) {
        camera.translateY(speed);
      }
      if (keys.control) {
        camera.translateY(-speed);
      }
      // controls.update()
      renderer.render(scene, camera);
    };

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // controls.update();
    }

    function handleKeyDown(event: { keyCode: any }) {
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
        case 32:
          keys.space = true;
          break;
        case 17:
          keys.control = true;
          break;
        default:
          break;
      }
    }

    function handleKeyUp(event: { keyCode: any }) {
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
        case 32:
          keys.space = false;
          break;
        case 17:
          keys.control = false;
          break;
        default:
          break;
      }
    }

    // @ts-ignore
    function updateCameraRotation(event) {
      if (!isMouseDown.current) return; // Only rotate when mouse is down

      const movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      // Adjust these values based on your sensitivity preferences
      camera.rotation.y -= movementX * 0.002;
      camera.rotation.x -= movementY * 0.002;
    }

    // Mouse down event
    function onMouseDown() {
      isMouseDown.current = true;
    }

    // Mouse up event
    function onMouseUp() {
      isMouseDown.current = false;
    }

    // Enable pointer lock when clicking on the canvas
    renderer.domElement.addEventListener("click", () => {
      renderer.domElement.requestPointerLock();
    });

    // Listen for mouse movement events when pointer lock is active
    document.addEventListener("mousemove", updateCameraRotation, false);

    // Listen for mouse down and up events
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);

    // Handle pointer lock change and error events
    document.addEventListener(
      "pointerlockchange",
      handlePointerLockChange,
      false
    );
    document.addEventListener(
      "pointerlockerror",
      handlePointerLockError,
      false
    );

    function handlePointerLockChange() {
      // Logic when pointer lock changes
      if (document.pointerLockElement === renderer.domElement) {
        // Pointer Lock is active
      } else {
        // Pointer Lock is released
        isMouseDown.current = false;
      }
    }

    function handlePointerLockError() {
      console.error("Error with Pointer Lock");
    }

    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      //scene.remove(cube);
      //scene.remove(plane);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="App" role="region">
      <div className={"threeContainer"} ref={threeContainer} />
    </div>
  );
}

export default Home;
