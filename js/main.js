/* Navigation */
function updateRoute() {
	const url = window.location.hash.substr(1);
	if (url.length == 0) {
		window.location.hash = '/';
	} else if (url[0] == '/') {
		loadRoute(url);
	}
}

window.addEventListener('hashchange', function(e) {
	updateRoute();
});

function loadRoute(url) {
	const segments = url.split('/');
	const page = segments[1];
	if (page == '') {
		page = 'landing';
	}

	document.body.dataset.page = page;
	switch (page) {
	case 'landing':
		renderer.loadScene('surface');
		break;
	case 'breathing':
		renderer.loadScene('surface');
		subject.asthmaSeverity = 'none';
		subject.packsPerDay = 0.0;
		updateSubject();
		break;
	case 'breathing-gas-exchange':
		renderer.loadScene('airways');
		subject.asthmaSeverity = 'none';
		subject.packsPerDay = 0.0;
		updateSubject();
		break;
	case 'asthma':
	case 'asthma-lung-function':
		renderer.loadScene('airways');
		subject.asthmaSeverity = (segments.length > 2 ? segments[2] : 'mild');
		subject.packsPerDay = 0.0;
		updateSubject();
		
		// setCurrentAge(100); // TODO: set playrate
	case 'smoking':
	case 'smoking-interactive':
		renderer.loadScene('airways');
		subject.asthmaSeverity = 'none';
		subject.packsPerDay = 0.0; // TODO: set through URL
		updateSubject();
		break;
	}
}
updateRoute();

/* Controls */

