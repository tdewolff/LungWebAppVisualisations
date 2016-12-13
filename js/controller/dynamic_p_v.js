define([
	"dojo/_base/declare",
	"dojox/charting/Chart",
	"dojox/charting/plot2d/StackedLines",
	"dojox/charting/plot2d/MarkersOnly",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/themes/Tom",
	"dojox/charting/axis2d/Default",
	"dojox/charting/widget/Legend"
	], function(declare, Chart, StackedLines, MarkersOnly, Grid, TomTheme, axis2dDefault, Legend){

	return declare("DynamicPVController", null,{

		_plot: undefined,
		_active: undefined,
		
		constructor: function(params){
			dojo.mixin(this, params);
			this._active = false;
			this._resistance = 1.0;
			this._pt1 = {'x': 0.0, 'y': 0.0};
			this._pt2 = {'x': 10.0, 'y': 1000.0};
			this._cpt1 = {'x': 4.0, 'y': 100.0};
			this._cpt2 = {'x': 9.0, 'y': 600.0};
			this._cpt3 = {'x': 6.0, 'y': 900.0};
			this._cpt4 = {'x': 1.0, 'y': 400.0};
			this._expiration_factor = 1.05;
		},

		setResistance: function(value) {
			this._resistance = value;
		},

		setActive: function(state) {
			this._active = state;
		},

		renderPlot: function(){
			if (this._plot != undefined) {
				this._plot.render();
			}
		},
		
		addSeries: function(seriesName, data, colorString) {
			if (this._plot != undefined) {
				this._plot.addSeries(seriesName, data, {stroke: {color: colorString}});
			}
		},
		
		removeSeries: function(seriesName) {
			if (this._plot != undefined) {
				this._plot.removeSeries(seriesName);
			}
		},

		_getInspirationCurveControlPoints: function() {
			// scale control points
			var cpt1 = this._scaleControlPoint(this._cpt1, 1.0);	
			var cpt2 = this._scaleControlPoint(this._cpt2, 1.0);	

			var inspiration_pts = [this._pt1, cpt1, cpt2, this._pt2];
			return inspiration_pts;
		},

		_getExpirationCurveControlPoints: function() {
			// scale control points
			var cpt3 = this._scaleControlPoint(this._cpt3, -this._expiration_factor);
			var cpt4 = this._scaleControlPoint(this._cpt4, -this._expiration_factor);

			var expiration_pts = [this._pt2, cpt3, cpt4, this._pt1];
			return expiration_pts;
		},

		calculateDynamicPVCurves: function() {
			var inspiration_pts = this._getInspirationCurveControlPoints();
			var expiration_pts = this._getExpirationCurveControlPoints();

			var temp_pt;

			var in_pts = [];
			var ex_pts = [];

			var n = 15;
			var step_size = 1.0 / (n - 1);
			for (var i = 0; i < n; i++) {
				tmp_pt = this._calculateBezierPoint(i * step_size, inspiration_pts);
				in_pts.push(tmp_pt);
				tmp_pt = this._calculateBezierPoint(i * step_size, expiration_pts);
				ex_pts.push(tmp_pt);
			}
			this.removeSeries('inspiration');
			this.addSeries('inspiration', in_pts, 'red');
			this.removeSeries('expiration');
			this.addSeries('expiration', ex_pts, 'blue');

			this._plot.render();
		},
		
		updateTrace: function(time) {
			// time is expected to be between (0, 1]
//this._active = false;
			if (this._active) {
				this._plot.removeSeries('point');
				var inspiration_pts = this._getInspirationCurveControlPoints();
				var expiration_pts = this._getExpirationCurveControlPoints();
				var pt = this._calculateBezierPoint(time < 0.5 ? 2 * time : 2 * time - 1.0, time < 0.5 ? inspiration_pts : expiration_pts);
				this._plot.addSeries('point', [pt], {plot: "plot_markers", marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0", markerStroke: 'white', markerFill: 'white'})
				this._plot.render();
			}
		},

		createPlot: function(dom, x_axis_name, y_axis_name){
			if (this._plot == undefined) {
				TomTheme.chart.fill="transparent";
				TomTheme.plotarea.fill = "transparent";
				TomTheme.chart.stroke = "transparent";
				var chart = new Chart(dom);
				chart.setTheme(TomTheme);
				chart.addPlot("plot_markers", { type: MarkersOnly });
				chart.addPlot("compliance");
				chart.addAxis("x", {title:'Pressure (cm H2O)', titleGap: 2, titleOrientation: 'away', titleFontColor: 'white', majorTicks: true, majorLabels: true, minorTicks: false, minorLabels: false, microTicks: false,  majorTick: {color: "red", length: 0},});
				chart.addAxis("y", {vertical: true, title:'Volume (L)', titleGap: 5, titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false,});
				this._plot = chart;
				this._plot.addSeries('compliance', [this._pt1, this._pt2], {plot: 'compliance', stroke: {color: 'green', style: 'Dash'}});
			}
		},

		_scaleControlPoint: function(pt, expiration_factor) {
			return {'x': pt.x + this._resistance * expiration_factor, 'y': pt.y};
		},

		_calculateBezierPoint: function(t, pts) {
			var tm1 = 1 - t;
			var tm1_2 = tm1 * tm1;
			var tm1_3 = tm1 * tm1_2;
			var t_2 = t * t;
			var t_3 = t_2 * t;

			var out_pt = {'x': 0.0, 'y': 0.0};

			out_pt.x = pts[0].x * tm1_3 + pts[1].x * 3 * tm1_2 * t + pts[2].x * 3 * tm1 * t_2 + pts[3].x * t_3;
			out_pt.y = pts[0].y * tm1_3 + pts[1].y * 3 * tm1_2 * t + pts[2].y * 3 * tm1 * t_2 + pts[3].y * t_3;
			return out_pt;
		},

		_determineFunctionPoint: function(time) {
			// 0.0006011 x - 0.03912 x + 0.8304 x - 6.068 x + 15.22 x + 18.11
			// Assume plot data is monotonically increasing in time.
			// Assume plot data is somewhat linearly spaced.
			var active_data = undefined;
			var first_point = undefined;
			var last_point = undefined;
			var data_length = undefined;
			//var pt = {'x': 0.0, 'y': 0.0};
			if (breath == 1) {
				active_data = plot_data.inspiration;
				data_length = active_data.length;
				first_point = active_data[0];
				last_point = active_data[data_length - 1];
			} else {
				active_data = plot_data.expiration;
				data_length = active_data.length;
				first_point = active_data[data_length - 1];
				last_point = active_data[0];
			}

			var x_range = last_point.x - first_point.x;
			var mapped_x = time * x_range + first_point.x;

			//var x_1 = mapped_x;
			//var x_2 = x_1 * x_1;
			//var x_3 = x_2 * x_1;
			//var x_4 = x_2 * x_2;
			//var x_5 = x_3 * x_2;

			//pt.x = mapped_x;
			//pt.y = 0.0006011 * x_5 - 0.03912 * x_4 + 0.8304 * x_3 - 6.068 * x_2 + 15.22 * x_1 + 18.11;

			//return pt;
			var index = Math.floor(time * data_length + 0.5);

			while (0 <= index && index < data_length - 1 && active_data[index + 1].x < mapped_x) {
				index++;
			}
			while (0 <= index && index < data_length - 1 && active_data[index].x > mapped_x) {
				index--;
			}

			var pt = undefined;
			if (index < 0) {
				pt = first_point;
			} else if (index >= data_length - 1) {
				pt = last_point;
			} else {
				var pt1 = active_data[index];
				var pt2 = active_data[index + 1];

				var slope = (pt2.y - pt1.y) / (pt2.x - pt1.x);
				pt = {y: slope * (mapped_x - pt1.x) + pt1.y, x: mapped_x};
			}
			// console.log(pt);
			return pt;
		},


	});
});

