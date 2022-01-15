/**
 * 
 * Peter Nehila
 * file containing methods for working with models (mainly loading them)
 * 
 */

/**
 * Returns children containing tag as custom userData
 * https://discourse.threejs.org/t/be-solved-how-to-find-objects-return-an-array/6685
 * @param {String} tag 
 * @param {array} result 
 * @returns {array} - array of objects
 */
THREE.Object3D.prototype.getObjectsByTag = function (tag, result) {

	// check the current object

	if (this.userData.tag === tag) result.push(this);

	// check children

	for (var i = 0, l = this.children.length; i < l; i++) {

		var child = this.children[i];

		child.getObjectsByTag(tag, result);

	}

	return result;
};

/**
 * !!! currently not used !!! needs revision
 * Loads full animal object into scene
 * @param {String} animal - animal name
 * @param {scene} scene - scene to use
 */
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

			loadObj(loader, animal + '.obj', {
				x: 0,
				y: 0,
				z: 0
			}, 1., scene);
		}
	);
}

/**
 * 
 * !!! currently not used !!! needs revision
 * Loads all animals part objects int oscene
 * @param {string} animal - animal name
 * @param {Object} position - attribute
 * @param {number} scale - attribute
 * @param {Scene} scene - scene to use
 */
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

/**
 * Loads animal part object into scene
 * @param {string} animal - animal file name
 * @param {string} part - part name
 * @param {Object} position - attributes
 * @param {number} scale - attributes
 * @param {Scene} scene - scene to use
 * @param {string} animalName - custom object name
 */
function loadAnimalPartObj(animal, part, position, scale, scene, animalName) {
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

/**
 * Replaces animal part based on current part and animal indexes into small scene
 * global variables: loadingSmall, smallScene, animals, animalIndex, animalParts, animalPartIndex, smallScenePart
 * @returns nothing
 */
function loadAnimalPartIntoSmallScene() {
	// prevents method being called multiple times at once due to input lag / called too fast
	// this needs to be here, because loading object from file is async, meaning you could load multiple objects into small scene if you click too fast
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

	let manager = new THREE.LoadingManager()
	let mtlLoader = new THREE.MTLLoader(manager);
	let path = './models/' + smallAnimal + '/';
	mtlLoader.setPath(path);
	mtlLoader.load(smallAnimal + '.mtl',
		function (materials) {
			materials.preload();

			let loader = new THREE.OBJLoader(manager);
			loader.setMaterials(materials);
			loader.setPath(path);

			loadObj(loader, animalName, {
				x: 0,
				y: 0,
				z: 0
			}, 0.3, smallScene, "smallSceneAnimal", true);
		}
	);
}

/**
 * Function that uses provided loader, loads object and sets its attributes
 * @param {ObjectLoader} loader 
 * @param {string} objName - name of file to be loaded
 * @param {Object} position - attributes
 * @param {number} scale - attributes
 * @param {Scene} scene - scene to load into
 * @param {string} objCustomName - custom name to be given to object
 * @param {boolean} center - whether object should be centered with it's bounding box
 * global variables: loadingSmall, smallScenePart, smallScene
 */
function loadObj(loader, objName, position, scale, scene, objCustomName, center) {
	loader.load(objName,
		function (object) {
			object.position.set(position.x, position.y, position.z);
			object.scale.set(scale, scale, scale);

			object.traverse(function (child) { // adds shadows
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;

					if (child.material.map) child.material.map.anisotropy = 16;
				}
			});

			if (objCustomName != undefined) {
				object.name = objCustomName;
			} else {
				object.name = objName;
			}

			scene.add(object);

			if (loadingSmall) { // if loading into small scene, set global variable
				smallScenePart = smallScene.getObjectByName("smallSceneAnimal");
				if (center != undefined && center) { // if needs to be centered
					let mesh = object.children[0];
					let geometry = mesh.geometry;
					geometry.computeBoundingBox();

					let box = new THREE.Box3().setFromObject(mesh);
					box.center(mesh.position); // this re-sets the mesh position
					mesh.position.multiplyScalar(-1);

					fitCameraToObject(smallCamera, object); // fits camera to object
				}
				loadingSmall = false;
			}
		},
		function () {},
		function (err) {
			console.log(err);
		}
	);
}

/**
 * Randomizes position, rotation, scale in matrix4
 * https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
 * @param {Object} copySettings - settings containing constraints on scale, position, rotation
 * @param {matrix4} matrix - matrix object that has it's values randomized
 */
const randomizeMatrix = function () {

	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();

	return function (copySettings, matrix) {
		let distFromCenter = Math.sqrt(getRandomNumber(copySettings.randPosition.min ** 2, copySettings.randPosition.max ** 2));
		let angle = Math.random() * 2 * Math.PI;

		position.x = distFromCenter * Math.cos(angle);
		position.z = distFromCenter * Math.sin(angle); // it's Z, cause threejs system uses Y for vertical values

		rotation.x = 0;
		rotation.y = getRandomNumber(copySettings.rotation.min, copySettings.rotation.max) * Math.PI / 180;
		rotation.z = 0;

		quaternion.setFromEuler(rotation);

		scale.x = scale.y = scale.z = getRandomNumber(copySettings.scale.min, copySettings.scale.max);

		matrix.compose(position, quaternion, scale);
	};

}();

/**
 * Loads foliage with int oscene
 * @param {string} objName - name of object
 * @param {string} mtlName - material name
 * @param {number} nTufts - number of instances
 * @param {Scene} scene - target scene
 * @param {Object} copySettings - settings for instances, used for randomizing
 * @param {string} customTag - tag for objects
 */
function loadFoliage(objName, mtlName, nTufts, scene, copySettings, customTag) {
	let mtlLoader = new THREE.MTLLoader();
	let path = './models/foliage/';

	mtlLoader.setPath(path);
	mtlLoader.load(mtlName + '.mtl',
		function (materials) {
			materials.preload();

			let loader = new THREE.OBJLoader();
			loader.setMaterials(materials);
			loader.setPath(path);

			loader.load(objName + ".obj",
				function (object) {
					// sets default position, scale, will be changed later
					object.position.set(0, -0.1, 0);
					object.scale.set(1, 1, 1);

					let matrixMatrix = []; // matrix of matrixes
					for (let i = 0; i < object.children.length; i++) {
						const matrix = new THREE.Matrix4();

						// creates instances in mesh
						const mesh = new THREE.InstancedMesh(object.children[i].geometry, object.children[i].material, nTufts);

						mesh.receiveShadow = true;
						if (copySettings.shadows) {
							mesh.castShadow = true;
						} else {
							mesh.castShadow = false;
						}

						// randomizes matrix for each instance
						for (let j = 0; j < nTufts; j++) {

							if (i == 0) {
								randomizeMatrix(copySettings, matrix);
								if (object.children.length > 1) {
									matrixMatrix[j] = matrix.clone();
								}
							}

							if (object.children.length == 1) {
								mesh.setMatrixAt(j, matrix);
							} else {
								mesh.setMatrixAt(j, matrixMatrix[j]);
							}

						}

						mesh.name = mtlName + i;

						if (customTag) {
							mesh.userData.tag = customTag;
						}
						scene.add(mesh);
						//console.log(mesh);
					}
				},
				function () {},
				function (err) {
					console.log(err);
				}
			);
		}
	);
}