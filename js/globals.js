var zincRenderer = undefined;
var subjectDetails = undefined; /* new person(11, 152, "Male"); */
var dataController = undefined;

var container = document.getElementById( "zinc_window" );
var myLoadingPage = document.getElementById("loadingOverlay");
var lung_age_display = document.getElementById("play_pause_button");
var rendered_age = 0;
var plot_data = new dataSet();
var fev1_plot = undefined;

function person(age, height, gender) {
	this.age = age;
	this.height = height // cm
	this.gender = gender;
	this.asthmaSeverity = "none";
	this.ageStartedSmoking = 25;
	this.packsPerDay = 0.0;
	this.FEV = 3.1;
};

function dataSet() {
	this.test = undefined;
}

/* According to studies, asthma severity affects percentage FEV1 */
var asthmaLevel = {
	"none" : 1.0,
	"Mild" : 0.8,
	"Moderate" : 0.7,
	"Severe": 0.6	
};

var surfaceStatus = {
	"scene": undefined,
	"initialised": false,
	"download": {
		"progress": 0,
		"total": 0,
	},
};

var airwaysStatus = {
	"scene": undefined,
	"initialised": false,
	"download": {
		"progress": 0,
		"total": 0,
	},
};

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


