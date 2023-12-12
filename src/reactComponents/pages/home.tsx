import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import {Sky} from "three/examples/jsm/objects/Sky";
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";

function Home() {
    const threeContainer = useRef(null);

    useEffect(() => {
        let simplex = new SimplexNoise();

        const loader = new THREE.TextureLoader();

        let tree1 = loader.load("src/assets/tree1.png");
        let tree2 = loader.load("src/assets/tree2.png");
        let rock1 = loader.load("src/assets/rock1.png");
        let rock2 = loader.load("src/assets/rock2.png");
        let rock3 = loader.load("src/assets/rock3.png");
        const makeObject = (texture: THREE.Texture, position: THREE.Vector3, size: number) => {
            const tree = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
            tree.scale.set(size, size, size);
            tree.position.copy(position);

            return tree;
        };

        let sky = new Sky();
        let sun = new THREE.Vector3();

        let keys = {
            view: false,
        };
        sky.scale.setScalar(500000);

        // Three.js scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true});
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

        // const geometry = new THREE.BoxGeometry();
        const faceColors = [ 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan' ];
        const material = faceColors.map(color => { return new THREE.MeshLambertMaterial({ color: color })});
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(geometry, material);
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        // scene.add(hemiLight);
        cube.castShadow = true;
        scene.add(cube);
        scene.add(sky);

        const terrainGeometry = new THREE.PlaneGeometry(2000, 2000, 256 ,256);
        var material2 = new THREE.MeshLambertMaterial({color: 0xffffff});
        var terrain = new THREE.Mesh( terrainGeometry, material2 );
        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -1.5;
        scene.add(terrain);

        const vertices = terrainGeometry.getAttribute('position').array;
        console.log(vertices)
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i+1];
            const z = vertices[i+2];

            const noiseValue = simplex.noise(x, y);
            if (noiseValue > 0.8) { // Adjust this threshold for tree density.
                const position = new THREE.Vector3(x, z+7, y);
                const treeType = Math.random() > 0.5 ? tree1 : tree2;
                const tree = makeObject(treeType, position, 20);
                scene.add(tree);
            } else if (noiseValue > 0.78) { // Adjust this threshold for rock density.
                const position = new THREE.Vector3(x, z+2, y);
                const rockTypeOptions = [rock1, rock2, rock3];
                const rockType = rockTypeOptions[Math.floor(Math.random() * rockTypeOptions.length)];
                const rock = makeObject(rockType, position, 10);
                scene.add(rock);
            }
        }


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
            renderer.render( scene, camera );
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
