const skyTextures = ['texture/sky.jpg', 'texture/sky_day-min.jpg', 'texture/sky_sunset-min.jpg', 'texture/cropped-starglobe-maya-render.jpg'];
var skyIndex = 0;

function toggleSky() {
    skyIndex = skyIndex % skyTextures.length;

    sphere.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = new THREE.TextureLoader().load(skyTextures[skyIndex]);
            child.material.needsUpdate = true;
        }
    });
    skyIndex++;
}