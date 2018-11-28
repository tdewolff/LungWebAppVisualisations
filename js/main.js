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

	let page = segments[1];
	if (page == '') {
		page = 'landing';
	}
	document.body.dataset.page = page;

	let severity = 'mild';
	if (segments.length > 2 && (segments[2] === 'moderate' || segments[2] === 'severe')) {
		severity = segments[2];
	}
	document.body.dataset.severity = severity;

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
		subject.asthmaSeverity = severity;
		subject.packsPerDay = 0.0;
		updateSubject();
	case 'smoking':
	case 'smoking-interactive':
		renderer.loadScene('airways');
		subject.asthmaSeverity = 'none';
		if (severity === 'mild') {
			subject.packsPerDay = 0.0;
		} else if (severity === 'moderate') {
			subject.packsPerDay = 1.0;
		} else if (severity === 'severe') {
			subject.packsPerDay = 2.0;
		}
		updateSubject();
		break;
	}
}
updateRoute();

