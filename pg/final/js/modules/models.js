
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
                    box.center(mesh.position); // this re-sets the mesh position
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
