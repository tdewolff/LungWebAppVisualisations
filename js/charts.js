
function initPlots() {
	
	var fev1_plot_element = document.getElementById("fev1_plot");
	fev1_plot.createPlot(fev1_plot_element);
	// createChart('test_plot', tom_theme);
	loadPlotData('test', 'data/test_data.json');
	// calculatePlotData('fev1')
	updateFEVPlot();
};

var onDataLoaded = function(xmlhttp, dataName) {
	return function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var viewData = JSON.parse(xmlhttp.responseText);
			plot_data[dataName] = viewData;
			// showData(dataName);
		}
	};
}

function loadPlotData(data_name, data_location) {
	var xmlhttp = new XMLHttpRequest();	
	xmlhttp.onreadystatechange = onDataLoaded(xmlhttp, data_name);
	xmlhttp.open("GET", data_location, true);
	xmlhttp.send();
}
	
function updateFEVPlot() {
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity];
	var age = Math.floor(subjectDetails.age + 0.5);
	var fevData = calculateFEVData(age, subjectDetails.gender.toLowerCase(),
		age - subjectDetails.ageStartedSmoking, subjectDetails.packsPerDay, subjectDetails.height, asthmaScaling);
		fev1_plot.removeSeries("non smoker");
	fev1_plot.removeSeries("smoker");
	fev1_plot.removeSeries("after cessation");
	fev1_plot.addSeries("smoker", fevData[4], "red");
	fev1_plot.addSeries("non smoker", fevData[3], "blue");
	fev1_plot.addSeries("after cessation", fevData[5], "green");
	fev1_plot.renderPlot();
}

// function showData(chartName) {
// 	console.log(chartName);
// 	console.log(plot_data);
// 	var currentData = plot_data[chartName];
// 	ECGchart.removeSeries('test');
// 	console.log(currentData);
// 	// currentECGName = chartName;
// 	ECGchart.addSeries('test', currentData, { stroke: {color: "orange", width: 2}});
// 	ECGchart.render();
// 	ECGchart.resize('100%','100%');
// }

