const THREE = Zinc.THREE;

const cellUniforms = THREE.UniformsUtils.merge([{
	'ambient'  : { type: 'c', value: new THREE.Color( 0xffffff ) },
	'emissive' : { type: 'c', value: new THREE.Color( 0x000000 ) },
	'specular' : { type: 'c', value: new THREE.Color( 0x111111 ) },
	'shininess': { type: 'f', value: 100 },
	'diffuse': { type: 'c', value: new THREE.Color( 0xeecaa2 ) },
	'ambientLightColor': { type: 'c', value: new THREE.Color( 0x444444 ) },
	'directionalLightColor': { type: 'c', value: new THREE.Color( 0x888888 ) },
	'directionalLightDirection': { type: 'v3', value: new THREE.Vector3()  },
	'time': { type: 'f', value: 0.0 },
	'starting_time': { type: 'f', value: 0.0 },
	'severity': { type: 'f', value: 0.0 },
	'cellsDensity': { type: 'f', value: 0.1 },
	'tarDensity':  { type: 'f', value: 0.0175},
	'breathing_cycle': { type: 'f', value: 0.0 },
	'surfaceAlpha': { type: 'f', value: 0.5 }
}]);

const flowUniforms = THREE.UniformsUtils.merge([{
    'ambient'  : { type: 'c', value: new THREE.Color( 0xffffff ) },
    'emissive' : { type: 'c', value: new THREE.Color( 0x000000 ) },
    'specular' : { type: 'c', value: new THREE.Color( 0x111111 ) },
    'shininess': { type: 'f', value: 100 },
    'ambientLightColor': { type: 'c', value: new THREE.Color( 0x444444 ) },
    'directionalLightColor': { type: 'c', value: new THREE.Color( 0x888888 ) },
    'directionalLightDirection': { type: 'v3', value: new THREE.Vector3()  },
    'time': { type: 'f', value: 0.0 },
    'starting_time': { type: 'f', value: 0.0 },
    'severity': { type: 'f', value: 1.0 },
    'height': { type: 'f', value: 160.0 },
    'weight': { type: 'f', value: 70.0 },
    'breathing_cycle': { type: 'f', value: 0.0 },
    'asthmaSeverity': { type: 'f', value: 1.0 }
}]);

let sceneStartDate = new Date();
function updateFrame(zincRenderer) {
	return function () {
		let light = zincRenderer.getCurrentScene().directionalLight;
        cellUniforms['directionalLightDirection'].value.set(light.position.x, light.position.y, light.position.z);
        flowUniforms['directionalLightDirection'].value.set(light.position.x, light.position.y, light.position.z);

        let dt = (new Date() - sceneStartDate) / 1000.0;
		t = (dt % 4.0) / 4.0;
		updateMarkers((dt % 8.0) / 8.0);
		if (t > 0.5) {
			t = (1.0-t);
		}
        flowUniforms['breathing_cycle'].value = t*2.0;
        cellUniforms['breathing_cycle'].value = t*2.0;
	};
}

const renderer = (function() {
	if (!WEBGL.isWebGLAvailable()) {
		console.error(WEBGL.getWebGLErrorMessage());
        showError('WebGL is required to display the interactive 3D models.');
		return
	}

	const renderer = document.getElementById('renderer');
	const zincRenderer = new Zinc.Renderer(renderer, window);
	zincRenderer.initialiseVisualisation();
	zincRenderer.getThreeJSRenderer().setClearColor(0x000000, 1);
	zincRenderer.addPreRenderCallbackFunction(updateFrame(zincRenderer));
	zincRenderer.animate();

	const scenes = {};
	const setScene = function (name, scene) {
		scenes[name] = scene;
		scene.viewAll()
		zincRenderer.setCurrentScene(scene);
	};

	const loader = document.getElementById('loader');
	const loaderMessage = loader.getElementsByTagName('p')[0];
	const startLoading = function() {
		loader.classList.add('loading');
	};
	const stopLoading = function() {
		loader.classList.remove('loading');
	};
	const setLoadingText = function(text) {
		loaderMessage.innerHTML = text;
	};

	return {
		'loadScene': function(name) {
			if (name in scenes) {
				setScene(name, scenes[name]);
				return;
			}

			const scene = zincRenderer.createScene(name);
			if (name === 'surface') {
				startLoading();
				Zinc.loadExternalFiles(['models/shaders/clean_cell.vs', 'models/shaders/clean_cell.fs'], function (shaderText) {
					const material = new THREE.ShaderMaterial({
						vertexShader: shaderText[0],
						fragmentShader: shaderText[1],
						uniforms: cellUniforms
					});
					material.onBeforeCompile = function(){}; // fix bug in ThreeJS
					material.side = THREE.DoubleSide;
					material.transparent = false;

					scene.loadFromViewURL('models/surface/surface', function (geometry) {
						geometry.setMaterial(material);
						setScene(name, scene);
						stopLoading();
					});
				}, function (url) {
					console.error('Could not load ' + url);
					showError('Could not load model files.');
					stopLoading();
				});
			} else if (name === 'airways') {
				startLoading();
				Zinc.loadExternalFiles(['models/shaders/dynamic_flow.vs', 'models/shaders/dynamic_flow.fs'], function (shaderText) {
					scene.loadViewURL('models/airways/smoker_and_asthmatic_flow_view.json');
					loadURLsIntoBufferGeometry(
						'models/airways/smoker_and_asthmatic_flow_1.json',
						function (geometry) {
							const material = new THREE.ShaderMaterial({
								vertexShader: shaderText[0],
								fragmentShader: shaderText[1],
								uniforms: flowUniforms
							});
							material.onBeforeCompile = function(){}; // fix bug in ThreeJS
							material.side = THREE.DoubleSide;

							scene.addZincGeometry(geometry, 10001, undefined, undefined, false, false, true, undefined, material);
							setScene(name, scene);
							stopLoading();
						},
						function (xhr) {
							let total = xhr.total;
							if (total === 0) {
								total = xhr.target.getResponseHeader('X-Uncompressed-Content-Length');
							}
							setLoadingText((xhr.loaded / total * 100).toFixed(0) + '%');
						},
						function (err) {
							console.error('Could not load model: ', err);
							showError('Could not load model files.');
							stopLoading();
						}
					);
				}, function (url) {
					console.error('Could not load ' + url);
					showError('Could not load model files.');
					stopLoading();
				});
			} else {
				console.error('Undefined scene name ' + name);
				showError('Could not load scene.')
			}
		},
	};
})();

function convertGeometryIntoBufferGeometry(geometry) {
	var arrayLength = geometry.faces.length * 3 * 3;
	var positions = new Float32Array( arrayLength );
	var normals = new Float32Array( arrayLength );
	var colors_first = new Float32Array( arrayLength );
	var colors_second = new Float32Array( arrayLength );
	var colors_third = new Float32Array( arrayLength );
	var colors1Map = geometry.morphColors[ 0 ];
	var colors2Map = geometry.morphColors[ 1 ];
	var colors3Map = geometry.morphColors[ 2 ];
	var bufferGeometry = new THREE.BufferGeometry();

	geometry.faces.forEach( function ( face, index ) {

		positions[ index * 9 + 0 ] = geometry.vertices[ face.a ].x;
		positions[ index * 9 + 1 ] = geometry.vertices[ face.a ].y;
		positions[ index * 9 + 2 ] = geometry.vertices[ face.a ].z;
		positions[ index * 9 + 3 ] = geometry.vertices[ face.b ].x;
		positions[ index * 9 + 4 ] = geometry.vertices[ face.b ].y;
		positions[ index * 9 + 5 ] = geometry.vertices[ face.b ].z;
		positions[ index * 9 + 6 ] = geometry.vertices[ face.c ].x;
		positions[ index * 9 + 7 ] = geometry.vertices[ face.c ].y;
		positions[ index * 9 + 8 ] = geometry.vertices[ face.c ].z;

		normals[ index * 9 + 0 ] = face.vertexNormals[0].x;
		normals[ index * 9 + 1 ] = face.vertexNormals[0].y;
		normals[ index * 9 + 2 ] = face.vertexNormals[0].z;
		normals[ index * 9 + 3 ] = face.vertexNormals[1].x;
		normals[ index * 9 + 4 ] = face.vertexNormals[1].y;
		normals[ index * 9 + 5 ] = face.vertexNormals[1].z;
		normals[ index * 9 + 6 ] = face.vertexNormals[2].x;
		normals[ index * 9 + 7 ] = face.vertexNormals[2].y;
		normals[ index * 9 + 8 ] = face.vertexNormals[2].z;


		var index_in_colors = Math.floor((face.a)/3);
		var remainder = (face.a)%3;
		var hex_value_one = 0;
		var hex_value_two = 0;
		var hex_value_three = 0;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}
		var mycolor_one = new THREE.Color(hex_value_one);
		var mycolor_two = new THREE.Color(hex_value_two);
		var mycolor_three = new THREE.Color(hex_value_three);

		colors_first[ index * 9 + 0 ] = mycolor_one.r;
		colors_first[ index * 9 + 1 ] = mycolor_one.g;
		colors_first[ index * 9 + 2 ] = mycolor_one.b;
		colors_second[ index * 9 + 0 ] = mycolor_two.r;
		colors_second[ index * 9 + 1 ] = mycolor_two.g;
		colors_second[ index * 9 + 2 ] = mycolor_two.b;
		colors_third[ index * 9 + 0 ] = mycolor_three.r;
		colors_third[ index * 9 + 1 ] = mycolor_three.g;
		colors_third[ index * 9 + 2 ] = mycolor_three.b;


		index_in_colors = Math.floor((face.b)/3);
		remainder = (face.b)%3;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r;
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}

		mycolor_one = new THREE.Color(hex_value_one);
		mycolor_two = new THREE.Color(hex_value_two);
		mycolor_three = new THREE.Color(hex_value_three);
		colors_first[ index * 9 + 3 ] = mycolor_one.r;
		colors_first[ index * 9 + 4 ] = mycolor_one.g;
		colors_first[ index * 9 + 5 ] = mycolor_one.b;
		colors_second[ index * 9 + 3 ] = mycolor_two.r;
		colors_second[ index * 9 + 4 ] = mycolor_two.g;
		colors_second[ index * 9 + 5 ] = mycolor_two.b;
		colors_third[ index * 9 + 3 ] = mycolor_three.r;
		colors_third[ index * 9 + 4 ] = mycolor_three.g;
		colors_third[ index * 9 + 5 ] = mycolor_three.b;

		index_in_colors = Math.floor((face.c)/3);
		remainder = (face.c)%3;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r;
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}
		mycolor_one = new THREE.Color(hex_value_one);
		mycolor_two = new THREE.Color(hex_value_two);
		mycolor_three = new THREE.Color(hex_value_three);
		colors_first[ index * 9 + 6 ] = mycolor_one.r;
		colors_first[ index * 9 + 7 ] = mycolor_one.g;
		colors_first[ index * 9 + 8 ] = mycolor_one.b;
		colors_second[ index * 9 + 6 ] = mycolor_two.r;
		colors_second[ index * 9 + 7 ] = mycolor_two.g;
		colors_second[ index * 9 + 8 ] = mycolor_two.b;
		colors_third[ index * 9 + 6 ] = mycolor_three.r;
		colors_third[ index * 9 + 7 ] = mycolor_three.g;
		colors_third[ index * 9 + 8 ] = mycolor_three.b;

	} );
	bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3));
	bufferGeometry.addAttribute( 'normal', new THREE.BufferAttribute(normals, 3));
	bufferGeometry.addAttribute( 'color_one', new THREE.BufferAttribute(colors_first, 3));
	bufferGeometry.addAttribute( 'color_two', new THREE.BufferAttribute(colors_second, 3));
	bufferGeometry.addAttribute( 'color_three', new THREE.BufferAttribute(colors_third, 3));

	return bufferGeometry;
}

function myLoader(finishCallback) {
	return function(geometry, materials){
		var material = undefined;
		if (materials && materials[0]) {
			material = materials[0];
		}
		bufferGeometry = convertGeometryIntoBufferGeometry(geometry,finishCallback);
		if (finishCallback != undefined && (typeof finishCallback == 'function')) {
			finishCallback(bufferGeometry);
		}
	}
}

function loadURLsIntoBufferGeometry(url, finishCallback, progressCallback, errorCallback) {
	var loader = new THREE.FileLoader();
	loader.load(url, function (text) {
		var json = JSON.parse(text);
		var object = (new THREE.JSONLoader()).parse(json, 'path');
		object.geometry.morphColors = json.morphColors;
		myLoader(finishCallback)(object.geometry, object.materials);
	}, progressCallback, errorCallback);
}
