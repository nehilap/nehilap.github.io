/**
 * 
 * Peter Nehila
 * main file containing most of the global variables
 * contains render loop, initializes scenes, functions that didn't belong to a separate file
 * 
 */

// Debug variables (cube is boundingBox in smallScene)
var debug = false;
var stats;
var cubeBoundingBox; // box of object in small canvas

var renderer;
var camera, 		scene, 		mainCanvas, 	controls;
var smallCamera, 	smallScene, smallCanvas, 	smallScenePart;
var skyBox;

var currentLights = [];
var maxShadowMapSize;

// HTML dom elements
var gameStatusNode, currentPartNode;
var freeCheckBox, animalCheckBox;
var animal_builder;
var stopRotationButton;

// game settings
var gameMode = 'free';
var	targetAnimal;

var currentRotation = 0.01;
var planeDiameter = 50;

var clock = new THREE.Clock();
let delta = 0;
let interval = 1 / 60; // 60 fps

var animals = ['giraffe', 'elephant', 'kangaroo', "horse", "wolf"];
var animalNames = [
	['Žirafa', 'giraffe'],
	['Slon', 'elephant'],
	['Kengura', 'kangaroo'],
	["Kôň", 'horse'],
	["Vlk", "wolf"],
];

var animalParts = ['head', 'body', 'legs', 'tail'];
var animalPartsSk = ['Hlava', 'Telo', 'Končatiny', 'Chvost'];
var animalPartIndex = 0;
var animalIndex = 0;

var currentAnimalParts = [];

var loadingSmall = false;
const defaultAudioVolume = 0.5;
var audioVolume = defaultAudioVolume;

init();
animate();

/**
 * ==========================
 * INIT, RENDERS, RENDER LOOP
 * ==========================
 */

/**
 * Initializes scene with default settings, addsObjects to scene, initializes some global vars
 */
function init() {
	for (let i = 0; i < animalParts.length; i++) {
		currentAnimalParts.push(null)
	}

	freeCheckBox = document.getElementById("freeCheckBox");
	animalCheckBox = document.getElementById("animalCheckBox");
	gameStatusNode = document.getElementById("gameStatus");
	currentPartNode = document.getElementById("current_part");
	stopRotationButton = document.getElementById("stopRotationButton");
	animal_builder = document.getElementById("animal_builder");

	smallCanvas = document.getElementById("smallCanvas");
	mainCanvas = document.getElementById("mainCanvas");

	let mainCanvasWidth = mainCanvas.offsetWidth;

	// sets fov based on canvas width / height
	camera = new THREE.PerspectiveCamera(60, (window.innerWidth / 100 * mainCanvasWidth) / window.innerHeight, 0.08, 1000);
	camera.position.set(8, 6, 6);

	renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("canvas"),
		powerPreference: "high-performance",
		antialias: true,
		alpha: true
	});

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setClearColor(0xffffff, 0);

	scene = new THREE.Scene();
	scene.name = "scene";

	maxShadowMapSize = Math.min(1024 * 4, renderer.capabilities.maxTextureSize);

	addObjects();

	controls = new THREE.OrbitControls(camera, mainCanvas);

	controls.minDistance = 1;
	controls.maxDistance = 50;
	//controls.enablePan = false;
	controls.rotateSpeed = 0.3;
	controls.maxPolarAngle = Math.PI / 2.1;
	controls.screenSpacePanning = false;

	makeSmallScene();
	toggleAnimalBuilder();
	setGameMode('free');
	toggleHidden('foliage_settings', ['foliage_settings'], []);

	stats = new Stats();
}

/**
 * Render method for rendering in main scene
 */
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

/**
 * Render method for rendering in small canvas in menu
 * @returns nothing
 */
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

/**
 * Main render loop, calls other render methods
 */
function animate() {
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
	requestAnimationFrame(animate);
	update();
}

/**
 * Adds basic objects to scene such as: plane, skybox, counter light, lights, grass, trees
 */
function addObjects() {
	var geometryPlane = new THREE.CircleGeometry(planeDiameter, planeDiameter);
	var materialPlane = new THREE.MeshPhongMaterial({
		color: envSettings.groundColor
	});
	plane = new THREE.Mesh(geometryPlane, materialPlane);
	plane.position.set(0, 0, 0);
	plane.rotation.x = Math.PI / 2;
	plane.receiveShadow = true;
	plane.lookAt(0, 5, 0); // set normal upwards
	plane.name = "plane";
	plane.needsUpdate = true

	scene.add(plane);

	var geometrySphere = new THREE.SphereGeometry(500, 500, 500);
	var skyTexture = new THREE.ImageUtils.loadTexture(
		skyTextures[skyIndex]);
	var materialSphere = new THREE.MeshBasicMaterial({
		map: skyTexture,
		transparent: true,
		side: THREE.DoubleSide
	});
	skyBox = new THREE.Mesh(geometrySphere, materialSphere);
	skyBox.position.set(0, 0, 0);
	skyBox.name = "Sky";
	skyIndex++;

	scene.add(skyBox);

	addCounterLight();
	toggleLight();
	redrawGrass();
	redrawTrees();
}

/**
 * Update method, in case needed to update keys etc
 */
function update() {
	controls.update();
	stats.update();
}

/**
 * Changes renderer size in case screen has been resized
 * @param {Renderer} renderer
 * @returns {boolean}
 */
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

/**
 * ======================
 * ANIMAL BUILDER METHODS
 * ======================
 */

/**
 * Shows / hides small canvas and menu, calls load of animal part into small scene
 */
function toggleAnimalBuilder() {
	if (animal_builder.classList.contains("hidden")) {
		showBuilder();
		loadAnimalPartIntoSmallScene();
	} else {
		animal_builder.classList.add("hidden");
		smallCanvas.classList.add("hidden");
	}
}

/**
 * Shows small canvas and menu
 */
function showBuilder() {
	animal_builder.classList.remove("hidden");
	smallCanvas.classList.remove("hidden");
}

/**
 * Adds / changes part from small scene into main scene, checks state of build
 */
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

/**
 * Removes part from main scene and unsets value
 */
function removePart() {
	let currentPart = scene.getObjectByName("current" + animalParts[animalPartIndex]);

	if (currentPart != undefined) {
		scene.remove(currentPart);
		currentAnimalParts[animalPartIndex] = null;
	}
}

/**
 * Controls rotation of small scene part
 */
function stopRotation() {
	if (currentRotation > 0.0) {
		stopRotationButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
		currentRotation = 0.0;
	} else {
		stopRotationButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
		currentRotation = 0.01;
	}
}

/**
 * Switches animal part category
 */
function switchAnimalPartCategory() {
	animalPartIndex = (animalPartIndex + 1) % animalParts.length;
	animals = shuffle(animals);
	loadAnimalPartIntoSmallScene();

	currentPartNode.textContent = animalPartsSk[animalPartIndex];
}

/**
 * changes current animal left or right
 * @param {number} index - +1 / -1
 */
function switchAnimalPart(index) {
	animalIndex = (animalIndex + index) % animals.length < 0 ? animals.length - 1 : (animalIndex + index) % animals.length;
	loadAnimalPartIntoSmallScene();
}

/**
 * Initializes small scene with default settings, adds camera, default lights
 */
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

/**
 * Fits camera to object, currently tested and used only for small canvas and small scene
 * @param {Camera} camera - came object
 * @param {Object3D} object - object to fit camera to, needs to have bounding box and center correctly set
 * @param {number} offset 
 */
function fitCameraToObject(camera, object, offset) {
	offset = offset || 0.5;

	let mesh = object.children[0];
	let geometry = mesh.geometry;
	geometry.computeBoundingBox();

	let boundingBox = new THREE.Box3();
	boundingBox.setFromObject(object);

	// mesh.updateMatrixWorld( true ); // ensure world matrix is up to date
	// boundingBox.applyMatrix4( mesh.matrixWorld );

	const size = boundingBox.getSize(new THREE.Vector3());
	const center = boundingBox.getCenter(new THREE.Vector3());

	if (debug) {

		if (cubeBoundingBox != undefined) {
			smallScene.remove(cubeBoundingBox);
		}
		const geom = new THREE.BoxGeometry(size.x, size.y, size.z);
		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true,
			transparent: true
		});
		cubeBoundingBox = new THREE.Mesh(geom, material);
		cubeBoundingBox.position.set(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);
		smallScene.add(cubeBoundingBox);

		console.log(size, boundingBox, center);
	}

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

/**
 * Removes all parts in main scene
 */
function resetAllParts() {
	for (let index = 0; index < animalParts.length; index++) {
		let currentPart = scene.getObjectByName("current" + animalParts[index]);

		if (currentPart != undefined) {
			scene.remove(currentPart);
			currentAnimalParts[index] = null;
		}
	}
}

/**
 * =============================
 * GENERAL FUNCTIONALITY METHODS
 * =============================
 */

/**
 * Sets game mode
 * @param {string} newGameMode - 'free' / 'animal'
 */

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

		// shuffles animals array and picks animal from it
		// makes sure new animal is picked every time normal game mode is chosen
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

/**
 * Checks if animal is correctly and fully built, if it is, plays correct audio sound
 * @returns nothing
 */
function checkStatusOfBuild() {
	let animalName;
	if (gameMode === 'free') {
		let parts = [];
		for (let i = 0; i < currentAnimalParts.length; i++) {
			if (currentAnimalParts[i] == null || !currentAnimalParts[i].includes("_")) {
				return;
			}
			parts.push(currentAnimalParts[i].split("_")[0]);
		}
		for (let index = 1; index < parts.length; index++) {
			if (parts[index] != parts[0]) {
				return;
			}
		}
		animalName = parts[0];
	} else {
		for (let i = 0; i < currentAnimalParts.length; i++) {
			if (currentAnimalParts[i] == null || !currentAnimalParts[i].includes(targetAnimal[1])) {
				return;
			}
		}
		animalName = targetAnimal[1];
	}

	setGameMode('free');
	gameStatusNode.textContent = "Gratulujeme!! Úspešne ste postavili zvieratko";
	let audio = new Audio('sound/' + animalName + '.mp3');
	audio.volume = audioVolume;
	audio.play();
}

/**
 * Takes screenshot of main canvas with full HD size and highest quality possible (not much still, but w/e)
 * calls function  to open download dialogue
 * @returns nothing
 */
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

/**
 * =====================
 * LOADING / SAVING GAME
 * =====================
 */

/**
 * Opens file save dialogue with correct save data
 * @returns nothing
 */
function saveBuild() {
	let saveData = {
		parts: currentAnimalParts,
		env: envSettings,
		light: lightIndex - 1,
		sky: skyIndex - 1
	};
	try {
		download("build.txt", 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(saveData)));
	} catch (e) {
		console.log(e);
		return;
	}
}

/**
 * Opens load file dialogue for reading build file
 */
function readBuild() {
	let f = document.createElement('input');
	f.style.display = 'none';
	f.type = 'file';
	f.name = 'file';
	f.accept = '.txt';
	document.body.appendChild(f);
	f.addEventListener('change', function (event) {
		readSingleFileFromDrive(event, loadBuild);
	}, false);
	f.click();
	document.body.removeChild(f);
}

/**
 * Reads data and sets current state of game
 * @param {string} contents - unparsed content from file
 */
function loadBuild(contents) {
	try {
		parsedData = JSON.parse(contents);

		resetAllParts();
		let animalParts = parsedData.parts;
		for (let index = 0; index < animalParts.length; index++) {
			if (animalParts[index] == null) {
				continue;
			}
			let [animal, part] = animalParts[index].split("_");
			loadAnimalPartObj(animal, part, position = {
				x: 0,
				y: -0.01,
				z: 0
			}, scale = 1, scene, "current" + part);
		}

		envSettings = parsedData.env;
		lightIndex = parsedData.light;
		skyIndex = parsedData.sky;

		redrawGrass();
		redrawTrees();
		reSetPlaneColor();
		toggleLight();
		toggleSky();

		setFoliageButtonsActiveClass();

	} catch (ex) {
		customAlert("Nepodarilo sa spracovať súbor!!");
		console.log(ex);
	}
}

/**
 * Sets environment menu buttons class active accordingly to envSettings
 */
function setFoliageButtonsActiveClass() {
	setGroundColorButtonsActive();
	// mapped to treeTypes
	let treeButtons = ['tree_normal', 'tree_savannah', 'tree_pine', 'tree_spruce', 'tree_spruce'];
	for (let index = 0; index < treeTypes.length; index++) {
		if (envSettings.treeMtl.indexOf(treeTypes[index]) == -1) {
			removeClass(treeButtons[index], "active");
		}
	}

	for (let index = 0; index < envSettings.grassMtl.length; index++) {
		removeClass(envSettings.grassMtl[index], "active");
		toggleClass(envSettings.grassMtl[index], "active");
	}
}

function setGroundColorButtonsActive() {
	removeClass('ground_normal', 'active');
	removeClass('ground_dark', 'active');
	removeClass('ground_yellow', 'active');

	if (envSettings["groundColor"] == 0x90c14d) {
		toggleClass('ground_normal', 'active');
	} else if (envSettings["groundColor"] == 0xbeac3f) {
		toggleClass('ground_yellow', 'active');
	} else if (envSettings["groundColor"] == 0x2e6431) {
		toggleClass('ground_dark', 'active');
	}
}

/**
 * ==================================
 * UTILS
 * functions used for general purpose
 * ==================================
 */

/**
 * Shows alert
 * @param {string} alertMessage 
 */
function customAlert(alertMessage) {
	document.getElementById("alertContent").textContent = alertMessage;

	removeClass('alert', 'hidden');
}

/**
 * Shuffles given array
 * @param {array} array 
 * @returns shuffled array
 */
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

/**
 * Swaps font-awesome carets of element
 * @param {string} id - id of element
 */
function toggleCaret(id) {
	let element = document.getElementById(id);

	if (element.classList.contains("fa-caret-right")) {
		openCaret(element);
	} else {
		closeCaret(element);
	}
}

/**
 * Adds open carets to element
 * @param {Object} element
 */
function openCaret(element) {
	element.classList.remove("fa-caret-right");
	element.classList.add("fa-caret-down");
}

/**
 * Adds close carets to elements
 * @param {Object} element
 */
function closeCaret(element) {
	element.classList.add("fa-caret-right");
	element.classList.remove("fa-caret-down");
}

/**
 * Switches audio volume bettwen 0.0 and defaultAudioVolume
 */
function toggleSound() {
	let elem = document.getElementById("toggle_sound");

	if (elem.classList.contains("active")) {
		audioVolume = 0.0;

		elem.classList.remove("active");
	} else {
		audioVolume = defaultAudioVolume;

		elem.classList.add("active");
	}
}

/**
 * Toggles "hidden" class in elements
 * @param {string} condElem - element to use as condition
 * @param {array[string]} hidenElems - elements sharing "hidden" class with condElement
 * @param {array[string]} showingElems
 */
function toggleHidden(condElem, hidenElems, showingElems) {
	let conditionElement = document.getElementById(condElem);

	if (conditionElement.classList.contains("hidden")) {
		for (let i = 0; i < hidenElems.length; i++) {
			let elem = document.getElementById(hidenElems[i]);

			elem.classList.remove("hidden");
		}
		for (let i = 0; i < showingElems.length; i++) {
			let addElem = document.getElementById(showingElems[i]);

			addElem.classList.add("hidden");
		}
	} else {
		for (let i = 0; i < hidenElems.length; i++) {
			let addElem = document.getElementById(hidenElems[i]);

			addElem.classList.add("hidden");
		}
		for (let i = 0; i < showingElems.length; i++) {
			let elem = document.getElementById(showingElems[i]);

			elem.classList.remove("hidden");
		}
	}
}

/**
 * Toggle css class on and off
 * @param {string} elemId - element id to toggle css class
 * @param {string} className - css class name
 */
function toggleClass(elemId, className) {
	let elem = document.getElementById(elemId);

	if (elem.classList.contains(className)) {
		elem.classList.remove(className);
	} else {
		elem.classList.add(className);
	}
}

/**
 * Removes css class from element
 * @param {string} elemId - element id
 * @param {string} className - css class name
 */
function removeClass(elemId, className) {
	let elem = document.getElementById(elemId);
	elem.classList.remove(className);

}

/**
 * Returns random number between (min; max)
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Checks if two arrays are identical
 * @param {array} a 
 * @param {array} b 
 * @returns {boolean}
 */
function arraysIdentical(a, b) {
	var i = a.length;
	if (i != b.length) return false;
	while (i--) {
		if (a[i] !== b[i]) return false;
	}

	return true;
};

/**
 * Shows Stats dom element
 */
function showStats() {
	document.body.appendChild(stats.dom);
}

/**
 * Hides Stats dom element
 */
function hideStats() {
	stats.dom.parentElement.removeChild(stats.dom);
}