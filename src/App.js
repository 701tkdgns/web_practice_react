import React, { useEffect, useRef } from "react";
import * as THREE from 'three'
import { SpriteMaterial } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css'


let scene, camera, renderer;
let controls;
let texture, geometry, material, sphere;
let spriteMap, spriteMaterial;
let tooltip
let container = document.body;
const rayCaster = new THREE.Raycaster();
let tooltipActive = false;


const init = () => {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(-1, 0, 0);

    texture = new THREE.TextureLoader().load('assets/bg.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1

    geometry = new THREE.SphereGeometry(50, 32, 32);
    material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = .2;


}

const addtooltip = (position, name) => {
    spriteMap = new THREE.TextureLoader().load('assets/icon/mark.svg');
    spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name;
    sprite.position.copy(position.clone().normalize().multiplyScalar(30));
    sprite.scale.multiplyScalar(1);
    scene.add(sprite);
}

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

const onClick = (e) => {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    )

    rayCaster.setFromCamera(mouse, camera);
    let intersects = rayCaster.intersectObjects(scene.children);
    intersects.forEach(function (intersect) {
        if (intersect.type === "Sprite") {
            console.log(intersect.object.name)
        }
    });

    // let intersect = rayCaster.intersectObject(sphere);
    // if (intersect.length > 0){
    //     console.log(intersect[0].point)
    //     addtooltip(intersect[0].point)
    // }
}

const onMouseMove = (e) => {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    );

    rayCaster.setFromCamera(mouse, camera);
    let foundSprite = false;
    let intersects = rayCaster.intersectObjects(scene.children);

    intersects.forEach(function (intersect) {
        if (intersect.object.type === "Sprite") {
            let p = intersect.object.position.clone().project(camera)
            tooltip.current.style.top = ((-1 * p.y + 1) * window.innerHeight / 2) + 'px';
            tooltip.current.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px';
            tooltip.current.classList.add('is-active');
            tooltip.current.innerHTML = intersect.object.name;
            tooltipActive = true;
            foundSprite = true;
        }
    });

    if (foundSprite === false && tooltipActive) {
        tooltip.current.classList.remove('is-active');
    }
}



const App = () => {

    tooltip = useRef();

    useEffect(() => {
        init();
        controls.update();
        animate();
        addtooltip(new THREE.Vector3(45.74560667759029, 18.238863527915008, 7.804919077260923), 'Entry')

        window.addEventListener("resize", onResize);
        container.addEventListener("click", onClick);
        container.addEventListener("mousemove", onMouseMove);
    }, []);

    return (
        <div className="tooltip" ref={tooltip}>
            Demo
        </div>
    );
}

export default App;
