
function holdit(btn, action, start, speedup) {
    var t;

    var repeat = function () {
        action(btn);
        t = setTimeout(repeat, start);
        start = start / speedup;
    }

    btn.onmousedown = function() {
        repeat();
    }

    btn.onmouseout = btn.onmouseup = function () {
        clearTimeout(t);
    }
}

function setRepeatOnButtons() {
	/* to use */
	var height_input = document.getElementById('height_input')
	var buttons = height_input.getElementsByClassName('button');
	var i;
	for (i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (button.classList.contains('PlusButton')) {
			holdit(button, addClicked, 1000, 2);
		} else if (button.classList.contains('MinusButton')) {
			holdit(button, subClicked, 1000, 2);
		}
	}
	//holdit(btn, function () { }, 1000, 2); /* x..1000ms..x..500ms..x..250ms..x */
}

function playPauseClicked(sender) {
	if (sender.classList.contains('PlayButton')) {
		sender.classList.remove('PlayButton');
		sender.classList.add('PauseButton');
		zincRenderer.playAnimation = true;
	} else {
		sender.classList.remove('PauseButton');
		sender.classList.add('PlayButton');
		zincRenderer.playAnimation = false;
	}
}

function resetPlayClicked(sender) {
	var base_button = sender.parentNode;
	var play_pause_button = base_button.getElementsByClassName('PlayButton')[0] || base_button.getElementsByClassName('PauseButton')[0];
	if (play_pause_button.classList.contains('PauseButton')) {
		play_pause_button.classList.remove('PauseButton');
		play_pause_button.classList.add('PlayButton');
		zincRenderer.playAnimation = false;
	}
	setRenderedAge(lung_age_display, subjectDetails.age);
}

function setRenderedAge(owner, value) {
	if (owner) {
		var number_display = owner.getElementsByClassName('ValueDisplay')[0];
		number_display.innerHTML = value;
	}
}

function addClicked(owner) {
	var adder_button = owner.parentNode;
	var number_display = adder_button.getElementsByClassName('ValueDisplay')[0];
	if (number_display == undefined) {
		number_display = adder_button.getElementsByClassName('ValueWideDisplay')[0];
	}
	number_display.innerHTML = +number_display.innerHTML + 1;
	setSubjectDetailsValue(adder_button.parentNode.id, number_display.innerHTML);
	updateUniformsWithDetails();
}

function subClicked(owner) {
	var adder_button = owner.parentNode;
	var number_display = adder_button.getElementsByClassName('ValueDisplay')[0];
	if (number_display == undefined) {
		number_display = adder_button.getElementsByClassName('ValueWideDisplay')[0];
	}
	if (number_display.innerHTML > 0) {
		number_display.innerHTML = +number_display.innerHTML - 1;
		setSubjectDetailsValue(adder_button.parentNode.id, number_display.innerHTML);
		updateUniformsWithDetails();
	}
}

function maleClicked(owner) {
	var adder_button = owner.parentNode;
	var gender_display = owner.parentNode.getElementsByClassName('ValueDisplay')[0];
	gender_display.innerHTML = 'M';
}

function femaleClicked(owner) {
	var adder_button = owner.parentNode;
	var gender_display = owner.parentNode.getElementsByClassName('ValueDisplay')[0];
	gender_display.innerHTML = 'F';
}

function activateCondition(sender) {
	var parent_node = sender.parentNode;
	var children_count = parent_node.children.length;
	var i;
	for (i = 0; i < children_count; i++) {
		if (!parent_node.children[i].classList.contains('InactiveIcon')) {
			parent_node.children[i].classList.add('InactiveIcon');
		}
	}
	if (sender.classList.contains('InactiveIcon')) {
		sender.classList.remove('InactiveIcon');
	}
}

function asthmaConditionClicked(sender) {
	activateCondition(sender);
}

function smokingPacksClicked(sender) {
	activateCondition(sender);
}

