import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

function Home() {
    const threeContainer = useRef(null);

    useEffect(() => {
        let keys = {
            view: false,
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

        cube.castShadow = true;
        scene.add(cube);

        const terrainGeometry = new THREE.PlaneGeometry(2000, 2000, 256 ,256);
        var material2 = new THREE.MeshLambertMaterial({color: 0xffffff});
        var terrain = new THREE.Mesh( terrainGeometry, material2 );
        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -1.5;
        scene.add(terrain);

        const light = new THREE.PointLight(0xffffff, 10, 10);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        light.position.set(0, 0, 2);
        light.castShadow = true;
        scene.add(light);
        scene.add(ambientLight);

        camera.position.z = 5;
        let lookAtCube = false;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            controls.activeLook = controls.mouseDragOn;
            controls.update(clock.getDelta());

            if (lookAtCube) {
                // Interpolate camera rotation towards cube
                camera.position.lerp(cube.position, 0.005);
                camera.lookAt(cube.position);
                const distance = camera.position.distanceTo(cube.position)
                if (distance < 10.02) {
                    lookAtCube = false; // stop the transition
                }
            }
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        };

        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            controls.handleResize();
        }

        const controls = new FirstPersonControls(camera, renderer.domElement);
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        controls.movementSpeed = 20;
        controls.lookSpeed = 0.07;
        const clock = new THREE.Clock();

        let pressedOnce = false;
        function handleKeyDown(event: { keyCode: any; }) {
            switch (event.keyCode) {
                case 86:
                    if (!pressedOnce) {
                        pressedOnce = true;
                        orbitControls.enabled = false;
                        controls.enabled = true;
                        lookAtCube = false;
                    } else {
                        pressedOnce = false;
                        orbitControls.enabled = true;
                        controls.enabled = false;
                        lookAtCube = true;
                    }
                    break;
            }
        }

        function handleKeyUp(event: { keyCode: any; }) {
            switch (event.keyCode) {
                case 86:
                    break;
            }
        }

        animate();

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup on unmount
        return () => {
            renderer.dispose();
            scene.remove(cube);
            scene.remove(terrain);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="App" role="region">
            <div className={"threeContainer"} ref={threeContainer} />
        </div>
    );
}

export default Home;
