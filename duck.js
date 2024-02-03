import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';

import modelpath from "./assets/pill.glb";

let loader = new GLTFLoader();
let model;
let scene, renderer, canvas, controls;

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = window.innerWidth / window.innerHeight;

let camera


function main() {

    canvas = document.getElementById("gl-canvas");
    // apply antialias to give better effect
    renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    scene = new THREE.Scene();


    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, -20);


    createControls(camera);
    controls.update();


    // fit screen size
    renderer.setSize(width, height);

    // Enable Shadows in the Renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // set background color
    renderer.setClearColor(new THREE.Color("grey"));

    createLights();
    createModel();


    renderer.render(scene, camera);

    // resize window
    window.addEventListener('resize', onWindowResize);

    animate();

}

main();

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

function createLights() {
    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);
}

function createModel() {
    loader.load(modelpath, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(0, 0, 0);
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        scene.add(model);

    }, undefined, function (error) {
        console.error(error);
    });
}

function createControls(camera) {

    controls = new TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 5;
    controls.panSpeed = 0.8;

    //     This array holds keycodes for controlling interactions.

    // When the first defined key is pressed, all mouse interactions (left, middle, right) performs orbiting.
    // When the second defined key is pressed, all mouse interactions (left, middle, right) performs zooming.
    // When the third defined key is pressed, all mouse interactions (left, middle, right) performs panning.
    // Default is KeyA, KeyS, KeyD which represents A, S, D.
    controls.keys = ['KeyA', 'KeyS', 'KeyD'];

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
