function loadGraph(id, url) {
	if (!SVG.supported) {
		console.error('SVGs not supported');
		return;
	}

	const req = new XMLHttpRequest();
	req.open('GET', url, false);
	req.send();

	const data = JSON.parse(req.responseText);
	if (data.length == 0) {
	 	console.log('Warning: no plot data in ' + url);
		return;
	}

	const WIDTH = 300;
	const HEIGHT = 300;
	const PADDING = 20;
	const SMOOTHING = 0.2;
	const CIRCLE_RADIUS = 10;

	let xmin = Infinity;
	let ymin = Infinity;
	let xmax = -Infinity;
	let ymax = -Infinity;
	for (let i = 0; i < data.length; i++) {
		if (data[i].x < xmin) {
			xmin = data[i].x;
		}
		if (data[i].x > xmax) {
			xmax = data[i].x;
		}
		if (data[i].y < ymin) {
			ymin = data[i].y;
		}
		if (data[i].y > ymax) {
			ymax = data[i].y;
		}
	}

	let xscale = WIDTH/(xmax-xmin);
	let yscale = -HEIGHT/(ymax-ymin);
	for (let i = 0; i < data.length; i++) {
		data[i].x = (data[i].x-xmin)*xscale;
		data[i].y = (data[i].y-ymin)*yscale+HEIGHT;
	}

	
	const svg = SVG(id).size(WIDTH+2*PADDING, HEIGHT+2*PADDING);
	svg.viewbox({x:-PADDING, y:-PADDING, width:WIDTH+2*PADDING, height:HEIGHT+2*PADDING});

	// plot background
	svg.rect(WIDTH, HEIGHT).addClass('background');	

	// plot axes and labels
	axes = svg.polyline([WIDTH, HEIGHT, 0, HEIGHT, 0, 0]).addClass('axes');
	xlabel = svg.text("Time").move(WIDTH/2, HEIGHT-PADDING).addClass('xlabel');
	ylabel = svg.text("Lung volume").move(-HEIGHT/2, -PADDING).rotate(-90).addClass('ylabel');

	// smooth and plot data
	let d = 'M' + data[0].x + ' ' + data[0].y;
	for (let i = 1; i < data.length; i++) {
		let A = data[i-1];
		if (i > 1) {
			A = data[i-2];
		}
		let B = data[i-1];
		let C = data[i];
		let D = data[i];
		if (i+1 < data.length) {
			D = data[i+1];
		}

		let BC = {x: C.x-B.x, y: C.y-B.y};
		let AB = {x: B.x-A.x, y: B.y-A.y};
		let CD = {x: D.x-C.x, y: D.y-C.y};
		let lenBC = Math.sqrt(BC.x*BC.x + BC.y*BC.y);
		let lenAB = Math.sqrt(AB.x*AB.x + AB.y*AB.y);
		let lenCD = Math.sqrt(CD.x*CD.x + CD.y*CD.y);

		let c1 = B;
		if (lenAB > 0) {
			let normAB = SMOOTHING*lenBC/lenAB;
			c1 = {x: B.x+AB.x*normAB, y: B.y+AB.y*normAB};
		}
		let c2 = C;
		if (lenCD > 0) {
			let normCD = SMOOTHING*lenBC/lenCD;
			c2 = {x: C.x-CD.x*normCD, y: C.y-CD.y*normCD};
		}
		d += 'C' + c1.x + ' ' + c1.y + ' ' + c2.x + ' ' + c2.y + ' ' + C.x + ' ' + C.y;
	}
	svg.path(d).addClass('data');

	// marker
	let marker = svg.circle(CIRCLE_RADIUS).addClass('marker');
	return function (t) {
		let x = xmin + (xmax-xmin)*t;
		x *= xscale;
		let i = 0;
		while (i < data.length && data[i].x < x) {
			i++;	
		}

		let pos = data[0];
		if (i > 0) {
			let dx = data[i].x-data[i-1].x;
			let fa = (data[i].x-x)/dx;
			let fb = (x-data[i-1].x)/dx;
			pos = {x: x, y: data[i-1].y*fa + data[i].y*fb};
		}
		pos.x -= CIRCLE_RADIUS/2;
		pos.y -= CIRCLE_RADIUS/2;
		marker.move(pos.x, pos.y);
	}
}

markerUpdaters = [];
markerUpdaters.push(loadGraph('breathing-plot', 'graphdata/breathing.json'));

function updateMarkers(t) {
	for (let i = 0; i < markerUpdaters.length; i++) {
		markerUpdaters[i](t);
	}
}

