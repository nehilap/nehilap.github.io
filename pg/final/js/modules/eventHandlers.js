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
        let val = envSettings.grassN - 500 < 0 ? 0 : envSettings.grassN - 500;
        setEnvAttribute('grassN', val);
        redrawGrass();
    });
    document.getElementById("+").addEventListener("click", function () {
        setEnvAttribute('grassN', envSettings.grassN + 100);
        redrawGrass();
    });
    document.getElementById("++").addEventListener("click", function () {
        setEnvAttribute('grassN', envSettings.grassN + 1000);
        redrawGrass();
    });
    document.getElementById("+++").addEventListener("click", function () {
        setEnvAttribute('grassN', envSettings.grassN + 10000);
        redrawGrass();
    });
    document.getElementById("0_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', 0);
        redrawTrees();
    });
    document.getElementById("-_tree").addEventListener("click", function () {
        let val = envSettings.treeN - 50 < 0 ? 0 : envSettings.treeN - 50;
        setEnvAttribute('treeN', val);
        redrawTrees();
    });
    document.getElementById("+_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', envSettings.treeN + 5);
        redrawTrees();
    });
    document.getElementById("++_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', envSettings.treeN + 20);
        redrawTrees();
    });
    document.getElementById("+++_tree").addEventListener("click", function () {
        setEnvAttribute('treeN', envSettings.treeN + 100);
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
        redrawTrees();
        toggleClass('tree_spruce', 'active');
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
        // TODO
    });
    document.getElementById("hideMenuButton").addEventListener("click", function () {
        toggleHidden('menu', ['menu'], ['hideMenuButton']);
    });
}


addEventHandlers();