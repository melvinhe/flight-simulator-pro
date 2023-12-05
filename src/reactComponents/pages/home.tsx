import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../../styling/App.css";

function Home() {
    const threeContainer = useRef(null);

    useEffect(() => {
        // Three.js scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        threeContainer.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup on unmount
        return () => {
            renderer.dispose();
            scene.remove(cube);
        };
    }, []);

    return (
        <div className="App" role="region">
            Testing simple Three.js scene setup
            <div ref={threeContainer} />
        </div>
    );
}

export default Home;
