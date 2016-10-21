
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

// require([ "dojo/_base/declare", "dojo/dom-construct","dojox/charting/Chart", "dojox/charting/plot2d/StackedLines", "dojox/charting/plot2d/Grid", "dojox/charting/themes/Claro", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Indicator",
// "dojox/charting/themes/Tom", "dojo/ready"],
// 	function(declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme, ready){
// 		ready(function(){
// 			initCharts(tomTheme);
// 			/* get the html element (dom) where we want the chart to be drawn on */
// 			var chartDom = document.getElementById("test_plot");
// 			/* create the chart on the dom */
// 			ECGchart = new Chart(chartDom);
// 			ECGchart.setTheme(tomTheme);
// 			/* add the x-axis */
// 			ECGchart.addAxis("x", {majorLabels: false,
// 				minorTicks: false,
// 				minorLabels: false,
// 				microTicks: false});
// 			/* add the y-axis */
// 			ECGchart.addAxis("y", {vertical: true,
// 				majorLabels: false,
// 				minorTicks: false,
// 				minorLabels: false,
// 				microTicks: false});
// 			/* optional add the grid */
// 			ECGchart.addPlot("grid", { type: Grid,
// 				hMajorLines: false,
// 				hMinorLines: false,
// 				vMajorLines: false,
// 				vMinorLines: false,
// 				majorHLine: { color: "green", width: 0.2 },
// 				majorVLine: { color: "red", width: 0.2 } });
// 			ECGchart.addPlot("time", { type: plot2dIndicator,
// 				vertical: true,
// 				lineStroke: { color: "#00ccff"},
// 				labels: null,
// 				stroke: null,
// 				outline: null,
// 				fill: null,
// 				offset: { y: -7, x: -10 },
// 				values: 0.0});
// 		})
// 	}
// );

