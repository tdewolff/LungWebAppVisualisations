attribute vec3 color_one;
attribute vec3 color_two;
attribute vec3 color_three;

varying vec3 v_viewPos;
varying vec3 v_normal;
varying vec3 v_color_baseline;
varying vec3 v_color_smoker;
varying vec3 v_color_asthmatic;

uniform float t;
uniform float tidalVolumeRatio;

vec3 getPosition(vec3 pos)  {
	float V = 4.0e6;
	float dV = V * tidalVolumeRatio * t;
	float scale = pow(1.0+dV/V, 0.5);

	float offset_y = 94.9418;
	float offset_z = -14.955;

	pos.y = offset_y + (pos.y - offset_y) * scale;
	pos.z = offset_z + (pos.z - offset_z) * scale;
	return pos;
}

void main(void) {
	v_viewPos = -(modelViewMatrix * vec4(position, 1.0)).xyz;

	vec3 n = normal;
#ifdef FLIP_SIDED
	n = -n;
#endif
	v_normal = normalize(normalMatrix * n);

	v_color_baseline = color_one;
	v_color_smoker = color_two;
	v_color_asthmatic = color_three;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(getPosition(position), 1.0);
}
