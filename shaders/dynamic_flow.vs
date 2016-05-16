attribute vec3 color_one;
attribute vec3 color_two;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 color_begin;
varying vec3 color_end;

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
	color_begin = color_one;
	color_end = color_two;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
