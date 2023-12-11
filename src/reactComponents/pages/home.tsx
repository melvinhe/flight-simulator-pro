import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";

// MESH LOADER
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//hdri
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

function Home() {
  const threeContainer = useRef(null);
  const isMouseDown = useRef(false);

  //plane
  const airplaneModel = useRef<THREE.Object3D>(new THREE.Object3D()); // Store the airplane model reference
  const propellerRef = useRef<THREE.Object3D>(new THREE.Object3D()); // Store the propeller model reference
  const cameraOffset = new THREE.Vector3(0, 5, -5); // Desired offset from the airplane

  //reset position
  let lastInteractionTime = Date.now();
  const resetDelay = 3000; // 3 seconds delay
  const resetSpeed = 0.05; // Speed of rotation reset

  // speed factor
  let speed = 0; // Current speed step (1-10)
  const speedStep = 0.01; // Speed increase per step

  const maxFOV = 90; // Maximum FOV for zoom out
  const minFOV = 45; // Minimum FOV for zoom in
  const defaultFOV = 75; // Default field of view
  const maxPower = 5; // Maximum power when holding 'W'
  let power = 0; // Current power
  const powerIncreaseRate = 1; // Rate at which power increases per second
  const powerDecreaseRate = 0.5; // Rate at which power decreases per second
  const powerToFOV = (p: number) =>
    Math.min(defaultFOV + (maxFOV - defaultFOV) * (p / maxPower), maxFOV);

  const lerpFactor = 0.05;

  const orbitControlsRef = useRef<OrbitControls | null>(null); // Ref for OrbitControls

  let isFirstPersonView = false;

  const cameraLookAtTarget = new THREE.Object3D();

  interface Settings {
    speed: number;
    airplaneRotationX: number;
    airplaneRotationY: number;
    airplaneRotationZ: number;
    cameraFOV: number;
    
  }

  const toggleFirstPersonView = () => {
    isFirstPersonView = !isFirstPersonView;
  };

  useEffect(() => {
    const clock = new THREE.Clock();
    let keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
      control: false,
    };

    // dat.GUI setup
    const gui = new GUI();
    const settings: Settings = {
      speed: 0,
      airplaneRotationX: 0,
      airplaneRotationY: 0,
      airplaneRotationZ: 0,
      cameraFOV: 75
    };

    // Add GUI controls
    // Add GUI controls
    gui.add(settings, 'speed', 0, 10).onChange((value: number) => {
      speed = value;
    });
    gui.add(settings, 'airplaneRotationX', -Math.PI, Math.PI).onChange((value: number) => {
      if (airplaneModel.current) airplaneModel.current.rotation.x = value;
    });
    gui.add(settings, 'airplaneRotationY', -Math.PI, Math.PI).onChange((value: number) => {
      if (airplaneModel.current) airplaneModel.current.rotation.y = value;
    });
    gui.add(settings, 'airplaneRotationZ', -Math.PI, Math.PI).onChange((value: number) => {
      if (airplaneModel.current) airplaneModel.current.rotation.z = value;
    });
    gui.add(settings, 'cameraFOV', 45, 90).onChange((value: number) => {
      camera.fov = value;
      camera.updateProjectionMatrix();
    });
    
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

    //3D Mesh Loader

    const modelLoader = new FBXLoader();

    // Load plane body
    modelLoader.load("src/models/plane-body.fbx", (planeBody) => {
      const body = planeBody.getObjectByName("body");
      const windows = planeBody.getObjectByName("windows");
      const wheels = planeBody.getObjectByName("wheels");
      const cockpit = planeBody.getObjectByName("wheels");

      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        metalness: 0.8,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.02,
      });

      const windowsMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0,
        transmission: 1.0,
      });

      const wheelsMaterial = new THREE.MeshStandardMaterial({
        color: 0x404040,
        metalness: 1.0,
        roughness: 0.5,
      });

      // Assign materials to the corresponding objects
      if (body) {
        body.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = bodyMaterial;
          }
        });
      }

      if (windows) {
        windows.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = windowsMaterial;
          }
        });
      }

      if (wheels) {
        wheels.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = wheelsMaterial;
          }
        });
      }
      if (cockpit) {
        cockpit.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = wheelsMaterial;
          }
        });
      }

      planeBody.scale.set(1, 1, 1);

      airplaneModel.current = planeBody; // Reference
      airplaneModel.current.add(cameraLookAtTarget);
      cameraLookAtTarget.position.set(0, 0, 8);

      // Load the propeller model
      const secondaryModelLoader = new FBXLoader();
      secondaryModelLoader.load(
        "src/models/airplane-keyshot2.fbx",
        (propeller) => {
          // Set initial propeller transformations
          propeller.scale.set(1, 1, 1);
          propeller.rotation.set(0, 0, 0);

          // Create a group to act as the pivot point
          const propellerGroup = new THREE.Group();

          // Adjust propeller position within the group to offset the pivot
          // Change these values to match your desired offset
          propeller.position.set(0, 0, 0); // Example offset

          // Add the propeller to the group
          propellerGroup.add(propeller);

          // Keep a reference to the propeller for animation
          propellerRef.current = propellerGroup;

          // Add the pivot group as a child of the plane body
          // You can adjust the position of propellerGroup if needed
          planeBody.add(propellerGroup);

          // Create an instance of OrbitControls
          const orbitControls = new OrbitControls(camera, renderer.domElement);
          orbitControls.enableDamping = true; // Enable damping for smooth camera movement
          orbitControls.dampingFactor = 0.05; // Adjust damping factor as needed
          orbitControls.enabled = false; // Initially, disable the OrbitControls
        }
      );

      scene.add(planeBody);
    });

    //hdri

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    const hdriLoader = new RGBELoader();
    hdriLoader.load("src/textures/env.hdr", function (texture) {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose();
      scene.environment = envMap;
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

    // Add Grid Helper
    const gridSize = 100;
    const gridDivisions = 100;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
    scene.add(gridHelper);

    // Add Axes Helper
    const axesHelper = new THREE.AxesHelper(50); // Length of 50 units
    scene.add(axesHelper);

    // ground

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // handles plane pitch on low speed

    const tippingThreshold = 5; // Speed threshold for starting to tip down
    const maxPitchAngle = Math.PI / 6; // Maximum downward pitch angle

    const updatePlaneMovement = () => {
      if (!airplaneModel.current) return;

      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(
        airplaneModel.current.quaternion
      );
      airplaneModel.current.position.addScaledVector(
        forward,
        speed * speedStep
      );

      // Ensure the cameraOffset is correctly positioned relative to the airplane model
      const targetPosition = airplaneModel.current.position
        .clone()
        .add(
          cameraOffset.clone().applyQuaternion(airplaneModel.current.quaternion)
        );

      // Check if the target position is too close or too far
      console.log("Target Position: ", targetPosition);

      // Interpolate the camera position towards the target position
      camera.position.lerp(targetPosition, lerpFactor);

      // Check if the camera is too close to the model
      if (camera.position.distanceTo(airplaneModel.current.position) < 1) {
        console.error("Camera is too close to the model.");
      }

      // Interpolate the camera rotation towards the target rotation
      const targetRotation = airplaneModel.current.quaternion.clone();
      camera.quaternion.slerp(targetRotation, lerpFactor);

      camera.lookAt(airplaneModel.current.position);



      //fire 

      const createFireEffect = () => {
        const particles = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
      
        for (let i = 0; i < particles; i++) {
          // positions
          positions.push((Math.random() - 0.5) * 2);
          positions.push((Math.random() - 0.5) * 2);
          positions.push((Math.random() - 0.5) * 2);
      
          // colors
          colors.push(1, 0.4, 0); // fire-like color
        }
      
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
        const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });
        const particleSystem = new THREE.Points(geometry, material);
      
        return particleSystem;
      };

      //orbit test

      // Create an instance of OrbitControls
      const orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.05;
      orbitControls.enabled = false;

      // Assign the instance to the ref
      orbitControlsRef.current = orbitControls;

      // Add event listener to enable OrbitControls when 'o' key is pressed
      const handleOrbitKeyPress = (event: KeyboardEvent) => {
        if (event.key === "o" && orbitControlsRef.current) {
          orbitControlsRef.current.enabled = !orbitControlsRef.current.enabled;
        }
      };

      document.addEventListener("keydown", handleOrbitKeyPress);
    };
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      updatePlaneMovement();
      if (airplaneModel.current) {
        const firstPersonCameraPosition = new THREE.Vector3(0, 0.3, 2.65);
        if (isFirstPersonView) {
          // Update camera position and orientation in first-person view
          const fpPosition = airplaneModel.current.localToWorld(
            firstPersonCameraPosition.clone()
          );
          camera.position.copy(fpPosition);

          // Orient the camera to look at the invisible target object
          const targetWorldPosition = cameraLookAtTarget.getWorldPosition(
            new THREE.Vector3()
          );
          camera.lookAt(targetWorldPosition);
        } else {
          // If not in first-person view, handle camera position normally
          const targetPosition = cameraOffset.clone();
          targetPosition.applyMatrix4(airplaneModel.current.matrixWorld);
          camera.position.lerp(targetPosition, lerpFactor);
          camera.lookAt(airplaneModel.current.position);
        }
      }

      //aniamte
      if (orbitControlsRef.current && orbitControlsRef.current.enabled) {
        orbitControlsRef.current.update();
      }

      if (
        !isMouseDown.current &&
        Date.now() - lastInteractionTime > resetDelay &&
        airplaneModel.current
      ) {
        // Interpolate towards the default rotation
        airplaneModel.current.rotation.x = THREE.MathUtils.lerp(
          airplaneModel.current.rotation.x,
          0,
          resetSpeed
        );
        airplaneModel.current.rotation.y = THREE.MathUtils.lerp(
          airplaneModel.current.rotation.y,
          0,
          resetSpeed
        );
        airplaneModel.current.rotation.z = THREE.MathUtils.lerp(
          airplaneModel.current.rotation.z,
          0,
          resetSpeed
        );
      }

      const delta = clock.getDelta(); // Assuming you have a THREE.Clock instance

      if (propellerRef.current) {
        // Propeller rotation speed directly based on power
        // Remove the base speed (0.5) to ensure propeller stops when power is 0
        const propellerRotationSpeed = speed * 5; // Adjust multiplier as needed
        propellerRef.current.rotation.z += propellerRotationSpeed * delta;
      }

      // Clamp power to valid range
      power = Math.max(0, Math.min(power, maxPower));

      camera.updateProjectionMatrix();
      updateCameraFOV();
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

    function updateCameraFOV() {
      const targetFOV = powerToFOV(speed);
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, lerpFactor);
      camera.updateProjectionMatrix();
    }

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowUp":
          speed = Math.min(speed + 1, 10);
          break;
        case "ArrowDown":
          speed = Math.max(speed - 1, 1);
          break;
        case "f":
          toggleFirstPersonView();
          break;
      }
    }

    function handleKeyUp(event: { keyCode: any }) {
      // switch (event.keyCode) {
      //   case 87: // 'W' key
      //     isWPressed = false;
      //     break;
      // }
    }

    // @ts-ignore
    function updateCameraRotation(event: MouseEvent) {
      if (!isMouseDown.current || !airplaneModel.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      // Yaw and pitch adjustment
      airplaneModel.current.rotation.y -= movementX * 0.002;
      let newPitch = airplaneModel.current.rotation.x + movementY * 0.003;
      newPitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, newPitch));
      airplaneModel.current.rotation.x = newPitch;

      // Barrel roll: Rolls the airplane model when moving horizontally
      if (movementX !== 0) {
        airplaneModel.current.rotation.z -= movementX * 0.003;
      }
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
    window.addEventListener("keydown", handleKeyDown);

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