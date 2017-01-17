attribute vec3 color_one;
attribute vec3 color_two;
attribute vec3 color_three;
attribute vec3 color_four;
attribute vec3 color_five;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 color1;
varying vec3 color2;
varying vec3 color3;
varying vec3 color4;
varying vec3 color5;
uniform float starting_time;
uniform float height;
uniform float weight;
uniform float breathing_cycle;
varying float z_coordinates;

vec3 getPosition(vec3 positionIn)  {
	float max_y = -89.627;//81.9418;
	float min_y = 94.9418;//-89.627;
	float max_z = 145.6336;
	float min_z = -14.955;
	float range_y = max_y - min_y;
	float range_z = max_z - min_z;
	float scale = 1.0;
	vec3 newPosition = positionIn * vec3(1.0, scale, scale);

	float lung_volume_0 = 4.0e6 * 180.0 / 200.0;
	float tidal_vol = 0.5e6 * 180.0 / 200.0;
	float vol_increment = tidal_vol * breathing_cycle;
 	float lung_volume = lung_volume_0 + vol_increment;
	float linear_scale = pow(lung_volume / lung_volume_0, 0.5);
	float offset_y = min_y - min_y * linear_scale;
	float offset_z = max_z - max_z * linear_scale;
	newPosition.y = newPosition.y * linear_scale + offset_y;
	newPosition.z = newPosition.z * linear_scale + offset_z;

	return newPosition;
}


void main(void) {
	vec4 mvPosition;
	mvPosition = modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = -mvPosition.xyz;
	
	vec3 objectNormal;
	objectNormal = normal;
#ifdef FLIP_SIDED
	objectNormal = -objectNormal;
#endif
	vec3 transformedNormal = normalMatrix * objectNormal;
	vNormal = normalize( transformedNormal );
	color1 = color_one;
	color2 = color_two;
	color3 = color_three;
	color4 = color_four;
	color5 = color_five;
	z_coordinates = position.z;
	vec3 newPosition = getPosition(position);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
