var camera, scene, renderer, controls, mainCanvas;
var geometry, material, cube, cylinder, sphere;
var pointLight, spotlight, lightTarget;
var smallCanvas, smallScene, smallCamera, smallScenePart;
var boundingBox, boxCurve; // box of object in small canvas
var gameStatusNode;
var freeCheckBox, animalCheckBox;
var gameMode = 'free',
    targetAnimal;

var stopRotationButton;
var currentRotation = 0.01;

var planeDiameter = 50;

var clock = new THREE.Clock();
let delta = 0;
// 60 fps
let interval = 1 / 60;
var keyboard = new THREEx.KeyboardState();

var animals = ['giraffe', 'elephant', 'kangaroo'];
var animalNames = [
    ['Žirafa', 'giraffe'],
    ['Slon', 'elephant'],
    ['Kengura', 'kangaroo']
];

var animalParts = ['head', 'body', 'legs', 'tail'];
var animalPartIndex = 0;
var animalIndex = 0;
var currentLights = [];

var currentAnimalParts = [];

var animal_builder;

var mainCanvasWidth;
var loadingSmall = false;

init();
render();

function init() {
    for (let i = 0; i < animalParts.length; i++) {
        currentAnimalParts.push(null)
    }

    freeCheckBox = document.getElementById("freeCheckBox");
    animalCheckBox = document.getElementById("animalCheckBox");
    gameStatusNode = document.getElementById("gameStatus");
    stopRotationButton = document.getElementById("stopRotationButton");
    animal_builder = document.getElementById("animal_builder");
    smallCanvas = document.getElementById("smallCanvas");
    mainCanvas = document.getElementById("mainCanvas");

    mainCanvasWidth = mainCanvas.offsetWidth;

    camera = new THREE.PerspectiveCamera(60, (window.innerWidth / 100 * mainCanvasWidth) / window.innerHeight, 0.08, 1000);
    camera.position.set(8, 6, 6);

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        antialias: true,
        alpha: true
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xffffff, 0);

    scene = new THREE.Scene();
    scene.name = "scene";

    addObjects();
    toggleLight();

    controls = new THREE.OrbitControls(camera, mainCanvas);

    controls.maxDistance = 50;
    //controls.enablePan = false;
    controls.rotateSpeed = 0.3;
    controls.maxPolarAngle = Math.PI / 2.01;
    controls.screenSpacePanning = false;

    makeSmallScene();
    toggleAnimalBuilder();
    setGameMode('free');
    toggleHidden('foliage_settings', ['foliage_settings'], []);
}

function mainRender() {
    const {
        left,
        right,
        top,
        bottom,
        width,
        height
    } = mainCanvas.getBoundingClientRect();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const positiveYUpBottom = renderer.domElement.clientHeight - bottom;

    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    renderer.render(scene, camera);
}

function smallRender() {
    if (animal_builder.classList.contains("hidden")) {
        return
    }

    const {
        left,
        right,
        top,
        bottom,
        width,
        height
    } = smallCanvas.getBoundingClientRect();

    smallCamera.aspect = width / height;
    smallCamera.updateProjectionMatrix();
    const positiveYUpBottom = renderer.domElement.clientHeight - bottom;

    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    if (smallScenePart == undefined) {
        smallScenePart = smallScene.getObjectByName("smallSceneAnimal");
    }
    if (smallScenePart != undefined) {
        smallScenePart.rotation.y += currentRotation;
    }

    renderer.render(smallScene, smallCamera);
}

function render() {
    delta += clock.getDelta();

    if (delta > interval) {
        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        mainRender();
        smallRender();

        delta = delta % interval;
    }
    requestAnimationFrame(render);
    update();
}

function addObjects() {
    var geometryPlane = new THREE.CircleGeometry(planeDiameter, planeDiameter);
    var materialPlane = new THREE.MeshPhongMaterial({
        color: 0x90c14d
    });
    plane = new THREE.Mesh(geometryPlane, materialPlane);
    plane.position.set(0, 0, 0);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    plane.needsUpdate = true
    plane.lookAt(0, 5, 0); // set normal upwards

    scene.add(plane);

    var geometrySphere = new THREE.SphereGeometry(500, 500, 500);
    var cubeTexture = new THREE.ImageUtils.loadTexture(
        skyTextures[skyIndex]);
    var materialSphere = new THREE.MeshBasicMaterial({
        map: cubeTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.set(0, 0, 0);
    sphere.name = "Sky";
    skyIndex++;

    scene.add(sphere);

    addCounterLight();
    redrawGrass();
    redrawTrees();
}

function update() {
    controls.update();
}

function toggleAnimalBuilder() {
    if (animal_builder.classList.contains("hidden")) {
        animal_builder.classList.remove("hidden");
        smallCanvas.classList.remove("hidden");
        loadAnimalPartIntoSmallScene();
    } else {
        animal_builder.classList.add("hidden");
        smallCanvas.classList.add("hidden");
    }
}

function setPart() {
    removePart();
    loadAnimalPartObj(animals[animalIndex], animalParts[animalPartIndex], position = {
        x: 0,
        y: -0.01,
        z: 0
    }, scale = 1, scene, "current" + animalParts[animalPartIndex]);
    currentAnimalParts[animalPartIndex] = animals[animalIndex] + "_" + animalParts[animalPartIndex];

    checkStatusOfBuild();
}

function removePart() {
    let currentPart = scene.getObjectByName("current" + animalParts[animalPartIndex]);

    if (currentPart != undefined) {
        scene.remove(currentPart);
        currentAnimalParts[animalPartIndex] = null;
    }
}

function stopRotation() {
    if (currentRotation > 0.0) {
        stopRotationButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
        currentRotation = 0.0;
    } else {
        stopRotationButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
        currentRotation = 0.01;
    }
}

function switchAnimalPartCategory() {
    animalPartIndex = (animalPartIndex + 1) % animalParts.length;
    animals = shuffle(animals);
    loadAnimalPartIntoSmallScene();
}

function switchAnimalPart(index) {
    animalIndex = (animalIndex + index) % animals.length < 0 ? animals.length - 1 : (animalIndex + index) % animals.length;
    loadAnimalPartIntoSmallScene();
}

function makeSmallScene() {
    smallCamera = new THREE.PerspectiveCamera(60, smallCanvas.width / smallCanvas.height, 0.01, 1000);
    smallCamera.position.set(1, 1.5, 1);

    smallScene = new THREE.Scene();
    smallScene.name = "smallScene";
    smallCamera.lookAt(0, 1, 0);

    let light = new THREE.AmbientLight(0xeeeeee, 0.35);
    smallScene.add(light);

    light = new THREE.SpotLight(0xFFFFFF, 0.8);
    light.position.set(10, 5, 10);
    light.lookAt(0, 0, 0);
    smallScene.add(light);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function fitCameraToObject(camera, object, offset) {
    offset = offset || 0.5;

    let mesh = object.children[0];
    let geometry = mesh.geometry;
    geometry.computeBoundingBox();

    let boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);

    //let boundingBox = geometry.boundingBox.clone();

    // mesh.updateMatrixWorld( true ); // ensure world matrix is up to date
    // boundingBox.applyMatrix4( mesh.matrixWorld );

    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    /*
    var cube;
    const maxSize = Math.max( size.x, size.y, size.z );
    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
    */
    /*
    if (cube != undefined) {
        smallScene.remove(cube);
    }
    const geom = new THREE.BoxGeometry( size.x, size.y, size.z );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, 
    	wireframe: true,
    	transparent: true} );
    cube = new THREE.Mesh( geom, material );
    cube.position.set(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);
    smallScene.add( cube );
    */
    // console.log(size, boundingBox, center);

    // newFov = newFov > 180 ? 60 / (1 / (Math.max(size.x, size.y, size.z) / 0.5)) : newFov;
    let newFov = 60 / (1 / (Math.max(size.x, size.y, size.z) / 0.5));
    camera.fov = newFov;

    let xPos = size.x / 2 > offset ? center.x + size.x / 2 : center.x + offset;
    let yPos = size.y / 2 > offset ? boundingBox.max.y + size.y / 2 : center.y + offset;
    let zPos = size.z / 2 > offset ? center.z + size.z / 2 : center.z + offset;

    camera.position.set(xPos, yPos, zPos);

    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();
    //object.position.set(object.position.x - center.x, object.position.y - center.y,object.position.z - center.z);
}

function setGameMode(newGameMode) {
    gameMode = newGameMode;
    if (newGameMode === 'free') {
        freeCheckBox.classList.remove("hidden");
        animalCheckBox.classList.add("hidden");

        gameStatusNode.textContent = "Voľné skladanie"
    } else if (newGameMode === 'animal') {
        freeCheckBox.classList.add("hidden");
        animalCheckBox.classList.remove("hidden");

        resetAllParts();

        let shuffledAnimals;
        if (!(targetAnimal == undefined || targetAnimal == null)) {
            for (let i = 0; i < animalNames.length; i++) {
                if (arraysIdentical(animalNames[i], targetAnimal)) {
                    animalNames.splice(i, 1);
                    break;
                }
            }
            shuffledAnimals = shuffle(animalNames);
            animalNames.push(targetAnimal);
        } else {
            shuffledAnimals = shuffle(animalNames);
        }

        gameStatusNode.textContent = "Postavte: " + shuffledAnimals[0][0];
        targetAnimal = shuffledAnimals[0];
    }
}

function shuffle(array) {
    arrayToShuffle = [...array];
    let currentIndex = arrayToShuffle.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arrayToShuffle[currentIndex], arrayToShuffle[randomIndex]] = [
            arrayToShuffle[randomIndex], arrayToShuffle[currentIndex]
        ];
    }

    return arrayToShuffle;
}

function checkStatusOfBuild() {
    if (gameMode === 'free') {
        return;
    }

    for (let i = 0; i < currentAnimalParts.length; i++) {
        if (currentAnimalParts[i] == null || !currentAnimalParts[i].includes(targetAnimal[1])) {
            return;
        }
    }

    setGameMode('free');
    gameStatusNode.textContent = "Gratulujeme!! Úspešne ste postavili zvieratko";
    let audio = new Audio('sound/' + targetAnimal[1] + '.mp3');
    audio.play();
}

function resetAllParts() {
    for (let index = 0; index < animalParts.length; index++) {
        let currentPart = scene.getObjectByName("current" + animalParts[index]);

        if (currentPart != undefined) {
            scene.remove(currentPart);
            currentAnimalParts[index] = null;
        }
    }
}

function takeScreenshot() {

    let tempWidth = 1920;
    let tempHeight = 1080;

    renderer.setSize(tempWidth, tempHeight);

    camera.aspect = tempWidth / tempHeight;
    camera.updateProjectionMatrix();

    renderer.setScissor(0, 0, tempWidth, tempHeight);
    renderer.setViewport(0, 0, tempWidth, tempHeight);

    renderer.render(scene, camera);
    camera.lookAt(scene.position.x, scene.position.y, scene.position.z);
    let imgData;

    try {
        let strMime = "image/jpeg";

        imgData = renderer.domElement.toDataURL(strMime, 1.0);

        download("obrazok.jpg", imgData.replace(strMime, "image/octet-stream"));
    } catch (e) {
        console.log(e);
        return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function saveBuild() {
    try {
        download("build.txt", 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentAnimalParts)));
    } catch (e) {
        console.log(e);
        return;
    }
}

function readBuild() {
    let f = document.createElement('input');
    f.style.display = 'none';
    f.type = 'file';
    f.name = 'file';
    f.accept = '.txt';
    document.body.appendChild(f);
    f.addEventListener('change', readSingleFileFromDrive, false);
    f.click();
    document.body.removeChild(f);
}

function toggleCaret(id) {
    let element = document.getElementById(id);

    if (element.classList.contains("fa-caret-right")) {
        element.classList.remove("fa-caret-right");
        element.classList.add("fa-caret-down");
    } else {
        element.classList.add("fa-caret-right");
        element.classList.remove("fa-caret-down");
    }
}

function toggleHidden(condElem, hidenElems, showingElems) {
    let conditionElement = document.getElementById(condElem);
    
    if (conditionElement.classList.contains("hidden")) {
        for(let i = 0; i < hidenElems.length; i++){
            let elem = document.getElementById(hidenElems[i]);

            elem.classList.remove("hidden");
        }
        for(let i = 0; i < showingElems.length; i++){
            let addElem = document.getElementById(showingElems[i]);

            addElem.classList.add("hidden");
        }
    } else {
        for(let i = 0; i < hidenElems.length; i++){
            let addElem = document.getElementById(hidenElems[i]);

            addElem.classList.add("hidden");
        }
        for(let i = 0; i < showingElems.length; i++){
            let elem = document.getElementById(showingElems[i]);

            elem.classList.remove("hidden");
        }
    }
}

function toggleClass(elemId, className) {
    let elem = document.getElementById(elemId);

    if (elem.classList.contains(className)) {
        elem.classList.remove(className);
    } else {
        elem.classList.add(className);
    }
}

function removeClass(elemId, className) {
    let elem = document.getElementById(elemId);
    elem.classList.remove(className);

}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function arraysIdentical(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }

    return true;
};