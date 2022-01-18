/**
 * 
 * Peter Nehila
 * file containing methods for setting handlers to html elements
 * 
 */

/**
 * Sets onclick and other handlers to html elements
 */
function addEventHandlers() {
    document.getElementById("close_credits").addEventListener("click", function () {
        toggleHidden('credits', ['credits'], []);
    });
    document.getElementById("toggle_sky").addEventListener("click", function () {
        toggleSky();
    });
    document.getElementById("toggle_light").addEventListener("click", function () {
        toggleLight();
    });
    document.getElementById("take_screenshot").addEventListener("click", function () {
        takeScreenshot();
    });
    document.getElementById("free_mode").addEventListener("click", function () {
        setGameMode('free');
    });
    document.getElementById("play_mode").addEventListener("click", function () {
        setGameMode('animal');
        showBuilder();
		loadAnimalPartIntoSmallScene();
        let caretElement = document.getElementById("animalBuilderCaret");
        if(caretElement.classList.contains("fa-caret-right")) {
            openCaret(caretElement);
        }
    });
    document.getElementById("toggle_animal_builder").addEventListener("click", function () {
        toggleAnimalBuilder();
        toggleCaret('animalBuilderCaret');
    });
    document.getElementById("switch_animal_part_left").addEventListener("click", function () {
        switchAnimalPart(-1);
    });
    document.getElementById("switch_animal_part_right").addEventListener("click", function () {
        switchAnimalPart(1);
    });
    document.getElementById("stopRotationButton").addEventListener("click", function () {
        stopRotation();
    });
    document.getElementById("set_part").addEventListener("click", function () {
        setPart();
    });
    document.getElementById("switch_animal_part_category").addEventListener("click", function () {
        switchAnimalPartCategory();
    });
    document.getElementById("remove_part").addEventListener("click", function () {
        removePart();
    });
    document.getElementById("reset_all_parts").addEventListener("click", function () {
        resetAllParts();
    });
    document.getElementById("toggle_foliage_settings").addEventListener("click", function () {
        toggleHidden('foliage_settings', ['foliage_settings'], []);
        toggleCaret('foliageCaret');
    });
    document.getElementById("0").addEventListener("click", function () {
        setEnvAttribute('grassN', 0);
        redrawGrass();
    });
    document.getElementById("-").addEventListener("click", function () {
        setEnvAttribute('grassN', Math.max(envSettings.grassN - 2000, 0));
        redrawGrass();
    });
    document.getElementById("+").addEventListener("click", function () {
        setEnvAttribute('grassN', Math.min(envSettings.grassN + 100, maxGrassN));
        redrawGrass();
    });
    document.getElementById("++").addEventListener("click", function () {
        setEnvAttribute('grassN', Math.min(envSettings.grassN + 1000, maxGrassN));
        redrawGrass();
    });
    document.getElementById("+++").addEventListener("click", function () {
        setEnvAttribute('grassN', Math.min(envSettings.grassN + 10000, maxGrassN));
        redrawGrass();
    });
    document.getElementById("0_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', 0);
        redrawTrees();
    });
    document.getElementById("-_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', Math.max(envSettings.treeN - 50, 0));
        redrawTrees();
    });
    document.getElementById("+_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', Math.min(envSettings.treeN + 5, maxTreeN));
        redrawTrees();
    });
    document.getElementById("++_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', Math.min(envSettings.treeN + 20, maxTreeN));
        redrawTrees();
    });
    document.getElementById("+++_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', Math.min(envSettings.treeN + 100, maxTreeN));
        redrawTrees();
    });
    document.getElementById("grass_yellow").addEventListener("click", function () {
        toggleEnvAttrInArr('grassMtl', 'grass_yellow');
        redrawGrass();
        toggleClass('grass_yellow', 'active');
    });
    document.getElementById("grass_normal").addEventListener("click", function () {
        toggleEnvAttrInArr('grassMtl', 'grass_normal');
        redrawGrass();
        toggleClass('grass_normal', 'active');
    });
    document.getElementById("grass_lively").addEventListener("click", function () {
        toggleEnvAttrInArr('grassMtl', 'grass_lively');
        redrawGrass();
        toggleClass('grass_lively', 'active');
    });
    document.getElementById("grass_dark").addEventListener("click", function () {
        toggleEnvAttrInArr('grassMtl', 'grass_dark');
        redrawGrass();
        toggleClass('grass_dark', 'active');
    });
    document.getElementById("tree_normal").addEventListener("click", function () {
        toggleEnvAttrInArr('treeMtl', 'normal_tree');
        redrawTrees();
        toggleClass('tree_normal', 'active');
    });
    document.getElementById("tree_savannah").addEventListener("click", function () {
        toggleEnvAttrInArr('treeMtl', 'savannah_tree1');
        redrawTrees();
        toggleClass('tree_savannah', 'active');
    });
    document.getElementById("tree_pine").addEventListener("click", function () {
        toggleEnvAttrInArr('treeMtl', 'pine_tree');
        redrawTrees();
        toggleClass('tree_pine', 'active');
    });
    document.getElementById("tree_spruce").addEventListener("click", function () {
        toggleEnvAttrInArr('treeMtl', 'spruce_tree1');
        toggleEnvAttrInArr('treeMtl', 'spruce_tree2');
        redrawTrees();
        toggleClass('tree_spruce', 'active');
    });
    document.getElementById("ground_normal").addEventListener("click", function () {
        setEnvAttribute('groundColor', 0x90c14d);
        reSetPlaneColor();
        setGroundColorButtonsActive();
    });
    document.getElementById("ground_yellow").addEventListener("click", function () {
        setEnvAttribute('groundColor', 0xbeac3f);
        reSetPlaneColor();
        setGroundColorButtonsActive();
    });
    document.getElementById("ground_dark").addEventListener("click", function () {
        setEnvAttribute('groundColor', 0x2e6431);
        reSetPlaneColor();
        setGroundColorButtonsActive();
    });
    document.getElementById("save_build").addEventListener("click", function () {
        saveBuild();
    });
    document.getElementById("load_build").addEventListener("click", function () {
        readBuild();
    });
    document.getElementById("hide_menu").addEventListener("click", function () {
        toggleHidden('menu', ['menu'], ['hideMenuButton']);
    });
    document.getElementById("show_credits").addEventListener("click", function () {
        toggleHidden('credits', ['credits'], []);
    });
    document.getElementById("show_tutorial").addEventListener("click", function () {
        toggleHidden('tutorial', ['tutorial'], []);
    });
    document.getElementById("show_tutorial2").addEventListener("click", function () {
        toggleHidden('tutorial', ['tutorial'], []);
    });
    document.getElementById("hideMenuButton").addEventListener("click", function () {
        toggleHidden('menu', ['menu'], ['hideMenuButton']);
    });
    document.getElementById("toggle_sound").addEventListener("click", function () {
        toggleSound();
    });
    document.getElementById("close_tutorial").addEventListener("click", function () {
        toggleHidden('tutorial', ['tutorial'], []);
    });
    document.getElementById("close_alert").addEventListener("click", function () {
        toggleHidden('alert', ['alert'], []);
    });
}


addEventHandlers();