function load(id, url) {
	const req = new XMLHttpRequest();
	req.open('GET', url, false);
	req.send();
	document.getElementById(id).innerHTML = req.responseText;
}

load('left_page_1', 'pages/left_page_1.html');
load('left_page_2', 'pages/left_page_2.html');
load('left_page_3', 'pages/left_page_3.html');
load('left_page_6', 'pages/left_page_6.html');
load('left_page_7', 'pages/left_page_7.html');
load('left_page_8', 'pages/left_page_8.html');
load('right_page_1', 'pages/right_page_1.html');
load('right_page_2', 'pages/right_page_2.html');
load('right_page_3', 'pages/right_page_3.html');
load('right_page_6', 'pages/right_page_6.html');
load('right_page_8', 'pages/right_page_8.html');
