
var imageSize = { width: 1920, height: 1080 };

var body = document.getElementsByTagName('body')[0];

var zincScene = $('#zinc_rendered_view');
var zincTarget = { x: 645, y: 200, width: 620, height: 620 };

var navDiv = $('#navcontent');
var navDivTarget = { x: 79, y: 54, width: 553, height: 440 };

var startAgainDiv = $('#startAgain');
var startAgainDivTarget = { x: 464, y: 552, width: 120, height: 120 };

var fundingLogosDiv = $('#fundingLogos');
var fundingLogosDivTarget = { x: 74.1, y: 797, width: 191.6, height: 191.6 };

var surfaceButtonDiv = $('#surfaceButton');
var surfaceButtonDivTarget = { x: 730.272, y: 850.992, width: 173.864, height: 173.864 };

var airwaysButtonDiv = $('#airwaysButton');
var airwaysButtonDivTarget = { x: 1030.272, y: 850.992, width: 173.864, height: 173.864 };

var actionButtonDiv = $('#actionButton');
var actionButtonDivTarget = { x: 1574.576, y: 774.276, width: 243.489, height: 243.489 };

var resetViewDiv = $('#reset_button');
var resetViewDivTarget = { x: 1155.5, y: 210.2, width: 42, height: 42 };

var ageInputDiv = $('#age_input');
var ageInputDivTarget = { x: 1318, y: 802, width: 317, height: 212 };

var heightInputDiv = $('#height_input');
var heightInputDivTarget = { x: 1500, y: 602, width: 317, height: 212 };

var genderInputDiv = $('#gender_input');
var genderInputDivTarget = { x: 1543, y: 438, width: 317, height: 212 };

// $(document).ready(updateDiv);
$(window).resize(updateDiv);

function setElementLocation(targetElement, targetValues, scale, xOffset, yOffset) {
	targetElement.css('top', (targetValues.y) * scale + yOffset);
	targetElement.css('left', (targetValues.x) * scale + xOffset);
	targetElement.css('width', (targetValues.width) * scale);
	targetElement.css('height', (targetValues.height) * scale);
}

function setViewButtonSizes(targetElement, scale) {
	var h1_tags = targetElement[0].getElementsByTagName('h1');
	var i_tags = targetElement[0].getElementsByTagName('i');
	var i;
	for (i = 0; i < h1_tags.length; i++) {
		h1_tags[i].style.fontSize = '' + 50 * scale + 'px';
		i_tags[i].style.fontSize = '' + 27 * scale + 'px';
		h1_tags[i].style.marginTop = '' + 25 * scale + 'px';
	}
}

function setActionButtonSizes(targetElement, scale) {
	var h1_tags = targetElement[0].getElementsByTagName('h1');
	var i_tags = targetElement[0].getElementsByTagName('i');
	var i;
	for (i = 0; i < h1_tags.length; i++) {
		h1_tags[i].style.fontSize = '' + 86 * scale + 'px';
		i_tags[i].style.fontSize = '' + 22 * scale + 'px';
		h1_tags[i].style.marginTop = '' + 38 * scale + 'px';
	}
}

function updateDiv() {
	// Where is this margin comming from?
	var windowWidth = $('#main_section').width() + 10;
	var windowHeight = $('#main_section').height() + 10;

	// Get largest dimension increase
	var xScale = (windowWidth) / imageSize.width;
	var yScale = (windowHeight) / imageSize.height;
	var scale;
	var yOffset = 0;
	var xOffset = 0;

	if (xScale > yScale) {
		scale = yScale;
	} else {
		scale = xScale;
	}
	yOffset = (windowHeight - imageSize.height * scale) / 2;
	xOffset = (windowWidth - imageSize.width * scale) / 2;

	body.style.fontSize = '' + 25 * scale + 'px';

	setElementLocation(zincScene, zincTarget, scale, xOffset, yOffset);
	setElementLocation(navDiv, navDivTarget, scale, xOffset, yOffset);
	setElementLocation(startAgainDiv, startAgainDivTarget, scale, xOffset, yOffset);
	setElementLocation(fundingLogosDiv, fundingLogosDivTarget, scale, xOffset, yOffset);
	setElementLocation(surfaceButtonDiv, surfaceButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(airwaysButtonDiv, airwaysButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(actionButtonDiv, actionButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(resetViewDiv, resetViewDivTarget, scale, xOffset, yOffset);
	setElementLocation(ageInputDiv, ageInputDivTarget, scale, xOffset, yOffset);
	setElementLocation(heightInputDiv, heightInputDivTarget, scale, xOffset, yOffset);
	setElementLocation(genderInputDiv, genderInputDivTarget, scale, xOffset, yOffset);

	setViewButtonSizes(surfaceButtonDiv, scale);
	setViewButtonSizes(airwaysButtonDiv, scale);
	setViewButtonSizes(startAgainDiv, scale);
	setActionButtonSizes(actionButtonDiv, scale);
}

