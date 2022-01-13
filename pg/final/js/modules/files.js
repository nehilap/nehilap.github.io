function download(filename, data) {
    let element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function readSingleFileFromDrive(e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        try {

            resetAllParts();
            currentAnimalParts = JSON.parse(contents);
            for (let index = 0; index < currentAnimalParts.length; index++) {
                if (currentAnimalParts[index] == null) {
                    continue;
                }
                let [animal, part] = currentAnimalParts[index].split("_");
                loadAnimalPartObj(animal, part, position = {
                    x: 0,
                    y: -0.01,
                    z: 0
                }, scale = 1, scene, "current" + part);
            }
        } catch (e) {
            console.log(e);
            return;
        }
    };
    reader.readAsText(file);
}