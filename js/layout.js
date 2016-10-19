
var imageSize = { width: 1920, height: 1080 };

var body = document.getElementsByTagName('body')[0];

var zincWindow = $('#zinc_window');
var zincWindowTarget = { left: 583, top: 25, width: 1010, height: 1010 };

var loadingOverlay = $('#loadingOverlay');
var loadingOverlayTarget = { left: 862, top: 484, width: 400, height: 140 };

var clickButton = $('#clickButton');
var clickButtonTarget = { left: 100, top: 890, width: 500, height: 150 };

var spinIcon = $('#spinIcon');
var spinIconTarget = { left: 1400, top: 890, width: 500, height: 150 };

var navDiv = $('#navcontent');
var navDivTarget = { left: 34, top: 5, width: 553, height: 440 };

var startAgainDiv = $('#startAgain');
var startAgainDivTarget = { left: 1768, top: 944, width: 120, height: 120 };

var fundingLogosDiv = $('#fundingLogos');
var fundingLogosDivTarget = { left: 36, top: 1000, width: 590, height: 70 };

var surfaceButtonDiv = $('#surfaceButton');
var surfaceButtonDivTarget = { left: 1708, top: 378, width: 173.864, height: 173.864 };

var airwaysButtonDiv = $('#airwaysButton');
var airwaysButtonDivTarget = { left: 1656, top: 584, width: 173.864, height: 173.864 };

var actionButtonDiv = $('#actionButton');
var actionButtonDivTarget = { left: 1516, top: 772, width: 243.489, height: 243.489 };

var resetViewDiv = $('#reset_button');
var resetViewDivTarget = { left: 1850, top: 25, width: 42, height: 42 };

var ageInputDiv = $('#age_input');
var ageInputDivTarget = { left: 198, top: 200, width: 317, height: 212 };

var heightInputDiv = $('#height_input');
var heightInputDivTarget = { left: 100, top: 384, width: 317, height: 212 };

var genderInputDiv = $('#gender_input');
var genderInputDivTarget = { left: -42, top: 576, width: 317, height: 212 };

var fevInputDiv = $('#fev_input');
var fevInputDivTarget = { left: 1318, top: 802, width: 317, height: 212 };

var playPauseButtonDiv = $('#play_pause_button');
var playPauseButtonDivTarget = { left: 1318, top: 802, width: 317, height: 212 };

// $(document).ready(updateDiv);
$(window).resize(updateDiv);

function setElementLocation(targetElement, targetValues, scale, xOffset, yOffset) {
	targetElement.css('top', (targetValues.top) * scale + yOffset);
	targetElement.css('left', (targetValues.left) * scale + xOffset);
	targetElement.css('width', (targetValues.width) * scale);
	targetElement.css('height', (targetValues.height) * scale);
}

function setViewButtonSizes(targetElement, scale) {
	var h1_tags = targetElement[0].getElementsByTagName('h1');
	var i_tags = targetElement[0].getElementsByTagName('i');
	var i;
	for (i = 0; i < h1_tags.length; i++) {
		h1_tags[i].style.fontSize = '' + 40 * scale + 'px';
		i_tags[i].style.fontSize = '' + 25 * scale + 'px';
		h1_tags[i].style.marginTop = '' + 25 * scale + 'px';
	}
}

function setStartAgainButtonSizes(targetElement, scale) {
	var h1_tags = targetElement[0].getElementsByTagName('h1');
	var i;
	for (i = 0; i < h1_tags.length; i++) {
		h1_tags[i].style.fontSize = '' + 85 * scale + 'px';
		h1_tags[i].style.marginTop = '' + 18 * scale + 'px';
	}
}

function setActionButtonSizes(targetElement, scale) {
	var h1_tags = targetElement[0].getElementsByTagName('h1');
	var i_tags = targetElement[0].getElementsByTagName('i');
	var i;
	for (i = 0; i < h1_tags.length; i++) {
		h1_tags[i].style.fontSize = '' + 55 * scale + 'px';
		i_tags[i].style.fontSize = '' + 22 * scale + 'px';
		h1_tags[i].style.marginTop = '' + 38 * scale + 'px';
	}
}

function updateDiv() {
	// Where is this margin coming from?
	var windowWidth = $('#main_section').width();
	var windowHeight = $('#main_section').height();

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

	// setElementLocation(zincWindow, zincWindowTarget, scale, xOffset, yOffset);
	setElementLocation(loadingOverlay, loadingOverlayTarget, scale, xOffset, yOffset);
	setElementLocation(clickButton, clickButtonTarget, scale, xOffset, yOffset);
	setElementLocation(spinIcon, spinIconTarget, scale, xOffset, yOffset);
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
	setElementLocation(fevInputDiv, fevInputDivTarget, scale, xOffset, yOffset);
	setElementLocation(playPauseButtonDiv, playPauseButtonDivTarget, scale, xOffset, yOffset);

	setViewButtonSizes(surfaceButtonDiv, scale);
	setViewButtonSizes(airwaysButtonDiv, scale);
	setStartAgainButtonSizes(startAgainDiv, scale);
	setActionButtonSizes(actionButtonDiv, scale);
}

