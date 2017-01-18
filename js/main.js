
function setCurrentAge(age) {
	// Age is in years.
	zincRenderer.setMorphsTime(age * 30);
}

function updateUniformsWithDetails() {
	var age = Math.floor(subjectDetails.age + 0.5);
	var start_age = subjectDetails.ageStartedSmoking * 0.01;
	if (start_age < 0.0)
		start_age = 0.0;
	var height = subjectDetails.height;
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity];
	cellUniforms["starting_time"].value = start_age;
	cellUniforms["severity"].value = subjectDetails.packsPerDay * 1.0;
	flowUniforms["starting_time"].value = start_age;
	flowUniforms["severity"].value = subjectDetails.packsPerDay * 1.0;
	flowUniforms["height"].value = height * 1.0;
	flowUniforms["weight"].value = 70.0;
	flowUniforms["asthmaSeverity"].value = asthmaScaling * 1.0;
}

function endLoading() {
	loadingPage.endLoading();
}

function beginLoading() {
	loadingPage.beginLoading();
}

function updateUi() {
	//updateFEV1Plot();
	updateDynamicPVPlot();
	updateUiValues();
}

var skip = 0;

function updateUniforms(zincRenderer, cellUniforms, flowUniforms) {
	return function () {
		var directionalLight = zincRenderer.getCurrentScene().directionalLight;
		cellUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		flowUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		var time = zincRenderer.getCurrentTime()/3000.0;  // (0, 1])
		skip++;
		if (skip > 100) {
			// console.log(flowUniforms['severity']);
			// console.log(flowUniforms['asthmaSeverity']);
			// console.log(time);
			skip = 0;
		}
		cellUniforms["time"].value = time;
		flowUniforms["time"].value = time;

		var age = parseInt(time * 100.0);
		if (age != rendered_age) {
			setRenderedAge(lung_age_display, age);
			rendered_age = age;
		}

		var timeIncrement = 0.0;
		if (!currentDate) { 
			currentDate = new Date();
		} else {
			var oldDate = currentDate;
			currentDate = new Date();
			timeIncrement = currentDate.getTime() - oldDate.getTime();
		}
		currentBreathingTime = currentBreathingTime + timeIncrement;
		var breathing_cycle = 0.0;
		if (currentBreathingTime > 4000.0) {
			currentBreathingTime = currentBreathingTime - 4000.0;
			breathing_cycle = currentBreathingTime / 2000.0;
			if (breath == 1) {
				breath = 2;
			} else {
				breath = 1;
			}
		} else if (currentBreathingTime > 2000.0) {
			breathing_cycle = (4000.0 - currentBreathingTime) / 2000.0;
		} else {
			breathing_cycle = currentBreathingTime / 2000.0;
		}

		var trace_time = breath == 2 ? currentBreathingTime / 8000.0 + 0.5 : currentBreathingTime / 8000.0;
		dynamic_p_v_plot.updateTrace(currentBreathingTime / 4000.0);

		flowUniforms["constrict"].value = subjectDetails.fraction_constrict; 
		flowUniforms["breathing_cycle"].value = breathing_cycle;
		cellUniforms["breathing_cycle"].value = breathing_cycle;
	};
}

function getLungFunctionValues() {
	var values = new lungFunctionValues();
	var constrict = subjectDetails.fraction_constrict;
	var age_range = currentInterfaceState.age_range;
	var array_values = dataLookup[constrict][age_range];
	values.deadspace = array_values[0];
	values.resistance = array_values[1];
	values.compliance = array_values[2];
	values.work = array_values[3];
	values.pao2 = array_values[4];

	return values;
}

function updateUiValues() {
	var values = getLungFunctionValues();
	resistance_element = document.getElementById("resistance_value");
	resistance_element.innerHTML = "<p>" + values.resistance + "</p>";
	deadspace_element = document.getElementById("deadspace_value");
	deadspace_element.innerHTML = "<p>" + values.deadspace + "</p>";
	compliance_element = document.getElementById("compliance_value");
	compliance_element.innerHTML = "<p>" + values.compliance + "</p>";
	work_element = document.getElementById("work_value");
	work_element.innerHTML = "<p>" + values.work + "</p>";
	pao2_element = document.getElementById("pao2_value");
	pao2_element.innerHTML = "<p>" + values.pao2 + "</p>";
}

function isSceneInitialised(scene_name) {
	var result = false;
	if (scene_name == "Surface") {
		result = surfaceStatus["initialised"];
	} else if (scene_name == "Airways") {
		result = airwaysStatus["initialised"];
	}
	
	return result;
}

var modelDownloadError = function(model_name, scene) {
	console.log('Error downloading model: ' + model_name);
}

function updateModelDownloadProgress(scene_name) {
	return function(progress) {
		var message = "";
		var element = document.getElementById("loadingMessage");
		message = "<p>Loading " + scene_name + " ... (" + parseInt(progress["loaded"]/1024).toString() + " KB of " + parseInt(progress["total"]/1024).toString() + " KB).</p>";
		loadingPage.setLoadingText(message);
	};
}

var updateModelDownloadProgressOriginal = function(model_name, scene, model_ready) {
	var error = false;
	if (scene) {
		var message = "";
		var element = document.getElementById("loadingMessage");
		if (model_ready) {
			message = "<p>Loading " + model_name + " ... Completed.</p>";
		} else {
			var progress = scene.getDownloadProgress();
			if (progress[2] == false) {
				var totalString = "";
				if (progress.totalSize > 0)
					totalString = parseInt(progress[0]/1024).toString() + " KB";
				message = "<p>Loading " + model_name + " ... (" + parseInt(progress[1]/1024).toString() + " KB" + (totalString ? "/" + totalString : "") + ").</p>";
			} else {
				error = true;
				message = "<p>Loading " + model_name + " ... Failed to load models. Please try again later.</p>";
			}
		}
		loadingPage.setLoadingText(message);
	}
	if (model_ready) {
		setTimeout(endLoading, 1000);
	}
	else if (error == false) {
		setTimeout(updateModelDownloadProgress, 500, model_name, scene, isSceneInitialised(model_name));
	}
}

function meshReady(sceneName, shaderText, uniforms) {
	return function(mygeometry) {
		var material = new THREE.ShaderMaterial( {
			vertexShader: shaderText[0],
			fragmentShader: shaderText[1],
			uniforms: uniforms,
		} );
		material.side = THREE.DoubleSide;
		if (sceneName == "Surface") {
			surfaceStatus.initialised = true;
			material.transparent = false;
			mygeometry.setMaterial(material);
			surfaceStatus.scene.viewAll();
		} else if (sceneName == "Airways") {
			airwaysStatus.initialised = true;
			airwaysStatus.scene.addZincGeometry(mygeometry, 10001, undefined, undefined, false, false, true, undefined, material);
			setCurrentAge(100);
			airwaysStatus.scene.viewAll();
		} else if (sceneName == "Lungs") {
			lungsStatus.initialised = true;
			lungsStatus.scene.viewAll();
		} else if (scene_names.includes(sceneName)) {
			sceneStatuses[sceneName].initialised = true;
			sceneStatuses[sceneName].scene.addZincGeometry(mygeometry, 10001, undefined, undefined, false, false, true, undefined, material);
			sceneStatuses[sceneName].scene.viewAll();
		}
		updateUniformsWithDetails();
		var element = document.getElementById("loadingMessage");
		loadingPage.setLoadingText("<p>Loading " + sceneName + " ... Completed.</p>");
		setTimeout(endLoading, 1000);
	}
}
		
function initSurface(scene) {
	loadExternalFiles(['shaders/clean_cell.vs', 'shaders/clean_cell.fs'], function (shaderText) {
		scene.loadFromViewURL('surface/surface', meshReady(scene.sceneName, shaderText, cellUniforms));
	}, function (url) {
	    alert('Failed to download "' + url + '"');
	});
}

// function initAirways(scene) {
// 	loadExternalFiles(['shaders/dynamic_flow.vs', 'shaders/dynamic_flow.fs'], function (shaderText) {
// 		scene.loadFromViewURL('airways/smoker_and_asthmatic_flow', meshReady(scene.sceneName, shaderText, cellUniforms), );
// 	}, function (url) {
// 	    alert('Failed to download "' + url + '"');
// 	});
// }

function initAirways(scene) {
	scene.loadViewURL('airways/airways_view.json')
	loadExternalFiles(['shaders/airways.vs', 'shaders/airways.fs'], function (shaderText) {
		loadURLsIntoBufferGeometry('airways/smoker_and_asthmatic_flow_1.json', meshReady(scene.sceneName, shaderText, flowUniforms), updateModelDownloadProgress(scene.sceneName, scene, isSceneInitialised(scene.sceneName), modelDownloadError(scene.sceneName, scene)));
	}, function (url) {
	    alert('Failed to download "' + url + '"');
	});
}

function initModel(scene) {
	scene.loadViewURL('airways/airways_view.json');
	loadExternalFiles(['shaders/airways.vs', 'shaders/airways.fs'], function (shaderText) {
		loadURLsIntoNewBufferGeometry('airways/' + scene.sceneName + '_1.json', 
			meshReady(scene.sceneName, shaderText, flowUniforms), 
			updateModelDownloadProgress(scene.sceneName), 
			function(scene) {
				modelDownloadError(scene.sceneName, scene);
			}
		);
	}, function (url) {
	    alert('Failed to download "' + url + '"');
	});
}

function initScene(scene_name) {
	beginLoading();
	scene = zincRenderer.createScene(scene_name);
	if (scene_name == "Surface") {
		initSurface(scene);
	} else if (scene_name == "Airways") {
		initAirways(scene);
	} else if (scene_names.includes(scene_name)) {
		initModel(scene);
	} else {
		console.log("Trying to initialise an undefined scene!!!")
	}
	// updateModelDownloadProgress(scene_name, scene, isSceneInitialised(scene_name));
	
	return scene;
}

function setScene(scene_name) {
	var currentScene = undefined;
	if (scene_name == "Surface") {
		if (!surfaceStatus["initialised"]) {
			surfaceStatus["scene"] = initScene(scene_name);
		}
		currentScene = surfaceStatus["scene"];
	} else if (scene_name == "Airways") {
		if (!airwaysStatus["initialised"]) {
			airwaysStatus["scene"] = initScene(scene_name);
		}
		currentScene = airwaysStatus["scene"];
	} else if (scene_names.includes(scene_name)) {
		if (!sceneStatuses[scene_name]["initialised"]) {
			sceneStatuses[scene_name]["scene"] = initScene(scene_name);
		}
		currentScene = sceneStatuses[scene_name]["scene"];
	} else {
		console.log("Trying to set undefined scene!!!!")
	}
	zincRenderer.setCurrentScene(currentScene);
}

function modelButtonClicked(model_name) {
	setScene(model_name);
}

function viewModel(model_range, model_name) {
	var full_model_name = model_range + model_name;
	setScene(full_model_name);
}

function initZinc() {
	var errorString = undefined;
	if ( ! Detector.webgl )
		errorString = Detector.getWebGLErrorMessage();
	if (errorString == undefined) {
		zincRenderer = new Zinc.Renderer(container, window);
		zincRenderer.initialiseVisualisation();
		zincRenderer.addPreRenderCallbackFunction(updateUniforms(zincRenderer, cellUniforms, flowUniforms));
		zincRenderer.setPlayRate(500);
		zincRenderer.playAnimation = false;
		zincRenderer.animate();
	} else {
		errorString = "WebGL is required to display the interactive 3D models.<br>" + errorString + "<br>";
		var element = undefined;
		element = document.getElementById("loadingOverlay");
		if (element) {
			element.innerHTML = errorString;
			element.onclick = endLoading;
		}
	}
}

function resetSubjectDetails() {
	subjectDetails = new person(11, 153, "Male");
}

function resetInterfaceState() {
	currentInterfaceState = new interfaceState();
}

function setValueDisplay(element, value) {
	var value_display = undefined;
	if (element) {
		value_display = element.getElementsByClassName('ValueDisplay')[0];
		if (!value_display) {
			value_display = element.getElementsByClassName('ValueWideDisplay')[0];
		}
		value_display.innerHTML = value;
	}
}

function setInputsToSubjectDetailsValues() {
	var fraction_constrict_input = document.getElementById("fraction_constrict_input");
	var height_input = document.getElementById("height_input");
	var gender_input = document.getElementById("gender_input");
	var fev_input = document.getElementById("fev_input");

	setValueDisplay(fraction_constrict_input, subjectDetails.fraction_constrict);
	setValueDisplay(height_input, subjectDetails.height);
	setValueDisplay(gender_input, subjectDetails.gender == 'Male' ? 'M' : 'F');
	setValueDisplay(fev_input, subjectDetails.FEV1);	
	setRenderedAge(lung_age_display, subjectDetails.age);
}

function setPage(pageIndex) {
	var elements = document.getElementsByClassName("toggleByPageNumber");
	var elements_length = elements.length;
	for (var i = 0; i < elements_length; i++) {
		var e = elements[i];
		if (e.classList.contains("page_" + pageIndex)) {
			e.style.display = "";
		} else if (pageIndex > 0 && e.classList.contains("page_natural")) {
			e.style.display = "";
		} else {
			e.style.display = "none";
		}
	}
	// fev1_plot.renderPlot();
	// breathing_plot.setActive(pageIndex == 1 ? true : false);
        dynamic_p_v_plot.setActive(pageIndex == 3 ? true : false);
}

function setSubjectDetailsValue(identifier, value) {
	if (identifier == "height_input") {
		subjectDetails.height = value;
	} else if (identifier == "fraction_constrict_input") {
		subjectDetails.fraction_constrict = value;
	} else if (identifier == "age_input") {
		subjectDetails.age = value;
	} else if (identifier == "gender_input") {
		subjectDetails.gender = value;
	} else if (identifier == "fev_input") {
		subjectDetails.FEV1 = value;
	} else {
		console.log("Uh Oh unknown identifier " + identifier + " with value: " + value);
	}
}

function setInterfaceState(attribute, value) {
	currentInterfaceState[attribute] = value;
	viewModel(currentInterfaceState.age_range, currentInterfaceState.active_mode);
}

function startAgain() {
	resetSubjectDetails();
	resetInterfaceState();
	
	setPage(3);
	setInputsToSubjectDetailsValues();
	
	// modelButtonClicked("Airways");
	var age_range_input = document.getElementById("age_range_input");
	setValueDisplay(age_range_input, currentInterfaceState.age_range == 'young' ? 'Y' : 'O');	

	// viewModel(currentInterfaceState.age_range, currentInterfaceState.active_mode);

	var asthma_button_div = document.getElementById('asthma_condition');
	asthmaConditionClicked(asthma_button_div.children[0]);
	
	// var smoking_packs_div = document.getElementById('smoking_packs');
	// smokingPacksClicked(smoking_packs_div.children[0]);

	updateUi();
}

function resetViewButtonClicked() {
	zincRenderer.viewAll();
}

function updateSlider(slideAmount) {
	this.zincRenderer.setMorphsTime(slideAmount * 30);
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function resetScreenSaverTimer() {
    // console.log('reset screen saver timer');
}

function initialiseScreenSaver() {
    document.body.addEventListener('mousedown', resetScreenSaverTimer, true);
    document.body.addEventListener('touchstart', resetScreenSaverTimer, true);
}

function initialiseSceneStatuses() {
	sceneStatuses = {};
	scene_names = [];
	for (var i = 0; i < interface_ranges.length ; i++) {
		var range = interface_ranges[i];
		for (var j = 0; j < mode_types.length; j++) {
			var mode_type = mode_types[j];
			// sceneStatuses[range + mode_type] = undefined;
			sceneStatuses[range + mode_type] = new sceneStatus();
			scene_names.push(range + mode_type);
		}
	}
};

require(["js/controller/fev1", 
	"js/controller/dynamic_p_v",
	"js/controller/breathing",
	"js/controller/breathing_blood_air",
	"js/controller/asthma_volume",
	"js/controller/asthma_flow",
	"dojo/domReady!"], function(FEV1, DynamicPV, Breathing, BloodAir, AsthmaVolume, AsthmaFlow){
	
	dynamic_p_v_plot = new DynamicPV();
	fev1_plot = new FEV1();
	breathing_plot = new Breathing();
	breathing_blood_air_plot = new BloodAir();
	asthma_volume_plot = new AsthmaVolume();
	asthma_flow_plot = new AsthmaFlow();
	
	initialiseSceneStatuses();
	resetSubjectDetails();
	resetInterfaceState();
	initZinc();
	initPlots();

	startAgain();
	setPage(0);
	
	var body = document.body;
	requestFullScreen(body);
	initialiseScreenSaver();
});

