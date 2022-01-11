const skyTextures = ['texture/sky.jpg', 'texture/sky_day-min.png', 'texture/sky_sunset-min.png', 'texture/cropped-starglobe-maya-render.jpg'];
var skyIndex = 0;

function toggleSky(event) {
    console.log(event);
    skyIndex = skyIndex % skyTextures.length;

    sphere.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.map = THREE.ImageUtils.loadTexture(skyTextures[skyIndex]);
            child.material.needsUpdate = true;
        }
    });
    skyIndex++;
}