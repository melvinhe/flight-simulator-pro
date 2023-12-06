import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";

function Home() {
    const threeContainer = useRef(null);

    useEffect(() => {
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

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 2);
        light.castShadow = true;
        scene.add(light);

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        function handleResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        animate();

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            renderer.dispose();
            scene.remove(cube);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="App" role="region">
            <div className={"threeContainer"} ref={threeContainer} />
        </div>
    );
}

export default Home;
