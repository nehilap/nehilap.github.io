var envSettings = {
    grassTag: "grass",
    grassMtl: ["grass_normal"], // 1+
    grassN: 30000,
    treeTag: "tree",
    treeMtl: ["pine_tree", "spruce_tree1", "savannah_tree1"], // 1+
    treeN: 20,
};

function setEnvAttribute(attribute, value) {
    envSettings[attribute] = value;
}

function toggleEnvAttrInArr(attribute, value) {
    if (envSettings[attribute].includes(value)) {
        envSettings[attribute] = removeEnvAttrFromArr(envSettings[attribute], value);
    } else {
        envSettings[attribute].push(value);
    }
}

function removeEnvAttrFromArr(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

function redrawGrass() {
    let grassObjs = [];
    scene.getObjectsByTag(envSettings.grassTag, grassObjs);

    for (let index = 0; index < grassObjs.length; index++) {
        scene.remove(grassObjs[index]);
    }

    let grassTufts = envSettings.grassN / envSettings.grassMtl.length;
    for (let index = 0; index < envSettings.grassMtl.length; index++) {
        loadFoliage("grass", envSettings.grassMtl[index], grassTufts, scene, copySettings = {
            randPosition: {
                min: 0.,
                max: planeDiameter - 1
            },
            scale: {
                min: 0.5,
                max: 1.5
            },
            rotation: {
                min: 0.,
                max: 360.
            },
            shadows: false
        }, envSettings.grassTag);
    }
}

function redrawTrees() {
    let treeObjs = [];
    scene.getObjectsByTag(envSettings.treeTag, treeObjs);

    for (let index = 0; index < treeObjs.length; index++) {
        scene.remove(treeObjs[index]);
    }

    let treeTufts = envSettings.treeN / envSettings.treeMtl.length;
    for (let index = 0; index < envSettings.treeMtl.length; index++) {
        loadFoliage(envSettings.treeMtl[index], envSettings.treeMtl[index], treeTufts, scene, copySettings = {
            randPosition: {
                min: planeDiameter / 4,
                max: planeDiameter - 1
            },
            scale: {
                min: 0.5,
                max: 2
            },
            rotation: {
                min: 0.,
                max: 360.
            },
            shadows: true
        }, envSettings.treeTag);
    }
}