varying vec3 vTexCoord3D;
varying vec3 vViewPosition;
varying vec3 vNormal;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform vec3 ambientLightColor;
uniform	vec3 directionalLightColor;
uniform	vec3 directionalLightDirection;
uniform float lowerValue;
uniform float upperValue;

vec3 GetColour(float v, float vmin, float vmax)
{
   vec3 c = vec3(1.0,1.0,1.0); // white
   float dv;

   if (v < vmin)
      v = vmin;
   if (v > vmax)
      v = vmax;
   dv = vmax - vmin;

   if (v < (vmin + 0.25 * dv)) {
      c.r = 0.0;
      c.g = 4.0 * (v - vmin) / dv;
   } else if (v < (vmin + 0.5 * dv)) {
      c.r = 0.0;
      c.b = 1.0 + 4.0 * (vmin + 0.25 * dv - v) / dv;
   } else if (v < (vmin + 0.75 * dv)) {
      c.r = 4.0 * (v - vmin - 0.5 * dv) / dv;
      c.b = 0.0;
   } else {
      c.g = 1.0 + 4.0 * (vmin + 0.75 * dv - v) / dv;
      c.b = 0.0;
   }

   return c ;
}

float calculateColour(vec3 pos) {
	float component = 0.0;
	if (pos.z < -44.0 && pos.z > -90.0)
	{
		float scale = -0.5 / (-44.0 - (-90.0));
		component = 1.0 + scale * (-44.0 - pos.z);  
	}
	else
	{
		if (pos.z < -90.0 && pos.z > -200.0)
		{
			float scale = -0.3 / (-90.0 - (-200.0));
			component = 0.5 + scale * (-90.0 - pos.z);  
		}
		else
		{
			float scale = -0.2 / (-200.0 - (-300.345));
			component = 0.2 + scale * (-200.0 - pos.z);  
		}
	}
	float valueDiff = upperValue - lowerValue;
	component = (1.0 - component) * valueDiff + lowerValue;
	
	return component;	
}

void main(void) {
	vec3 adjustDiffuse = diffuse;
#ifdef ALPHATEST
	if ( gl_FragColor.a < ALPHATEST ) discard;
#endif

	float specularStrength = 1.0;
	vec3 normal = normalize( vNormal );
	
	if (!gl_FrontFacing)
		normal.z = -normal.z;
		
	vec3 viewPosition = normalize( vViewPosition );
	float component = calculateColour(vTexCoord3D);
	adjustDiffuse = GetColour(component, 0.0, 1.0);
	vec3 ambient = adjustDiffuse;
#if MAX_DIR_LIGHTS > 0
	vec3 dirDiffuse  = vec3( 0.0 );
	vec3 dirSpecular = vec3( 0.0 );

	vec4 lDirection = viewMatrix * vec4( directionalLightDirection, 0.0 );
	vec3 dirVector = normalize( lDirection.xyz );
	float dotProduct = dot( normal, dirVector );
	#ifdef WRAP_AROUND
		float dirDiffuseWeightFull = max( dotProduct, 0.0 );
		float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );
		vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );
	#else
		float dirDiffuseWeight = max( dotProduct, 0.0 );
	#endif
	dirDiffuse += adjustDiffuse * directionalLightColor * dirDiffuseWeight;
	vec3 dirHalfVector = normalize( dirVector + viewPosition );
	float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
	float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );
	float specularNormalization = ( shininess + 2.0001 ) / 8.0;
	vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
	dirSpecular += schlick * directionalLightColor * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
#endif

vec3 totalDiffuse = vec3( 0.0 );
vec3 totalSpecular = vec3( 0.0 );
#if MAX_DIR_LIGHTS > 0
	totalDiffuse += dirDiffuse;
	totalSpecular += dirSpecular;
#endif
	gl_FragColor.xyz = ambient.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;
}
