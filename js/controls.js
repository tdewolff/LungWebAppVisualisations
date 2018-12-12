function addSubjectValue(name) {
	if (name === 'age') {
		subject[name] = Math.min(subject[name] + 1, 80);
	} else if (name === 'height') {
		subject[name] = Math.min(subject[name] + 1, 200);
	} else if (name === 'fev') {
		subject[name] = Math.min(subject[name] + 0.1, 5.0);
	} else {
		console.error('Unknown subject value ' + name);
	}
	updateSubject();
}

function subSubjectValue(name) {
	if (name === 'age') {
		subject[name] = Math.max(subject[name] - 1, 11);
	} else if (name === 'height') {
		subject[name] = Math.max(subject[name] - 1, 140);
	} else if (name === 'fev') {
		subject[name] = Math.max(subject[name] - 0.1, 1.0);
	} else {
		console.error('Unknown subject value ' + name);
	}
	updateSubject();
}

function setSubjectValue(name, value) {
	if (name === 'gender') {
		if (value === 'F' || value === 'M') {
			subject[name] = value;
		} else {
			console.error('Bad gender value ' + value);
		}
	} else {
		console.error('Unknown subject value ' + name);
	}
	updateSubject();
}

const eventChanged = new CustomEvent('changed', {});
function clickButton(button) {
	const controlButton = button.parentNode;
	const min = controlButton.dataset.min;
	const max = controlButton.dataset.max;
	const step = controlButton.dataset.step;
	let precision = 0;
	if (step && step.length > 1) {
		precision = 1;
	}
	let value = controlButton.dataset.value;
	if (button.dataset.value === '+') {
		value = Math.min(max, parseFloat(value)+parseFloat(step)).toFixed(precision);
	} else if (button.dataset.value === '-') {
		value = Math.max(min, parseFloat(value)-parseFloat(step)).toFixed(precision);
	} else {
		value = button.dataset.value;
	}
	controlButton.dataset.value = value;
	controlButton.querySelector('.value').innerHTML = value;
	controlButton.dispatchEvent(eventChanged);
}

document.body.addEventListener('load-page', function(e) {
	const controlButtons = document.querySelectorAll('.control-button');
	for (let i = 0; i < controlButtons.length; i++) {
		controlButtons[i].querySelector('.value').innerHTML = controlButtons[i].dataset.value;
		controlButtons[i].dispatchEvent(eventChanged);
	}

	const buttons = document.querySelectorAll('.control-button .button');
	for (let i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		let t;
		let repeat = function () {
			clickButton(button);
			t = setTimeout(repeat, delay);
			delay = 80;
		};
		button.onmousedown = function(e) {
			delay = 1000;
			repeat();
		};
		button.onmouseup = function(e) {
			clearTimeout(t);
		};
	}
});
