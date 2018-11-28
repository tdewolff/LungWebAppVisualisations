var fev1_plot = undefined;
var breathing_plot = undefined;
var breathing_blood_air_plot = undefined;
var asthma_flow_plot = undefined;
var asthma_volume_plot = undefined;

var plot_data = new dataSet();
function dataSet() {
	this.test = undefined;
	this.breathing = undefined;
	this.breathing_blood = undefined;
	this.breathing_air = undefined;
	this.asthma_volume_normal = undefined;
	this.asthma_volume_mild = undefined;
	this.asthma_volume_moderate = undefined;
	this.asthma_volume_severe = undefined;
	this.asthma_volume_one_second = undefined;
	this.asthma_flow_normal = undefined;
	this.asthma_flow_mild = undefined;
	this.asthma_flow_moderate = undefined;
	this.asthma_flow_severe = undefined;
}

function computedFEV1(gender, age, height) {
	var current_fev1 = 0;
	if (gender == "male") {
		if (age < 19) {
			current_fev1 = -0.7453 - 0.04106*age + 0.004477*age*age+0.00014098*height*height;
		} else {
			current_fev1 = 0.5536 -0.01303*age-0.000172*age*age+0.00014098*height*height;
		}
	} else {
		if (age < 17) {
			current_fev1 = -0.871+0.06537*age+0.00011496*height*height;
		} else {
			current_fev1 = 0.4333-0.00361*age-0.000194*age*age+0.00011496*height*height;
		}
	} 
	
	return current_fev1;
}

function calculateFEVData(age, gender, years, packs, height, fev1_measured, scaling) {
	var fev1_normal_non_smoker = [];
	var fev1_you = [];
	var fev1_you_smoking = [];
	
	
	var current_age = 7;
	// var smoking_decline_male = 7.4, smoking_decline_female = 4.4;
	var smoking_decline_male = 12.4, smoking_decline_female = 7.4;

	var smoking_start = age - years;

	var smoking_decline = smoking_decline_male;
	if  (gender == "female") {
		smoking_decline = smoking_decline_female;
	}

	var previous_fev1_you = 0;
	var last_smoking_reading = 0;

	var fev1_measured_scaling = fev1_measured / computedFEV1(gender, age, height);
	var fev1_measured_offset = fev1_measured - computedFEV1(gender, age, height);
	
	var fev1_at_25 = computedFEV1(gender, 25.0, height);
	var fev1_at_25_you = fev1_at_25;  //+ fev1_measured_offset;
	while (current_age < 100) {
		var current_fev1 = computedFEV1(gender, current_age, height);
		var current_fev1_you = current_fev1 * fev1_measured_scaling;
		fev1_normal_non_smoker.push({x: current_age, y: current_fev1 / fev1_at_25 * 100.0})
		fev1_you.push({x: current_age, y: current_fev1_you / fev1_at_25_you * 100.0});

		var current_fev1_smoke = current_fev1_you;
		if (current_age > 7) {
			current_fev1_smoke = 0;
			var years_of_smoking = (current_age > smoking_start) ? (current_age - smoking_start) : 0;
			if (years_of_smoking > 0 && packs > 0.0) {
				var decline = (current_fev1_you - previous_fev1_you) * 1000;
				var decline_for_smoke = decline - (smoking_decline * packs * years_of_smoking);
				current_fev1_smoke = previous_fev1_you + decline_for_smoke / 1000;
			}
			else {
				current_fev1_smoke = current_fev1_you;
			}
			current_fev1_smoke = current_fev1_smoke * scaling;
			fev1_you_smoking.push({x: current_age, y: current_fev1_smoke / fev1_at_25_you * 100.0})
		}
		
		previous_fev1_you = current_fev1_you;
		current_age = current_age + 2;
	}
	
	return [fev1_normal_non_smoker, fev1_you, fev1_you_smoking];
};


function initPlots() {
	
	var fev1_plot_element = document.getElementById("fev1_plot");
	fev1_plot.createPlot(fev1_plot_element);
	var breathing_plot_element = document.getElementById("breathing_plot");
	breathing_plot.createPlot(breathing_plot_element);
	var breathing_blood_air_plot_element = document.getElementById("breathing_blood_air_plot");
	breathing_blood_air_plot.createPlot(breathing_blood_air_plot_element);
	var asthma_flow_plot_element = document.getElementById("asthma_flow_plot");
	asthma_flow_plot.createPlot(asthma_flow_plot_element);
	var asthma_volume_plot_element = document.getElementById("asthma_volume_plot");
	asthma_volume_plot.createPlot(asthma_volume_plot_element);

	loadPlotData('breathing', 'data/breathing.json');
	loadPlotData('breathing_blood', 'data/breathing_blood.json');
	loadPlotData('breathing_air', 'data/breathing_air.json');
	loadPlotData('asthma_volume_normal', 'data/asthma_volume_normal.json');
	loadPlotData('asthma_volume_mild', 'data/asthma_volume_mild.json');
	loadPlotData('asthma_volume_moderate', 'data/asthma_volume_moderate.json');
	loadPlotData('asthma_volume_severe', 'data/asthma_volume_severe.json');
	loadPlotData('asthma_volume_one_second', 'data/asthma_volume_one_second.json');
	loadPlotData('asthma_flow_normal', 'data/asthma_flow_normal.json');
	loadPlotData('asthma_flow_mild', 'data/asthma_flow_mild.json');
	loadPlotData('asthma_flow_moderate', 'data/asthma_flow_moderate.json');
	loadPlotData('asthma_flow_severe', 'data/asthma_flow_severe.json');

	updateFEV1Plot();
};

var onDataLoaded = function(xmlhttp, dataName) {
	return function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var viewData = JSON.parse(xmlhttp.responseText);
			plot_data[dataName] = viewData;
			showData(dataName);
		}
	};
}

function loadPlotData(data_name, data_location) {
	var xmlhttp = new XMLHttpRequest();	
	xmlhttp.onreadystatechange = onDataLoaded(xmlhttp, data_name);
	xmlhttp.open("GET", data_location, true);
	xmlhttp.send();
}
	
function updateFEV1Plot() {
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity];
	var age = Math.floor(+subjectDetails.age + 0.5);
	var fevData = calculateFEVData(age, subjectDetails.gender.toLowerCase(),
		age - subjectDetails.ageStartedSmoking, subjectDetails.packsPerDay, subjectDetails.height, subjectDetails.FEV1, asthmaScaling);
		fev1_plot.removeSeries("normal");
	fev1_plot.removeSeries("you");
	fev1_plot.removeSeries("you smoking");
	fev1_plot.addSeries("normal", fevData[0], "blue");
	fev1_plot.addSeries("you", fevData[1], "green");
	fev1_plot.addSeries("you smoking", fevData[2], "red");
	fev1_plot.renderPlot();
}

function plotBreathingData(data) {
	breathing_plot.removeSeries('a');
	breathing_plot.addSeries('a', data, "purple");
	breathing_plot.renderPlot();
}

function plotBreathingBloodData(data) {
	breathing_blood_air_plot.removeSeries('blood');
	breathing_blood_air_plot.addSeries('blood', data, "red");
	breathing_blood_air_plot.renderPlot();
}

function plotBreathingAirData(data) {
	breathing_blood_air_plot.removeSeries('air');
	breathing_blood_air_plot.addSeries('air', data, "cyan");
	breathing_blood_air_plot.renderPlot();
}

function getColourForSeverity(severity) {
	colour = 'white';
	if (severity == 'normal') {
		colour = 'blue';
	} else if (severity == 'mild') {
		colour = 'green';
	} else if (severity == 'moderate') {
		colour = 'yellow';
	} else if (severity == 'severe') {
		colour = 'pink'
	}
	
	return colour;
}

function plotAsthmaVolumeData(data, severity) {
	asthma_volume_plot.removeSeries(severity);
	asthma_volume_plot.addSeries(severity, data, getColourForSeverity(severity));
	asthma_volume_plot.renderPlot();
}

function plotAsthmaFlowData(data, severity) {
	asthma_flow_plot.removeSeries(severity);
	asthma_flow_plot.addSeries(severity, data, getColourForSeverity(severity));
	asthma_flow_plot.renderPlot();
}

function showData(dataName) {
	var currentData = plot_data[dataName];
	if (dataName == 'breathing') {
		plotBreathingData(currentData);
	} else if (dataName == 'breathing_blood') {
		plotBreathingBloodData(currentData);
	} else if (dataName == 'breathing_air') {
		plotBreathingAirData(currentData);
	} else if (dataName == 'asthma_volume_normal') {
		plotAsthmaVolumeData(currentData, 'normal');
	} else if (dataName == 'asthma_volume_mild') {
		plotAsthmaVolumeData(currentData, 'mild');
	} else if (dataName == 'asthma_volume_moderate') {
		plotAsthmaVolumeData(currentData, 'moderate');
	} else if (dataName == 'asthma_volume_severe') {
		plotAsthmaVolumeData(currentData, 'severe');
	} else if (dataName == 'asthma_volume_one_second') {
		plotAsthmaVolumeData(currentData, 'one_second');
	} else if (dataName == 'asthma_flow_normal') {
		plotAsthmaFlowData(currentData, 'normal');
	} else if (dataName == 'asthma_flow_mild') {
		plotAsthmaFlowData(currentData, 'mild');
	} else if (dataName == 'asthma_flow_moderate') {
		plotAsthmaFlowData(currentData, 'moderate');
	} else if (dataName == 'asthma_flow_severe') {
		plotAsthmaFlowData(currentData, 'severe');
	}
}

