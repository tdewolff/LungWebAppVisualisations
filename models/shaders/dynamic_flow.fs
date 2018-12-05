varying vec3 v_viewPos;
varying vec3 v_normal;
varying vec3 v_color_baseline;
varying vec3 v_color_smoker;
varying vec3 v_color_asthmatic;

uniform	vec3 directionalLightColor;
uniform	vec3 directionalLightDirection;
uniform float smokingSeverity;
uniform float asthmaSeverity;

vec3 calculateSpectrumColor(float value) {
	vec3 rgb = vec3(0.0);
	if (value<1.0/3.0) {
		rgb[0]=1.0;
		rgb[2]=0.0;
		if (value<1.0/6.0) {
			rgb[1]=value*4.5;
		} else {
			rgb[1]=0.75+(value-1.0/6.0)*1.5;
		}
	} else if (value<2.0/3.0) {
		rgb[1]=1.0;
		if (value<0.5) {
			rgb[0] = 2.5 - 4.5*value;
			rgb[2] = 1.5*value - 0.5;
		} else {
			rgb[0] = 1.0 - 1.5*value;
			rgb[2] = -2.0 + 4.5*value;
		}
	} else {
		rgb[0]=0.0;
		rgb[2]=1.0;
		if (value<5.0/6.0) {
			rgb[1]=1.0-(value-2.0/3.0)*1.5;
		} else {
			rgb[1]=0.75-(value-5.0/6.0)*4.5;
		}
	}
	return rgb;
}

vec3 calculateColor() {
	vec3 baseline = v_color_baseline;
	vec3 smoker = v_color_smoker;
	vec3 asthma = v_color_asthmatic;
	float delta = baseline[0];
	if (smokingSeverity > 0.0) {
		delta = (smoker[0] - baseline[0]) * smokingSeverity / 2.0 + baseline[0];
	} else if (asthmaSeverity < 1.0) {
		delta = (asthma[0] - baseline[0]) * (1.0 - asthmaSeverity) / 0.4 + baseline[0];
	}
	delta = baseline[0];
	return calculateSpectrumColor(1.0 - delta);
}

void main(void) {
#ifdef ALPHATEST
	if (gl_FragColor.a < ALPHATEST) discard;
#endif

	vec3 normal = normalize(v_normal);
	if (!gl_FrontFacing)
		normal.z = -normal.z;
		
	vec3 viewPosition = normalize(v_viewPos);
	vec3 adjustDiffuse = calculateColor();
	vec3 totalDiffuse = vec3(0.0);
#if NUM_DIR_LIGHTS > 0
	vec3 dirDiffuse = vec3(0.0);
	vec3 dirSpecular = vec3(0.0);

	vec4 lDirection = viewMatrix * vec4(directionalLightDirection, 0.0);
	vec3 dirVector = normalize(lDirection.xyz);
	float dotProduct = dot(normal, dirVector);
	#ifdef WRAP_AROUND
		float dirDiffuseWeightFull = max(dotProduct, 0.0);
		float dirDiffuseWeightHalf = max(0.5 * dotProduct + 0.5, 0.0);
		vec3 dirDiffuseWeight = mix(vec3(dirDiffuseWeightFull), vec3(dirDiffuseWeightHalf), wrapRGB);
	#else
		float dirDiffuseWeight = max(dotProduct, 0.0);
	#endif
	dirDiffuse += adjustDiffuse * directionalLightColor * dirDiffuseWeight;
	totalDiffuse += dirDiffuse;
#endif

	gl_FragColor.xyz = totalDiffuse;
}
