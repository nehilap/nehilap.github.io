/**
 * 
 * Peter Nehila
 * file containing methods for working with files (reading / downloading)
 * 
 */


/**
 * Opens download dialogue
 * @param {string} filename - name of file 
 * @param {Object} data - data in correct form with mime type defined
 */
function download(filename, data) {
    let element = document.createElement('a');
    element.setAttribute('href', data);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Reads a single file
 * @param {Object} event - event triggered from file reader
 * @param {Function} onLoadFunction - function to be called after file is loaded, contents are provided as argument to this function
 * @returns 
 */
function readSingleFileFromDrive(event, onLoadFunction) {
    let file = event.target.files[0];
    if (!file) {
        return;
    }

    if(!checkFileType(file.name, ['txt'])){
        customAlert("Nesprávny typ súboru!!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        try {
            onLoadFunction(contents);
        } catch (e) {
            console.log(e);
            return;
        }
    };
    reader.readAsText(file);
}

/**
 * Checks if file is of any of the provided types
 * @param {string} filename - name of file
 * @param {array[string]} fileTypes - list of accepted file types
 * @returns {boolean} - true if file is of type provided in array
 */
function checkFileType(filename, fileTypes) {
    let parts = filename.split('.');
    let fileType = parts[parts.length - 1];

    for(let i = 0; i < fileTypes.length; i++) {
        if(fileTypes[i] == fileType.toLowerCase()){
            return true;
        }
    }

    return false;
  }