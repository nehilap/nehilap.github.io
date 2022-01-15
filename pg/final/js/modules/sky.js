/**
 * 
 * Peter Nehila
 * file containing methods for working with skybox
 * 
 */

const skyTexturesPath = './images/sky/';
const skyTextures = [skyTexturesPath + 'sky.jpg', skyTexturesPath + 'sky_day-min.jpg', skyTexturesPath + 'sky_sunset-min.jpg', skyTexturesPath + 'cropped-starglobe-maya-render.jpg'];
var skyIndex = 0;

/**
 * Changes sky texture of sphere skybox, increments skyIndex
 * global variables: sphere, skyIndex
 */
function toggleSky() {
    skyIndex = skyIndex % skyTextures.length;

    skyBox.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = new THREE.TextureLoader().load(skyTextures[skyIndex]);
            child.material.needsUpdate = true;
        }
    });
    skyIndex++;
}