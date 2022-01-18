/**
 * 
 * Peter Nehila
 * file containing methods for working with lights
 * 
 */
var lightIndex = 0;

/**
 * Replaces current lights, increments lightIndex
 * global variables: scene, lightIndex
 */
function toggleLight() {
    for (let i = 0; i < currentLights.length; i++) {
        scene.remove(currentLights[i]);
    }
    currentLights = [];

    if (lightIndex == 0) {
        currentLights = basicLights();

        lightIndex++;
    } else if (lightIndex == 1) {
        currentLights = sunsetLights();

        lightIndex++;
    } else if (lightIndex == 2) {
        currentLights = nightLights();

        lightIndex++;
    } else {
        currentLights = lookoutLights();

        lightIndex = 0;
    }
}

/**
 * Adds weak counterlights
 */
function addCounterLight() {
    // protisvetlo aby neboli objekty "neviditelne" z druhej strany
    let spotLight1 = new THREE.SpotLight('rgb(255,255,255)');
    spotLight1.angle = Math.PI / 3;
    spotLight1.position.set(-163.5, 30, +70);
    spotLight1.intensity = 0.075;
    spotLight1.lookAt(0, 0, 0);
    scene.add(spotLight1);

    let spotLight2 = new THREE.SpotLight('rgb(255,255,255)');
    spotLight2.angle = Math.PI / 3;
    spotLight2.position.set(+70, 30, +150);
    spotLight2.intensity = 0.075;
    spotLight2.lookAt(0, 0, 0);
    scene.add(spotLight2);
}

/**
 * LIGHTS
 * functions for specific lights
 */

function basicLights() {
    let ambientLight = new THREE.AmbientLight(0xeeeeee, 0.8);
    scene.add(ambientLight);

    lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);

    let pointLight = new THREE.PointLight('rgb(255,255,255)');
    pointLight.angle = Math.PI / 3;
    pointLight.position.set(63, 40, -70);
    pointLight.intensity = 0.8;
    pointLight.target = lightTarget;

    pointLight.castShadow = true;
    pointLight.shadow.bias = -0.0003;
    pointLight.shadow.mapSize.width = maxShadowMapSize;
    pointLight.shadow.mapSize.height = maxShadowMapSize;

    scene.add(pointLight);

    return [ambientLight, pointLight];
}

function sunsetLights() {
    // yellow ambientLight light adds effect of sunset
    const skyColor = 'rgb(255, 200, 50)';
    const intensity = 0.7;
    const ambientLight = new THREE.AmbientLight(skyColor, intensity);
    scene.add(ambientLight);

    // switched to spotlight for better shadow quality
    let spotLight = new THREE.SpotLight('rgb(255,255,255)');
    spotLight.position.set(+70, 30, -5);
    spotLight.intensity = 1;
    spotLight.penumbra = 0.2;
    spotLight.castShadow = true;

    spotLight.shadow.bias = -0.00001;
    spotLight.shadow.mapSize.width = maxShadowMapSize;
    spotLight.shadow.mapSize.height = maxShadowMapSize;

    scene.add(spotLight);

    return [ambientLight, spotLight];

}

function nightLights() {
    let ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3);
    scene.add(ambientLight);

    lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);

    let spotlight = new THREE.SpotLight('rgb(150,150,150)');
    spotlight.angle = Math.PI / 3;
    spotlight.position.set(53, 50, -50);
    spotlight.intensity = 0.3;
    spotlight.penumbra = 0.2;
    spotlight.target = lightTarget;
    spotlight.castShadow = true;

    spotlight.shadow.bias = 0.0000;
    spotlight.shadow.mapSize.width = maxShadowMapSize;
    spotlight.shadow.mapSize.height = maxShadowMapSize;

    scene.add(spotlight);

    return [ambientLight, spotlight];
}

function lookoutLights() {

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
    spotlight.shadow.mapSize.width = maxShadowMapSize;
    spotlight.shadow.mapSize.height = maxShadowMapSize;

    scene.add(spotlight);

    let spotlight2 = new THREE.SpotLight('rgb(255,255,255)');
    spotlight2.angle = Math.PI / 3;
    spotlight2.position.set(-13.5, 10, +13);
    spotlight2.intensity = 0.7;
    spotlight2.penumbra = 0.4;
    spotlight2.target = lightTarget;
    //spotlight2.castShadow = true;

    spotlight2.shadow.bias = -0.0001;
    spotlight2.shadow.mapSize.width = maxShadowMapSize;
    spotlight2.shadow.mapSize.height = maxShadowMapSize;

    scene.add(spotlight2);

    return [ambientLight, spotlight, spotlight2];
}