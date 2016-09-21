var container = document.getElementById( "zinc_rendered_view" );
var zincRenderer = undefined;
var lungsScene = undefined;
var lungMeshIsReady = false;
var airwaysIsReady = false;
var lungDownladStatus = [0, 0, false];
var airwaysDownloadStatus = [0, 0, false];
var renderer_Age = 0;

function lungsMeshReady(shaderText) {
	return function(mygeometry) {
		var lungsMaterial = new THREE.ShaderMaterial( {
			vertexShader: shaderText[0],
			fragmentShader: shaderText[1],
			uniforms: cellUniforms
		} );
		lungsMaterial.side = THREE.DoubleSide;
		mygeometry.setMaterial(lungsMaterial)
		lungMeshIsReady = true;
		updateUniformsWithDetails();
	}
}
		
function updateUniformsWithDetails() {
	var age = Math.floor(userData["Current Age"] + 0.5);
	start_age = userData["Age started smoking"] * 0.01;
	if (start_age < 0.0)
		start_age = 0.0;
	cellUniforms["starting_time"].value = start_age;
	cellUniforms["severity"].value = userData["Packs Per Day"] * 1.0;
	flowUniforms["starting_time"].value = start_age;
	flowUniforms["severity"].value = userData["Packs Per Day"] * 1.0;
}

var cellUniforms = THREE.UniformsUtils.merge( [
	{
		"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
		"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
		"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
		"shininess": { type: "f", value: 100 },
		"diffuse": { type: "c", value: new THREE.Color( 0xeecaa2 ) },
		"ambientLightColor": { type: "c", value: new THREE.Color( 0x444444 ) },
		"directionalLightColor": { type: "c", value: new THREE.Color( 0x888888 ) },
		"directionalLightDirection": { type: "v3", value: new THREE.Vector3()  },
		"time": { type: "f", value: 0.0 },
		"starting_time": { type: "f", value: 0.0 },
		"severity": { type: "f", value: 0.0 },
		"cellsDensity": { type: "f", value: 0.1 },
		"tarDensity":  { type: "f", value: 0.0175}
	}
] );

var flowUniforms = THREE.UniformsUtils.merge( [
{
	"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
	"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
	"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
	"shininess": { type: "f", value: 100 },
	"ambientLightColor": { type: "c", value: new THREE.Color( 0x444444 ) },
	"directionalLightColor": { type: "c", value: new THREE.Color( 0x888888 ) },
	"directionalLightDirection": { type: "v3", value: new THREE.Vector3()  },
	"time": { type: "f", value: 0.0 },
	"starting_time": { type: "f", value: 0.0 },
	"severity": { type: "f", value: 1.0 }
} ] );

var userData = {
	'Current Age': 25,
	'Gender' : "Male",
	'Asthma Severity' : "None",
	'Age started smoking': 18,
	'Packs Per Day': 1.0,
	'Height (cm)' : 180,
	'3D Models' : "Lungs (Tar)",
	'Play Speed' : 500
};

function updateUniforms(zincRenderer, cellUniforms, flowUniforms) {
	return function () {
		var directionalLight = zincRenderer.getCurrentScene().directionalLight;
		cellUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		flowUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		cellUniforms["time"].value = zincRenderer.getCurrentTime()/3000.0;
		flowUniforms["time"].value = zincRenderer.getCurrentTime()/3000.0;
		var age = parseInt(cellUniforms["time"].value *100.0);
		if (age != renderer_Age) {
			renderer_Age = age;
			var element = document.getElementById("renderer_Age");
			if (element)
				element.innerHTML =  "Simulated Age: " + renderer_Age;
		}
		if (zincRenderer.playAnimation == true)
		{
			var sliderElement = document.getElementById("age_slider");
			sliderElement.value = renderer_Age;
		}
	};
}

function onAirwaysDownloadProgress(xhr) {
	airwaysDownloadStatus[0] = xhr.total;
	airwaysDownloadStatus[1] = xhr.loaded;
}

function onAirwaysDownloadError( xhr ) {
	airwaysDownloadStatus[2] = true;
};

endLoading = function() {
	loadingPage.endLoading();
}

var updateAirwaysDownloadProgress = function() {
	var error = false;
	if (airwaysScene) {
		var element = document.getElementById("progressMessage");
		if (airwaysIsReady) {
			element.innerHTML =  "Loading Airways... Completed."
		} else {
			if (airwaysDownloadStatus[2] == false) {
				var totalString = "unknown";
				if (airwaysDownloadStatus[0] > 0)
					totalString = parseInt(parseInt(airwaysDownloadStatus[0]/1024)).toString() + " KB";
				if (element)
					element.innerHTML =  "Loading Airways... (" + parseInt(airwaysDownloadStatus[1]/1024).toString() + " KB/" + totalString + ").";
			} else {
				error = true;
				if (element)
					element.innerHTML =  "Loading Airways... Failed to load models. Please try again later.";
			}
		}
	}
	if (airwaysIsReady) {
		setTimeout(endLoading, 1000);
	}
	else if (error == false) {
		setTimeout(updateAirwaysDownloadProgress, 500);
	}
}

function initialiseAirways() {
	if (airwaysScene == undefined)
	{
		loadingPage.beginLoading();
		var element = document.getElementById("progressMessage");
		if (element)
			element.innerHTML =  "Loading Airways...";	
		airwaysScene = zincRenderer.createScene("Airways");
		airwaysScene.loadViewURL('airways/smoker_flow_view.json');
		loadExternalFiles(['shaders/dynamic_flow.vs', 'shaders/dynamic_flow.fs'], function (shaderText) {
			loadURLsIntoBufferGeometry('airways/smoker_flow_1.json', 
			airwaysMeshReady(airwaysScene, shaderText),
			onAirwaysDownloadProgress,
			onAirwaysDownloadError);
		}, function (url) {
	  		alert('Failed to download "' + url + '"');
		});
		updateAirwaysDownloadProgress();
	}
}

var updageModelDownloadProgress = function(model_name, scene, model_ready) {
	var error = false;
	if (scene) {
		var element = document.getElementById("loadingOverlay");
		if (model_ready) {
			element.innerHTML =  "Loading " + model_name + "... Completed."
		} else {
			var progress = scene.getDownloadProgress();
			if (progress[2] == false) {
				var totalString = "unknown";
				if (progress.totalSize > 0)
					totalString = parseInt(progress[0]/1024).toString() + " KB";
				if (element)
					element.innerHTML =  "Loading " + model_name + "... (" + parseInt(progress[1]/1024).toString() + " KB/" + totalString + ").";
			} else {
				error = true;
				if (element)
					element.innerHTML =  "Loading " + model_name + "... Failed to load models. Please try again later.";
			}
		}
	}
	if (model_ready) {
		setTimeout(endLoading, 1000);
	}
	else if (error == false) {
		setTimeout(updateModelDownloadProgress, 500, model_name, scene, model_ready);
	}
}

}

var updateLungsDownloadProgress = function() {
	var error = false;
	if (lungsScene) {
		var element = document.getElementById("progressMessage");
		if (lungMeshIsReady) {
			element.innerHTML =  "Loading Lungs... Completed."
		} else {
			var progress = lungsScene.getDownloadProgress();
			if (progress[2] == false) {
				var totalString = "unknown";
				if (progress.totalSize > 0)
					totalString = parseInt(progress[0]/1024).toString() + " KB";
				if (element)
					element.innerHTML =  "Loading Lungs... (" + parseInt(progress[1]/1024).toString() + " KB/" + totalString + ").";
			} else {
				error = true;
				if (element)
					element.innerHTML =  "Loading Lungs... Failed to load models. Please try again later.";
			}
		}
	}
	if (lungMeshIsReady) {
		setTimeout(endLoading, 1000);
	}
	else if (error == false) {
		setTimeout(updateLungsDownloadProgress, 500);
	}
}

function initZinc() {
	var errorString = undefined;
	if ( ! Detector.webgl )
		errorString = Detector.getWebGLErrorMessage();
	if (errorString == undefined) {
		zincRenderer = new Zinc.Renderer(container, window);
		zincRenderer.initialiseVisualisation();
		zincRenderer.addPreRenderCallbackFunction(updateUniforms(zincRenderer, cellUniforms, flowUniforms));
		createScene("Lungs");
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

function init3Dmodels() {
	var errorString = undefined;
	if ( ! Detector.webgl )
		errorString = Detector.getWebGLErrorMessage();
	if (errorString == undefined) {
		zincRenderer = new Zinc.Renderer(container, window);
		zincRenderer.initialiseVisualisation();
		zincRenderer.addPreRenderCallbackFunction(updateUniforms(zincRenderer, cellUniforms, flowUniforms));
		lungsScene = zincRenderer.createScene("Lungs");
		loadExternalFiles(['shaders/clean_cell.vs', 'shaders/clean_cell.fs'], function (shaderText) {
			lungsScene.loadFromViewURL('surface/surface', lungsMeshReady(shaderText));
		}, function (url) {
		    alert('Failed to download "' + url + '"');
		});
		var element = document.getElementById("progressMessage");
		if (element)
				element.innerHTML = "Loading Lungs...";
		zincRenderer.setCurrentScene(lungsScene);
		updateLungsDownloadProgress();
		zincRenderer.setPlayRate(500);
		zincRenderer.playAnimation = false;
		zincRenderer.animate();
	} else {
		errorString = "WebGL is required to display the interactive 3D models.<br>" + errorString + "<br>However you can use the Estimated Lung Function and check out other information on this page.";
		var element = document.getElementById("progressMessage");
		if (element)
			element.innerHTML = errorString;
		var element = document.getElementById("continueMessage");
		if (element){
			element.style.display = "block";
			element.onclick = endLoading;
		}
		var element = document.getElementById("loadingMessage")
			element.innerHTML = "Oops...";
	}
}

//init3Dmodels();
initZinc();

var dojoConfig = {
	async: true,
	// This code registers the correct location of the "demo" package
	// so we can load Dojo from the CDN whilst still being able to
	// load local modules
	packages: [{
		name: "js",
		location: location.pathname.replace(/\/[^/]+$/, '')  + '/js'
	}]
};

function updateSlider(slideAmount) {
	this.zincRenderer.setMorphsTime(slideAmount * 30);
}

