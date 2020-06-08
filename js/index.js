// renderer
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xf2f2f2);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.antialias = true;
document.getElementById("main-view").appendChild(renderer.domElement);

// Making the scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xe4e4e4);
scene.fog = new THREE.Fog(0xa0a0a0, 3000, 8000);

// ground
var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), new THREE.MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
}));
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

// Setting up the a camera
var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    8000
);
camera.position.x = 1837.037015999162;
camera.position.y = 2681.726911266994;
camera.position.z = 2347.473369792994;

camera.rotation.x = -0.7785610989030683;
camera.rotation.y = 0.5049631946744702;
camera.rotation.z = 0.4452457532401642;

camera.scale.x = 1;
camera.scale.y = 1;
camera.scale.z = 1;

camera.up.y = 1;
camera.zoom = 1;

// Lights
var pointLight = new THREE.PointLight(0x7789d6, 0.7);
scene.add(pointLight);

var dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(-3, 10, -10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

// loading the model
var loader = new THREE.GLTFLoader();

loader.load(
    "../models/irb120/scene.gltf",
    function (gltf) {
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// adding the grid plane
var grid = new THREE.GridHelper(20000, 25, 0xff0000, 0xaaaaaa);
scene.add(grid);

// -----------------
// make the compass
// -----------------
const CANVAS_WIDTH = 200,
    CANVAS_HEIGHT = 200,
    CAM_DISTANCE = 300;

let container2 = document.getElementById("compass-view");

// renderer
let renderer2 = new THREE.WebGLRenderer({
    alpha: true,
});
renderer2.setClearColor(0xf0f0f0, 0.0);
renderer2.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
container2.appendChild(renderer2.domElement);

// scene
let scene2 = new THREE.Scene();

// camera
let camera2 = new THREE.PerspectiveCamera(
    50,
    CANVAS_WIDTH / CANVAS_HEIGHT,
    1,
    1000
);
camera2.up = camera.up; // important!

// axes
let axes2 = new THREE.AxesHelper(100);
scene2.add(axes2);


// -----------------
// Rendering pipeline
// -----------------

// render functon
function render() {
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);
}
// update function
function update() {
    camera2.position.copy(camera.position);
    camera2.position.sub(controls.target); // added by @libe
    camera2.position.setLength(CAM_DISTANCE);
    camera2.lookAt(scene2.position);
    // console.log(camera);
}
// game loop
function animate() {
    requestAnimationFrame(animate);
    update();
    render();
}
animate();

// update viwport on resize
window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let heigth = window.innerHeight;

    renderer.setSize(width, heigth);
    camera.aspect = width / heigth;
    camera.updateProjectionMatrix();
});