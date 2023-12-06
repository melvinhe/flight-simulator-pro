import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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
            control: false
        };

        // Three.js scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        // @ts-ignore
        threeContainer.current.appendChild(renderer.domElement);

        // const geometry = new THREE.BoxGeometry();
        const faceColors = [ 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan' ];
        const material = faceColors.map(color => { return new THREE.MeshLambertMaterial({ color: color })});
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(geometry, material);

        const planeGeometry = new THREE.PlaneGeometry(5, 5, 32 ,32);
        const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = Math.PI / 2;
        plane.position.y = -1.5;
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

        function handleKeyDown(event: { keyCode: any; }) {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case 87: keys.up = true; break;
                case 83: keys.down = true; break;
                case 65: keys.left = true; break;
                case 68: keys.right = true; break;
                case 32: keys.space = true; break;
                case 17: keys.control = true; break;
                default: break;
            }
        }

        function handleKeyUp(event: { keyCode: any; }) {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case 87: keys.up = false; break;
                case 83: keys.down = false; break;
                case 65: keys.left = false; break;
                case 68: keys.right = false; break;
                case 32: keys.space = false; break;
                case 17: keys.control = false; break;
                default: break;
            }
        }

        // @ts-ignore
        function updateCameraRotation(event) {
            if (!isMouseDown.current) return; // Only rotate when mouse is down

            const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

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
        renderer.domElement.addEventListener('click', () => {
            renderer.domElement.requestPointerLock();
        });

        // Listen for mouse movement events when pointer lock is active
        document.addEventListener('mousemove', updateCameraRotation, false);

        // Listen for mouse down and up events
        document.addEventListener('mousedown', onMouseDown, false);
        document.addEventListener('mouseup', onMouseUp, false);

        // Handle pointer lock change and error events
        document.addEventListener('pointerlockchange', handlePointerLockChange, false);
        document.addEventListener('pointerlockerror', handlePointerLockError, false);

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
            console.error('Error with Pointer Lock');
        }

        animate();

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup on unmount
        return () => {
            renderer.dispose();
            scene.remove(cube);
            scene.remove(plane);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="App" role="region">
            <div className={"threeContainer"} ref={threeContainer} />
        </div>
    );
}

export default Home;
