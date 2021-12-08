var camera, scene, renderer, controls, mainCanvas;
var geometry, material, cube, cylinder, sphere;
var pointLight, spotlight, lightTarget;
var smallCanvas, smallScene, smallCamera, smallScenePart;
var boundingBox, boxCurve; // box of object in small canvas

var stopRotationButton;
var currentRotation = 0.01;

var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var skyIndex = 0;
var lightIndex = 0;
const skyTextures = ['texture/sky.jpg', 'texture/sky_day-min.png', 'texture/sky_sunset-min.png', 'texture/cropped-starglobe-maya-render.jpg'];
var animals = ['giraffe', 'elephant', 'kangaroo'];

var animalParts = ['head', 'body', 'legs', 'tail'];
var animalPartIndex = 0;
var animalIndex = 0;
var currentLights = [];

var currentAnimalParts = [];

var animal_builder;

var mainCanvasWidth = 70;
var loadingSmall = false;

init();
render();

function init() {
    for (let i = 0; i < animalParts.length; i++) {
        currentAnimalParts.push(null)
    }

    stopRotationButton = document.getElementById("stopRotationButton");

    animal_builder = document.getElementById("animal_builder");

    smallCanvas = document.getElementById("smallCanvas");

    mainCanvas = document.getElementById("mainCanvas");
    mainCanvas.width = window.innerWidth / 100 * mainCanvasWidth
    mainCanvas.height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(60, (window.innerWidth / 100 * mainCanvasWidth) / window.innerHeight, 0.01, 1000);
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
    controls.panSpeed = 0.4;
    controls.rotateSpeed = 0.4;
    controls.maxPolarAngle = Math.PI / 2.01;
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.target.set(0, 0, 0);

    toggleAnimalBuilder();

    makeSmallScene();
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
    camera.lookAt(scene.position.x, scene.position.y, scene.position.z);
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

    renderer.setScissor(left, top, width, height);
    renderer.setViewport(left, top, width, height);

    if(smallScenePart == undefined){
        smallScenePart = smallScene.getObjectByName("smallSceneAnimal");
    }
    if(smallScenePart != undefined){
        smallScenePart.rotation.y += currentRotation;
    }

    renderer.render(smallScene, smallCamera);
}

function render() {
    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    mainRender();
    smallRender();

    requestAnimationFrame(render);
    update();
}

function addObjects() {
    var geometryPlane = new THREE.CircleGeometry(150, 150);
    var materialPlane = new THREE.MeshPhongMaterial({
        color: 0xcccccc
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

    /*
    for (let i = 0; i < animals.length; i++) {
        loadAnimalAllParts(animals[i], position = {
            x: 0,
            y: -0.01,
            z: 0 - 3 * i
        }, scale = 1, scene);
    }
    */
}

function update() {
    controls.update();
}

function toggleLight() {
    for (let i = 0; i < currentLights.length; i++) {
        scene.remove(currentLights[i]);
    }
    currentLights = [];

    if (lightIndex == 0) {
        let ambientLight = new THREE.AmbientLight(0xeeeeee, 0.7);
        scene.add(ambientLight);

        lightTarget = new THREE.Object3D();
        lightTarget.position.set(0, 0, 0);
        scene.add(lightTarget);

        let spotlight = new THREE.PointLight('rgb(255,255,255)');
        spotlight.angle = Math.PI / 3;
        spotlight.position.set(63.5, 40, -70);
        spotlight.intensity = 0.8;
        spotlight.penumbra = 0.4;
        spotlight.target = lightTarget;
        spotlight.castShadow = true;

        spotlight.shadow.bias = -0.0001;
        spotlight.shadow.mapSize.width = 1024 * 4;
        spotlight.shadow.mapSize.height = 1024 * 4;

        scene.add(spotlight);

        currentLights.push(ambientLight, spotlight);

        lightIndex = 1;
    } else if (lightIndex == 1) {
        const skyColor = 'rgb(255, 200, 50)';
        const groundColor = 0xB1E1FF;
        const intensity = 0.7;
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(hemiLight);

        const pointLight = new THREE.PointLight('rgb(255,255,255)');
        pointLight.position.set(+150, 50, -25);
        pointLight.intensity = 1;
        pointLight.penumbra = 0.4;
        pointLight.castShadow = true;
        pointLight.penumbra = 1;

        pointLight.shadow.bias = -0.0001;
        pointLight.shadow.mapSize.width = 1024 * 4;
        pointLight.shadow.mapSize.height = 1024 * 4;

        scene.add(pointLight);

        currentLights.push(hemiLight, pointLight);

        lightIndex = 2;
    } else if (lightIndex == 2) {
        let ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3);
        scene.add(ambientLight);

        lightTarget = new THREE.Object3D();
        lightTarget.position.set(0, 0, 0);
        scene.add(lightTarget);

        let spotlight = new THREE.SpotLight('rgb(220,220,220)');
        spotlight.angle = Math.PI / 3;
        spotlight.position.set(13.5, 10, -10);
        spotlight.intensity = 0.4;
        spotlight.penumbra = 0.2;
        spotlight.target = lightTarget;
        spotlight.castShadow = true;

        spotlight.shadow.bias = -0.0001;
        spotlight.shadow.mapSize.width = 1024 * 4;
        spotlight.shadow.mapSize.height = 1024 * 4;

        scene.add(spotlight);

        currentLights.push(ambientLight, spotlight);

        lightIndex = 3;
    } else {

        let ambientLight = new THREE.AmbientLight(0xeeeeee, 0.6);
        scene.add(ambientLight);

        lightTarget = new THREE.Object3D();
        lightTarget.position.set(0, 0, 0);
        scene.add(lightTarget);

        let spotlight = new THREE.SpotLight('rgb(255,255,255)');
        spotlight.angle = Math.PI / 3;
        spotlight.position.set(13.5, 10, -10);
        spotlight.intensity = 0.4;
        spotlight.penumbra = 0.4;
        spotlight.target = lightTarget;
        spotlight.castShadow = true;

        spotlight.shadow.bias = -0.0001;
        spotlight.shadow.mapSize.width = 1024 * 4;
        spotlight.shadow.mapSize.height = 1024 * 4;

        scene.add(spotlight);

        let spotlight2 = new THREE.SpotLight('rgb(255,255,255)');
        spotlight2.angle = Math.PI / 3;
        spotlight2.position.set(-13.5, 10, +13);
        spotlight2.intensity = 0.7;
        spotlight2.penumbra = 0.4;
        spotlight2.target = lightTarget;
        spotlight2.castShadow = true;

        spotlight2.shadow.bias = -0.0001;
        spotlight2.shadow.mapSize.width = 1024 * 4;
        spotlight2.shadow.mapSize.height = 1024 * 4;

        scene.add(spotlight2);

        currentLights.push(ambientLight, spotlight, spotlight2);

        lightIndex = 0;
    }
}

function toggleSky() {
    skyIndex = skyIndex % skyTextures.length;

    sphere.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = THREE.ImageUtils.loadTexture(skyTextures[skyIndex]);
            child.material.needsUpdate = true;
        }
    });
    skyIndex++;
}

function loadFullObj(animal, scene) {
    let mtlLoader = new THREE.MTLLoader();
    let path = './models/' + animal + '/';
    mtlLoader.setPath(path);
    mtlLoader.load(animal + '.mtl',
        function (materials) {
            materials.preload();

            let loader = new THREE.OBJLoader();
            loader.setMaterials(materials)
            loader.setPath(path);

            loadObj(loader, animal + '.obj', scene);
        }
    );
}

function loadAnimalAllParts(animal, position, scale, scene) {
    let mtlLoader = new THREE.MTLLoader();
    let path = './models/' + animal + '/';
    mtlLoader.setPath(path);
    mtlLoader.load(animal + '.mtl',
        function (materials) {
            materials.preload();

            let loader = new THREE.OBJLoader();
            loader.setMaterials(materials);
            loader.setPath(path);

            for (let i = 0; i < animalParts.length; i++) {
                loadObj(loader, animal + '_' + animalParts[i] + '.obj', position, scale, scene);
            }
        }
    );
}

function loadAnimalPartObj(animal, part, position, scale, scene, animalName){
    let mtlLoader = new THREE.MTLLoader();
    let path = './models/' + animal + '/';
    mtlLoader.setPath(path);
    mtlLoader.load(animal + '.mtl',
        function (materials) {
            materials.preload();

            let loader = new THREE.OBJLoader();
            loader.setMaterials(materials);
            loader.setPath(path);

            loadObj(loader, animal + '_' + part + '.obj', position, scale, scene, animalName);
        }
    );
}

function loadObj(loader, animal, position, scale, scene, animalName, center) {
    loader.load(animal,
        function (object) {
            object.position.set(position.x, position.y, position.z);
            object.scale.set(scale, scale, scale);

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material.map) child.material.map.anisotropy = 16;
                }
            });

            if (animalName != undefined) {
                object.name = animalName;
            } else {
                object.name = animal;
            }       

            scene.add(object);

            
            if (loadingSmall) {
                smallScenePart = smallScene.getObjectByName("smallSceneAnimal");
                if (center) {
                    let mesh = object.children[0];
                    let geometry = mesh.geometry;
                    geometry.computeBoundingBox();
                    
                    let box = new THREE.Box3().setFromObject(mesh);
                    box.center( mesh.position ); // this re-sets the mesh position
                    mesh.position.multiplyScalar(-1);

                    fitCameraToObject(smallCamera, object, 0.4);
                }
            }
            loadingSmall = false;
        },
        function () {},
        function (err) {
            console.log(err);
        }
    );
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

function setPart(){
    removePart();
    loadAnimalPartObj(animals[animalIndex], animalParts[animalPartIndex], position = {
        x: 0,
        y: -0.01,
        z: 0
    }, scale = 1, scene, "current" + animalParts[animalPartIndex]);
    currentAnimalParts[animalPartIndex] = animals[animalIndex] + "_" + animalParts[animalPartIndex];
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
    loadAnimalPartIntoSmallScene();
}

function switchAnimalPartLeft() {
    animalIndex = (animalIndex - 1) < 0 ? animals.length - 1 : animalIndex - 1;
    loadAnimalPartIntoSmallScene();
}

function switchAnimalPartRight() {
    animalIndex = (animalIndex + 1) % animals.length;
    loadAnimalPartIntoSmallScene();
}

function loadAnimalPartIntoSmallScene() {
    if (loadingSmall) {
        return;
    }
    loadingSmall = true;
    let smallAnimal = animals[animalIndex];
    let animalName = smallAnimal + "_" + animalParts[animalPartIndex] + ".obj";
    smallScenePart = smallScene.getObjectByName("smallSceneAnimal");

    if (smallScenePart != undefined) {
        smallScene.remove(smallScenePart);
    }

    let mtlLoader = new THREE.MTLLoader();
    let path = './models/' + smallAnimal + '/';
    mtlLoader.setPath(path);
    mtlLoader.load(smallAnimal + '.mtl',
        function (materials) {
            materials.preload();

            let loader = new THREE.OBJLoader();
            loader.setMaterials(materials);
            loader.setPath(path);

            loadObj(loader, animalName, {
                x: 0,
                y: 0,
                z: 0
            }, 0.3, smallScene, "smallSceneAnimal", true);
        }
    );

    smallScenePart = smallScene.getObjectByName("smallSceneAnimal");
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
    light.position.set(10,5,10);
    light.lookAt(0,0,0);
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

var cube;
function fitCameraToObject(camera, object, offset) {
    offset = offset || 0.5;

    let mesh = object.children[0];
    let geometry = mesh.geometry;
    geometry.computeBoundingBox();

    boundingBox = new THREE.Box3();
    boundingBox.setFromObject(object);

    //let boundingBox = geometry.boundingBox.clone();

    // mesh.updateMatrixWorld( true ); // ensure world matrix is up to date
    // boundingBox.applyMatrix4( mesh.matrixWorld );

    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    /*
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

    let newFov = 60 / (1 / (Math.max(size.x, size.y, size.z) / 0.5));
    camera.fov = newFov;

    camera.position.set(center.x + offset, center.y +  offset, center.z +  offset);

    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();
    //object.position.set(object.position.x - center.x, object.position.y - center.y,object.position.z - center.z);
}