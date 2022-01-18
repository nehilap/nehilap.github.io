/**
 * 
 * Peter Nehila
 * file containing methods for working with envronment
 * 
 */

var envSettings = {
    grassTag: "grass",
    grassMtl: ["grass_normal"], // 1+
    grassN: 20000,
    treeTag: "tree",
    treeMtl: ["pine_tree", "spruce_tree1", "spruce_tree2", "savannah_tree1", "normal_tree"], // 1+
    treeN: 20,
    groundColor: 0x90c14d,
};

const maxGrassN = 200 * 1000;
const grassTypes = ['grass_yellow', 'grass_normal', 'grass_lively', 'grass_dark'];

const maxTreeN = 1 * 1000;
const treeTypes = ['normal_tree', 'savannah_tree1', 'pine_tree', 'spruce_tree1', 'spruce_tree2'];

/**
 * Sets value of 1 attribute in object envSettings
 * @param {string} attribute 
 * @param {Object} value 
 */
function setEnvAttribute(attribute, value) {
    envSettings[attribute] = value;
}

/**
 * Add / delete value from array of 1 attribute
 * @param {string} attribute 
 * @param {Object} value 
 */
function toggleEnvAttrInArr(attribute, value) {
    if (envSettings[attribute].includes(value)) {
        envSettings[attribute] = removeEnvAttrFromArr(envSettings[attribute], value);
    } else {
        envSettings[attribute].push(value);
    }
}

/**
 * Delete all occurences of value in array
 * @param {array} arr 
 * @param {Object} value 
 * @returns {array}
 */
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

/**
 * Redraws grass
 * global variables: scene, envSettings
 */
function redrawGrass() {
    let grassObjs = [];
    scene.getObjectsByTag(envSettings.grassTag, grassObjs);

    for (let index = 0; index < grassObjs.length; index++) {
        scene.remove(grassObjs[index]);
    }

    // calculate how many tufts each color should have, then generates grass of each color
    let grassTufts = Math.min(envSettings.grassN, maxGrassN) / envSettings.grassMtl.length;
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
        }, envSettings.grassTag, "Lambert");
    }
}

/**
 * Redraws trees
 * global variables: scene, envSettings
 */
function redrawTrees() {
    let treeObjs = [];
    scene.getObjectsByTag(envSettings.treeTag, treeObjs);

    for (let index = 0; index < treeObjs.length; index++) {
        scene.remove(treeObjs[index]);
    }

    // calculate how many tufts each tree type should have, then generates trees of each type
    let treeTufts = Math.min(envSettings.treeN, maxTreeN) / envSettings.treeMtl.length;
    for (let index = 0; index < envSettings.treeMtl.length; index++) {
        loadFoliage(envSettings.treeMtl[index], envSettings.treeMtl[index], treeTufts, scene, copySettings = {
            randPosition: {
                min: planeDiameter / 4.5,
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
        }, envSettings.treeTag, false);
    }
}

/**
 * Changes color of main plane (sets "ground color")
 * global variables: scene, envSettings
 */
function reSetPlaneColor() {
    scene.getObjectByName('plane').material.color.setHex(envSettings.groundColor);
}