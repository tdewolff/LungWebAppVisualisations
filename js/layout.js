
var image = { width: 1920, height: 1080 };

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

// $(document).ready(updateDiv);
$(window).resize(updateDiv);

function setElementLocation(targetElement, targetValues, scale, xOffset, yOffset) {
	targetElement.css('top', (targetValues.y) * scale + yOffset);
	targetElement.css('left', (targetValues.x) * scale + xOffset);
	targetElement.css('width', (targetValues.width) * scale);
	targetElement.css('height', (targetValues.height) * scale);
}

function setViewButtonSizes(targetElement, scale) {
	var h1 = targetElement[0].getElementsByTagName('h1');
	h1[0].style.fontSize = '' + 50 * scale + 'px';
	h1[0].style.marginTop = '' + 25 * scale + 'px';
}

function updateDiv() {
	// Where is this margin comming from?
	var windowWidth = $('#main_section').width() + 10;
	var windowHeight = $('#main_section').height() + 10;

	// Get largest dimension increase
	var xScale = (windowWidth) / image.width;
	var yScale = (windowHeight) / image.height;
	var scale;
	var yOffset = 0;
	var xOffset = 0;

	if (xScale > yScale) {
		scale = yScale;
	} else {
		scale = xScale;
	}
	yOffset = (windowHeight - image.height * scale) / 2;
	xOffset = (windowWidth - image.width * scale) / 2;

	setElementLocation(zincScene, zincTarget, scale, xOffset, yOffset);
	setElementLocation(navDiv, navDivTarget, scale, xOffset, yOffset);
	setElementLocation(startAgainDiv, startAgainDivTarget, scale, xOffset, yOffset);
	setElementLocation(fundingLogosDiv, fundingLogosDivTarget, scale, xOffset, yOffset);
	setElementLocation(surfaceButtonDiv, surfaceButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(airwaysButtonDiv, airwaysButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(actionButtonDiv, actionButtonDivTarget, scale, xOffset, yOffset);
	setElementLocation(resetViewDiv, resetViewDivTarget, scale, xOffset, yOffset);

	setViewButtonSizes(surfaceButtonDiv, scale);
	setViewButtonSizes(airwaysButtonDiv, scale);
}

