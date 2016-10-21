
function updateFEVChart() {
	console.log(asthmaLevel);
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity]
	var fev_chart = document.getElementById("fev_chart");
	dataController.createPlot(fev_chart, "Age", "FEV1");
	var age = Math.floor(subjectDetails.age + 0.5);
	var fevData = dataController.calculateFEVData(age, subjectDetails.gender.toLowerCase(),
		age - subjectDetails.ageStartedSmoking, subjectDetails.packsPerDay, subjectDetails.height, asthmaScaling);
	dataController.removeSeries(fev_chart, "non smoker");
	dataController.removeSeries(fev_chart, "smoker");
	dataController.removeSeries(fev_chart, "after cessation");
	dataController.addSeries(fev_chart, "You: at current rate of smoking", fevData[4], "red");
	dataController.addSeries(fev_chart, "Healthy, never smoked", fevData[3], "blue");
	dataController.addSeries(fev_chart, "You: non-smoking from now", fevData[5], "green");
	dataController.renderPlot(fev_chart);
	if (fev_legend == undefined) {
		fev_legend = document.getElementById("fev_legend");
		dataController.createLegend(fev_chart, fev_legend);
	}
	// var lungAge = dataController.findLungAge(age, fevData[0], fevData[1]);
	// var lungAgeAt25 = dataController.findLungAge(25, fevData[0], fevData[1]);
	// writeLungAge(age, lungAge, lungAgeAt25);
}

function showData(chartName) {
	console.log(chartName);
	console.log(plot_data);
	var currentData = plot_data[chartName];
	ECGchart.removeSeries('test');
	console.log(currentData);
	// currentECGName = chartName;
	ECGchart.addSeries('test', currentData, { stroke: {color: "orange", width: 2}});
	ECGchart.render();
	ECGchart.resize('100%','100%');
}

require([ "dojo/_base/declare", "dojo/dom-construct","dojox/charting/Chart", "dojox/charting/plot2d/StackedLines", "dojox/charting/plot2d/Grid", "dojox/charting/themes/Claro", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Indicator",
"dojox/charting/themes/Tom", "dojo/ready"], 
	function(declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme, ready){
		ready(function(){
			tomTheme.chart.fill="transparent";
			tomTheme.plotarea.fill = "transparent";
			tomTheme.chart.stroke = "transparent";
			/* get the html element (dom) where we want the chart to be drawn on */
			var chartDom = document.getElementById("test_plot");
			/* create the chart on the dom */
			ECGchart = new Chart(chartDom);
			ECGchart.setTheme(tomTheme);
			/* add the x-axis */
			ECGchart.addAxis("x", {type: "Invisible", majorLabels: false,
				minorTicks: false,
				minorLabels: false,
				microTicks: false});		
			/* add the y-axis */
			ECGchart.addAxis("y", {type: "Invisible", vertical: true,
				majorLabels: false,
				minorTicks: false,
				minorLabels: false,
				microTicks: false});
			/* optional add the grid */
			ECGchart.addPlot("grid", { type: Grid,
				hMajorLines: false,
				hMinorLines: false, 
				vMajorLines: false,
				vMinorLines: false,
				majorHLine: { color: "green", width: 0.2 },
				majorVLine: { color: "red", width: 0.2 } });
			ECGchart.addPlot("time", { type: plot2dIndicator,
				vertical: true,
				lineStroke: { color: "#00ccff"},
				labels: null,
				stroke: null,
				outline: null,
				fill: null,
				offset: { y: -7, x: -10 },
				values: 0.0});
			console.log("What have we here ----------------");
			// ecgIndicator = ECGchart.getPlot("time");
		})
	}
);

