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
	document.body.dataset.page = segments[1];
	switch (segments[1]) {
	case '':
		setInputsToSubjectDetailsValues();
		modelButtonClicked("Surface");
		break;
	case 'breathing':
		modelButtonClicked('Surface');
		rendered_age = 0;
		subjectDetails.asthmaSeverity = 'none';
		subjectDetails.packsPerDay = 0.0;
		updateUniformsWithDetails();
		break;
	case 'breathing-gas-exchange':
		modelButtonClicked('Airways');
		rendered_age = 0;
		subjectDetails.asthmaSeverity = 'none';
		subjectDetails.packsPerDay = 0.0;
		updateUniformsWithDetails();
		break;
	case 'asthma':
	case 'asthma-lung-function':
		const condition = (segments.length > 2 ? segments[2] : 'mild');
		modelButtonClicked('Airways');
		setCurrentAge(100);
		subjectDetails.packsPerDay = 0.0;
		var asthma_button_div = document.getElementById('asthma_condition');
		asthmaConditionClicked(asthma_button_div.children[0]);
	case 'smoking':
	case 'smoking-interactive':
		modelButtonClicked('Airways');
		rendered_age = 25;
		subjectDetails.asthmaSeverity = 'none';
		var smoking_packs_div = document.getElementById('smoking_packs');
		smokingPacksClicked(smoking_packs_div.children[0]);
		break;
	}
}

resetSubjectDetails();
initZinc();
updateRoute();
