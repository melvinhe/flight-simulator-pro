import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import "../../styling/App.css";
import {Sky} from "three/examples/jsm/objects/Sky";
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";


function Home() {
    const threeContainer = useRef(null);
    const isMouseDown = useRef(false);

    //plane
    const airplaneModel = useRef<THREE.Object3D>(new THREE.Object3D()); // Store the airplane model reference
    const propellerRef = useRef<THREE.Object3D>(new THREE.Object3D()); // Store the propeller model reference
    const cameraOffset = new THREE.Vector3(0, 3, -5); // Desired offset from the airplane

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
    const powerToFOV = (p: number) =>
        Math.min(defaultFOV + (maxFOV - defaultFOV) * (p / maxPower), maxFOV);

    const lerpFactor = 0.05;

    const orbitControlsRef = useRef<OrbitControls | null>(null); // Ref for OrbitControls


    const cameraLookAtTarget = new THREE.Object3D();

    const turnRate = 0.05; // Rate of turn

    interface Settings {
        speed: number;
        airplaneRotationX: number;
        airplaneRotationY: number;
        airplaneRotationZ: number;
        cameraFOV: number;
    }

    class SeededRandom {
        private seed: number;

        constructor(seed = 0) {
            this.seed = seed;
        }

        random() {
            const a = 1664525;
            const c = 1013904223;
            const m = 4294967296; // 2^32
            this.seed = (a * this.seed + c) % m;
            return this.seed / m;
        }
    }

    useEffect(() => {


        const makeObject = (texture: THREE.Texture, position: THREE.Vector3, size: number) => {
            const tree = new THREE.Sprite(new THREE.SpriteMaterial({map: texture}));
            tree.scale.set(size, size, size);
            tree.position.copy(position);

            return tree;
        };

        const gui = new GUI();
        const settings: Settings = {
            speed: 0,
            airplaneRotationX: 0,
            airplaneRotationY: 0,
            airplaneRotationZ: 0,
            cameraFOV: 75,
        };

        // Add GUI controls
        gui.add(settings, "speed", 0, 10).onChange((value: number) => {
            speed = value;
        });
        gui
            .add(settings, "airplaneRotationX", -Math.PI, Math.PI)
            .onChange((value: number) => {
                if (airplaneModel.current) airplaneModel.current.rotation.x = value;
            });
        gui
            .add(settings, "airplaneRotationY", -Math.PI, Math.PI)
            .onChange((value: number) => {
                if (airplaneModel.current) airplaneModel.current.rotation.y = value;
            });
        gui
            .add(settings, "airplaneRotationZ", -Math.PI, Math.PI)
            .onChange((value: number) => {
                if (airplaneModel.current) airplaneModel.current.rotation.z = value;
            });
        gui.add(settings, "cameraFOV", 45, 90).onChange((value: number) => {
            camera.fov = value;
            camera.updateProjectionMatrix();
        });


        const seededRandom = new SeededRandom(0);

        const simplex = new SimplexNoise(seededRandom);
        let keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false,
            control: false,
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
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        // @ts-ignore
        threeContainer.current.appendChild(renderer.domElement);

        const modelLoader = new FBXLoader();

        // Load plane body
        modelLoader.load("src/assets/plane-body.fbx", (planeBody) => {
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

            planeBody.scale.set(3, 3, 3);

            airplaneModel.current = planeBody; // Reference
            airplaneModel.current.add(cameraLookAtTarget);
            cameraLookAtTarget.position.set(0, 0, 8);

            // Load the propeller model
            const secondaryModelLoader = new FBXLoader();
            secondaryModelLoader.load(
                "src/assets/airplane-keyshot2.fbx",
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

        const updatePlaneMovement = () => {
            if (!airplaneModel.current) return;

            // Define the base turn rate and speed step
            const baseTurnRate = 0.001;
            const speedStep = 0.1;
            const maxTurnRate = Math.PI / 2; // Maximum turn rate in radians (90 degrees)

            // Calculate the turn rate based on the current rotation around the Z-axis
            const currentZRotation = airplaneModel.current.rotation.z;
            const turnRate = baseTurnRate * (1 + Math.abs(currentZRotation));

            // Limit the turn rate to the maximum value
            const limitedTurnRate = Math.min(turnRate, maxTurnRate);

            // Determine the direction of the turn (left or right)
            let turnDirection = 0; // 0 for no turn, 1 for left, -1 for right


            // Check if the airplane's Z-axis rotation is non-zero
            if (Math.abs(currentZRotation) > Math.abs(.1)) {
                // Determine the turn direction based on the sign of rotation.z
                turnDirection = Math.sign(currentZRotation);
            }

            // Adjust the airplane's rotation based on the turn direction and limited turn rate
            airplaneModel.current.rotation.y -= limitedTurnRate * turnDirection;

            // Calculate the forward vector based on the current rotation
            const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(
                airplaneModel.current.quaternion
            );

            // Move the airplane forward in the direction of the forward vector
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

        const updateCameraView = () => {
            if (!airplaneModel.current) return;

            const targetPosition = cameraOffset.clone();
            targetPosition.applyMatrix4(airplaneModel.current.matrixWorld);
            camera.position.lerp(targetPosition, lerpFactor);
            camera.lookAt(airplaneModel.current.position);
        }


        const updatePropellerRotation = (delta: number) => {
            if (!propellerRef.current) return;

            const propellerRotationSpeed = speed * 50;
            propellerRef.current.rotation.z += propellerRotationSpeed * delta;
        };

        const resetAirplaneRotation = () => {
            if (!airplaneModel.current || isMouseDown.current || Date.now() - lastInteractionTime <= resetDelay) return;

            airplaneModel.current.rotation.x = THREE.MathUtils.lerp(airplaneModel.current.rotation.x, 0, resetSpeed);
            airplaneModel.current.rotation.z = THREE.MathUtils.lerp(airplaneModel.current.rotation.z, 0, resetSpeed);
        };

        function updateCameraFOV() {
            const targetFOV = powerToFOV(speed);
            camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, lerpFactor);
            camera.updateProjectionMatrix();
        }

        function updatePlaneRotation(event: MouseEvent) {
            if (!isMouseDown.current || !airplaneModel.current) return;

            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            const airplaneRotation = airplaneModel.current.rotation.clone(); // Make a copy of the current rotation

            // Calculate rotations relative to the airplane's local coordinate system
            const yawRotation = new THREE.Euler(0, -movementX * 0.002, 0);
            const pitchRotation = new THREE.Euler(movementY * 0.003, 0, 0);

            // Apply yaw and pitch rotations to the airplane's current rotation
            airplaneRotation.y += yawRotation.y;
            airplaneRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, airplaneRotation.x + pitchRotation.x));

            // Barrel roll: Rolls the airplane model when moving horizontally
            if (movementX !== 0) {
                airplaneRotation.z += movementX * 0.001;
            }

            // Apply the updated rotation to the airplane model
            airplaneModel.current.rotation.copy(airplaneRotation);
        }

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
            const theta = Math.PI * (effectController.inclination - 0.5);
            const phi = 2 * Math.PI * (effectController.azimuth - 0.5);
            sun.x = Math.cos(phi);
            sun.y = Math.sin(phi) * Math.sin(theta);
            sun.z = Math.sin(phi) * Math.cos(theta);

            sky.material.uniforms['sunPosition'].value.copy(sun);
            renderer.render(scene, camera);
        }

        updateSun();
        scene.add(sky);

        const light = new THREE.PointLight(0xffffff, 10, 10);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        light.position.set(0, 0, 2);
        light.castShadow = true;
        scene.add(light);
        scene.add(ambientLight);

        camera.position.z = 5;


        const loader = new THREE.TextureLoader();
        const texture = loader.load("/static/texture.jpg");
        let tree1 = loader.load("src/assets/tree1.png");
        let tree2 = loader.load("src/assets/tree2.png");
        let rock1 = loader.load("src/assets/rock1.png");
        let rock2 = loader.load("src/assets/rock2.png");
        let rock3 = loader.load("src/assets/rock3.png");


        // scene.fog = new THREE.Fog(0xffffff, 200000, 500000);
        let size = 30000; // size of your terrain
        let quality = 1; // noise quality
        let maxHeight = 500; // maximum height of a terrain feature

        const generatePlane = (position: { x: any; y: number; z: any; }) => {

            const planeGeometry = new THREE.PlaneGeometry(size, size, 500, 500);
            const vertices = planeGeometry.getAttribute('position').array;

            for (let i = 0; i < vertices.length; i += 3) {

                let x = (vertices[i] / size) + (position.x / size);
                let z = (vertices[i + 1] / size) + (-position.z / size);

                // Get the elevation value from the noise function
                let elevation = (
                    simplex.noise(x * quality * 2, z * quality * 2) * 1.2 +
                    simplex.noise(x * quality * 4, z * quality * 4) * 0.4 +
                    simplex.noise(x * quality * 8, z * quality * 8) * 0.2 +
                    simplex.noise(x * quality * 16, z * quality * 16) * 0.14 +
                    simplex.noise(x * quality * 32, z * quality * 32) * 0.06
                );

                // Adjust y position based on noise height
                vertices[i + 2] = elevation * maxHeight;

                let itemX = vertices[i];
                let itemY = vertices[i + 1];
                let itemZ = vertices[i + 2];

                // const noiseValue = simplex.noise(itemX, itemY);
                // if (noiseValue > 0.95) { // Adjust this threshold for tree density.
                //   const position = new THREE.Vector3(itemX, itemZ + 7, itemY);
                //   const treeType = Math.random() > 0.5 ? tree1 : tree2;
                //   const tree = makeObject(treeType, position, 20);
                //   scene.add(tree);
                //   // } else if (noiseValue > 0.78) { // Adjust this threshold for rock density.
                //   //   // const position = new THREE.Vector3(x, z+2, y);
                //   //   const rockTypeOptions = [rock1, rock2, rock3];
                //   //   const rockType = rockTypeOptions[Math.floor(Math.random() * rockTypeOptions.length)];
                //   //   const rock = makeObject(rockType, position, 10);
                //   //   scene.add(rock);
                //   // }
                // }
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
            const {movementX, movementY} = event;

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


        let grid: any[] = [];
        const gridSize = 3;
        let playerGridPos = {x: 1, y: 1}; // Player starts at the center of the grid

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
        const clock = new THREE.Clock();
        clock.start();
        const animate = () => {
            requestAnimationFrame(animate);
            const speed = 5.1;

            const position = camera.position;

            sky.material.uniforms['turbidity'].value = effectController.turbidity;
            sky.material.uniforms['rayleigh'].value = effectController.rayleigh;
            sky.material.uniforms['mieCoefficient'].value = effectController.mieCoefficient;
            sky.material.uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

            const uniforms = sky.material.uniforms;
            uniforms['turbidity'].value = effectController.turbidity;
            uniforms['rayleigh'].value = effectController.rayleigh;
            uniforms['mieCoefficient'].value = effectController.mieCoefficient;
            uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
            uniforms['up'].value.copy(camera.up).normalize();
            uniforms['sunPosition'].value.copy(sun);
            effectController.azimuth += 0.004 * clock.getDelta();
            if (effectController.azimuth > 1) effectController.azimuth = 0
            updateSun();

            // Track the position in grid units, not world units
            let gridPositionX = Math.floor(position.x / size);
            let gridPositionY = Math.floor(position.z / size); // Assuming +Z is north


            // If the player has moved grid cell...
            let bufferZone = 0.4; // 40% of the grid size as buffer; adjust as needed

// If the player has moved to the buffer zone...
            if (Math.abs(gridPositionX - playerGridPos.x) > bufferZone || Math.abs(gridPositionY - playerGridPos.y) > bufferZone) {

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
                            // If you have additional cleanup to do, like disposing of geometries or materials, do it
                            // here
                        }
                    }
                });

                // Update the player's grid position
                playerGridPos.x = gridPositionX;
                playerGridPos.y = gridPositionY;
            }
            updatePlaneMovement();
            updateCameraView();
            updatePropellerRotation(clock.getDelta());
            resetAirplaneRotation();

            power = Math.max(0, Math.min(power, maxPower));
            camera.updateProjectionMatrix();
            updateCameraFOV();

            if (orbitControlsRef.current && orbitControlsRef.current.enabled) {
                orbitControlsRef.current.update();
            }
            renderer.render(scene, camera);
        };


        function handleKeyDown(event: KeyboardEvent) {
            switch (event.key) {
                case "ArrowUp":
                    speed = Math.min(speed + 1, 10);
                    break;
                case "ArrowDown":
                    speed = Math.max(speed - 1, 1);
                    break;
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
        document.addEventListener("mousemove", updatePlaneRotation, false);

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

        return () => {
            renderer.dispose();
            window.removeEventListener("resize", handleResize);
            // window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="App" role="region">
            <div className={"threeContainer"} ref={threeContainer}/>
        </div>
    );
}

export default Home;
