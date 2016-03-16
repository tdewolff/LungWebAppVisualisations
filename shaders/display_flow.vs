varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vTexCoord3D;

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
	vTexCoord3D = position.xyz;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
