spawnPoint = new Vector(0, 2, 0);
spawnRange = new Vector(0, 0, 0);
gravity = 0.0005;
marbleRadius = 0.1;
deathBarrier = -2;
deIsBound = true;

groundAccel /= 1.5;
airAccel /= 1.5;
jumpForce /= 4;

groundFriction = 0.95;
airFriction = 0.98;

const far = 10;
const power = 8;//2;

const vs_de = `const float power = ${power.toFixed(1)};
float de_world(vec4 pos) {
	vec3 z = pos.xyz;
	float dr = 1.0;
	float r = 0.0;
	for (int i = 0; i < ${maxRaySteps}; i++) {
		r = length(z);
		if (r > ${far.toFixed(1)}) break;

		// convert to polar coordinates
		float theta = acos(z.z / r);
		float phi = atan(z.y, z.x);
		dr = pow(r, power - 1.0) * power * dr + 1.0;

		// scale and rotate the point
		float zr = pow(r, power);
		theta = theta * power;
		phi = phi * power;

		// convert back to cartesian coordinates
		z = zr * vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));
		z += pos.xyz;
	}
	return 0.5 * log(r) * r / dr;
}`

function DE(pt) {
	let z = pt.clone();
	let dr = 1;
	let r = 0;

	const sin = Math.sin;
	const cos = Math.cos;
	for (let i = 0; i < maxRaySteps; i++) {
		r = z.mag();
		if (r > far) break;

		// convert to polar coordinates
		let theta = Math.acos(z.z / r);
		let phi = Math.atan2(z.y, z.x);
		dr = Math.pow(r, power - 1) * power * dr + 1;

		// scale and rotate the point
		let zr = Math.pow(r, power);
		theta *= power;
		phi *= power;

		// convert back to cartesian coordinates
		z = new Vector(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta)).mul(zr);
		z.add(pt);
	}
	return 0.5 * Math.log(r) * r / dr;
}