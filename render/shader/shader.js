const fs = `#version 300 es
#define DE de_scene
#define FRACTAL_ITER 16

precision highp float;

out highp vec4 outColor;

uniform mat4 iMat;
uniform vec2 iResolution;
uniform vec4 iMarblePos;

const int maxRaySteps = ${maxRaySteps};
const float near = 0.001;

//##########################################
//   Main DEs
//##########################################

float de_sphere(vec4 p, float r) {
	return (length(p.xyz) - r) / p.w;
}

float de_marble(vec4 p, vec4 marblePos) {
	return de_sphere(p - vec4(marblePos.xyz, 0.), ${marbleRadius.toFixed(1)});
}

${vs_de}

float de_scene(vec4 p) {
	return min(de_world(p), de_marble(p, iMarblePos));
}

float de_sphere(vec3 p, float r) {
    return (length(p) - r);
}

//##########################################
//   Main code
//##########################################

float trace(vec3 ptFrom, vec3 direction) {
	float totalDistance = 0.0;
	int steps;
	for (steps = 0; steps < maxRaySteps; steps++) {
		vec3 p = ptFrom + totalDistance * direction;
		float distance = de_scene(vec4(p.xyz, 1.));// de_mandlebulb
		totalDistance += distance;
		if (distance < near) break;
	}
    float fsteps = float(steps);
    float fmaxRaySteps = float(maxRaySteps);
	return 1.0 - fsteps / fmaxRaySteps;
}

void main()
{
    vec2 screen_pos = gl_FragCoord.xy / iResolution.xy;
	screen_pos.y = 1. - screen_pos.y;

    vec2 uv = 2.0 * screen_pos - 1.0;
	uv.x *= iResolution.x / iResolution.y;

	vec4 direction = iMat * normalize(vec4(uv.x / 1.5, uv.y / 1.5, 1., 0.));
	vec4 position = iMat[3];

	float color = trace(position.xyz, direction.xyz);
	outColor = vec4(color, color, color, 1.);
}`;

const vs = `#version 300 es
in highp vec4 iPos;

void main(){
    gl_Position = iPos;
}`;