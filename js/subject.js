const subject = {
    'age': 11,
    'height': 154, // cm
    'gender': 'M',
    'asthmaSeverity': 'none',
    'ageStartedSmoking': 25,
    'packsPerDay': 0.0,
    'fev': 2.7
};

const asthmaLevel = {
	"none": 1.0,
	"mild": 0.8,
	"moderate": 0.7,
	"severe": 0.6	
};

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

function clickButton(button) {
	if (button.dataset.value === '+') {
		addSubjectValue(button.dataset.name);
	} else if (button.dataset.value === '-') {
		subSubjectValue(button.dataset.name);
	} else {
		setSubjectValue(button.dataset.name, button.dataset.value);
	}
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

function updateSubject() {
	const asthmaSeverity = asthmaLevel[subject.asthmaSeverity];
	// cellUniforms["smokingSeverity"].value = subject.packsPerDay * 1.0;
	// flowUniforms["smokingSeverity"].value = subject.packsPerDay * 1.0;
	// flowUniforms["asthmaSeverity"].value = asthmaSeverity * 1.0;

	document.querySelector('#age-control .value').innerHTML = subject['age'];
	document.querySelector('#gender-control .value').innerHTML = subject['gender'];
	document.querySelector('#height-control .value').innerHTML = subject['height'];
	document.querySelector('#fev-control .value').innerHTML = subject['fev'].toFixed(1);
};
updateSubject();
