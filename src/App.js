import React, { useEffect } from "react";
import * as THREE from 'three';
import { Vector3 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';

let scene, camera, renderer, controls;
let sphere;
let geometry, material;
let rayCaster = new THREE.Raycaster();
const container = document.body;
const tooltip = document.querySelector(".tooltip");
let tooltipActive = false


function init() {



    // Scene & Camera >> r3f Canvas equal

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-1, 0, 0);

    geometry = new THREE.SphereGeometry(50, 32, 32);

    const texture = new THREE.TextureLoader().load('assets/bg.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1

    material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    // Render

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = -0.2

    addTooltip(new THREE.Vector3(46.162363205634435, 13.368448186383937, 12.841241779033579), "enter")
    window.addEventListener("resize", onResize);
    container.addEventListener("click", onclick);
    container.addEventListener("mousemove", onmousemove);
}



// add Tooltip
function addTooltip(position, name) {
    let spriteMap = new THREE.TextureLoader().load('assets/icons/bars-solid.svg');
    let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name
    // let position = new THREE.Vector3(40, 0, 0);
    sprite.position.copy(position.clone().normalize().multiplyScalar(30));
    sprite.scale.multiplyScalar(2);
    scene.add(sprite);
}


// 지표 
function onclick(e) {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    );
    console.log(mouse)


    rayCaster.setFromCamera(mouse, camera);
    // let intersects = rayCaster.intersectObjects(scene.children);


    let intersects = rayCaster.intersectObject(sphere);
    intersects.forEach(function (intersect) {
        if (intersect.object.type === "Sprite") {
            // console.log(intersect.object.name)
        }
    })
    console.log(intersects)
    // if (intersects.length > 0) {
    //     console.log(intersects[0].point)
    //     addTooltip(intersects[0].point)
    // }
    // debugger
}

function onmousemove(e) {
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    );

    rayCaster.setFromCamera(mouse, camera);
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children);
    intersects.forEach(function (intersect) {
        if (intersect.object.type === "Sprite") {
            let p = intersect.object.position.clone().project(camera);
            // tooltip.style.top = ((-1 * p.y + 1) * window.innerHeight) + 'px';
            // tooltip.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px';
            tooltip.classList.add("is-active");
            tooltipActive = true
            foundSprite = true
        }
    })

    if (foundSprite === false && tooltipActive){
        tooltip.classList.remove('is-active');
    }
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

const App = () => {

    useEffect(() => {
        init();
        animate();
    }, [])

    return (
        <div>
            <div className="tooltip">

            </div>
        </div>

    );
}

export default App;