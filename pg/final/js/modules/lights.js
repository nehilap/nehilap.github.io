var lightIndex = 0;

function toggleLight() {
    for (let i = 0; i < currentLights.length; i++) {
        scene.remove(currentLights[i]);
    }
    currentLights = [];

    if (lightIndex == 0) {
        currentLights = basicLights();

        lightIndex = 1;
    } else if (lightIndex == 1) {
        currentLights = sunsetLights();

        lightIndex = 2;
    } else if (lightIndex == 2) {
        currentLights = nightLights();

        lightIndex = 3;
    } else {
        currentLights = lookoutLights();

        lightIndex = 0;
    }
}

function addCounterLight(){
    // protisvetlo aby neboli objekty "neviditelne" z druhej strany
    let spotlight1 = new THREE.PointLight('rgb(255,255,255)');
    spotlight1.angle = Math.PI / 3;
    spotlight1.position.set(-163.5, 30, +70);
    spotlight1.intensity = 0.075;
    spotlight1.lookAt(0, 0, 0);
    scene.add(spotlight1);
    
    let spotlight2 = new THREE.PointLight('rgb(255,255,255)');
    spotlight2.angle = Math.PI / 3;
    spotlight2.position.set(+70, 30, +150);
    spotlight2.intensity = 0.075;
    spotlight2.lookAt(0, 0, 0);
    scene.add(spotlight2);
}

function basicLights() {
    let ambientLight = new THREE.AmbientLight(0xeeeeee, 0.8);
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

    return [ambientLight, spotlight];
}

function sunsetLights() {
    const skyColor = 'rgb(255, 200, 50)';
    const groundColor = 0xB1E1FF;
    const intensity = 0.7;
    const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(hemiLight);

    const pointLight = new THREE.PointLight('rgb(255,255,255)');
    pointLight.position.set(+150, 50, -15);
    pointLight.intensity = 1;
    pointLight.penumbra = 0.4;
    pointLight.castShadow = true;
    pointLight.penumbra = 1;

    pointLight.shadow.bias = -0.0001;
    pointLight.shadow.mapSize.width = 1024 * 4;
    pointLight.shadow.mapSize.height = 1024 * 4;

    scene.add(pointLight);

    return [hemiLight, pointLight];

}

function nightLights() {
    let ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3);
    scene.add(ambientLight);

    lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);
    scene.add(lightTarget);

    let spotlight = new THREE.SpotLight('rgb(150,150,150)');
    spotlight.angle = Math.PI / 3;
    spotlight.position.set(53.5, 50, -50);
    spotlight.intensity = 0.3;
    spotlight.penumbra = 0.2;
    spotlight.target = lightTarget;
    spotlight.castShadow = true;

    spotlight.shadow.bias = -0.0001;
    spotlight.shadow.mapSize.width = 1024 * 4;
    spotlight.shadow.mapSize.height = 1024 * 4;

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
    spotlight.shadow.mapSize.width = 1024 * 4;
    spotlight.shadow.mapSize.height = 1024 * 4;

    scene.add(spotlight);

    let spotlight2 = new THREE.SpotLight('rgb(255,255,255)');
    spotlight2.angle = Math.PI / 3;
    spotlight2.position.set(-13.5, 10, +13);
    spotlight2.intensity = 0.7;
    spotlight2.penumbra = 0.4;
    spotlight2.target = lightTarget;
    //spotlight2.castShadow = true;

    spotlight2.shadow.bias = -0.0001;
    spotlight2.shadow.mapSize.width = 1024 * 4;
    spotlight2.shadow.mapSize.height = 1024 * 4;

    scene.add(spotlight2);

    return [ambientLight, spotlight, spotlight2];
}