// params
const fractal = {
    scale: 1.8,
    angle1: -.12,
    angle2: .5,
    shift: new Vector(-2.12, -2.75, .49),
    animSpeed: .01,
    name: 'Grapefruit',
    author: 'CodeParade'
};

spawnPoint = new Vector(0, 5, 0);
spawnRange = new Vector(2, 0, 2);
marbleRadius = 0.32;
deathBarrier = 0;

// main de
function DE(pt) {
    // No vector4, so just use arrays for this function
    let p = [pt.x, pt.y, pt.z, 1];
    for (let i = 0; i < fractalIters; i++) {
        abs(p);

        rotZ(p, fractal.angle1);
        mengerFold(p);
        rotX(p, fractal.angle2);

        scaleVector(p, fractal.scale);
        shift(p);
    }

    return de_box(p, 6);
}

// shader de
const vs_de = `
void planeFold(inout vec4 z, vec3 n, float d) {
	z.xyz -= 2.0 * min(0.0, dot(z.xyz, n) - d) * n;
}
void sierpinskiFold(inout vec4 z) {
	z.xy -= min(z.x + z.y, 0.0);
	z.xz -= min(z.x + z.z, 0.0);
	z.yz -= min(z.y + z.z, 0.0);
}
void mengerFold(inout vec4 z) {
	float a = min(z.x - z.y, 0.0);
	z.x -= a;
	z.y += a;
	a = min(z.x - z.z, 0.0);
	z.x -= a;
	z.z += a;
	a = min(z.y - z.z, 0.0);
	z.y -= a;
	z.z += a;
}
void boxFold(inout vec4 z, vec3 r) {
	z.xyz = clamp(z.xyz, -r, r) * 2.0 - z.xyz;
}
void rotX(inout vec4 z, float s, float c) {
	z.yz = vec2(c*z.y + s*z.z, c*z.z - s*z.y);
}
void rotY(inout vec4 z, float s, float c) {
	z.xz = vec2(c*z.x - s*z.z, c*z.z + s*z.x);
}
void rotZ(inout vec4 z, float s, float c) {
	z.xy = vec2(c*z.x + s*z.y, c*z.y - s*z.x);
}
void rotX(inout vec4 z, float a) {
	rotX(z, sin(a), cos(a));
}
void rotY(inout vec4 z, float a) {
	rotY(z, sin(a), cos(a));
}
void rotZ(inout vec4 z, float a) {
	rotZ(z, sin(a), cos(a));
}

float de_box(vec4 p, vec3 s) {
	vec3 a = abs(p.xyz) - s;
	return (min(max(max(a.x, a.y), a.z), 0.0) + length(max(a, 0.0))) / p.w;
}

float de_world(vec4 p) {
	for (int i = 0; i < FRACTAL_ITER; ++i) {
		p.xyz = abs(p.xyz);
		rotZ(p, ${fractal.angle1});
		mengerFold(p);
		rotX(p, ${fractal.angle2});
		p *= ${fractal.scale};
		p.xyz += vec3(${fractal.shift.x}, ${fractal.shift.y}, ${fractal.shift.z});
	}
	return de_box(p, vec3(6.0));
}`;

// Some utils
function de_box(p, s) {
    const a = [Math.abs(p[0]) - s, Math.abs(p[1]) - s, Math.abs(p[2]) - s];

    const min = Math.min;
    const max = Math.max;

    let absA = [];
    for (let i = 0; i < a.length; i++) {
        absA[i] = Math.max(0, a[i]);
    }

    return (min(max(max(a[0], a[1]), a[2]), 0) + len(absA)) / p[3];
}

function len(arr) {
    let a = 0;
    for (let i = 0; i < arr.length; i++) {
        a += arr[i] ** 2;
    }
    return Math.sqrt(a);
}

function rotZ(z, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const z0 = cos * z[0] + sin * z[1];
    const z1 = cos * z[1] - sin * z[0];

    z[0] = z0;
    z[1] = z1;
}

function rotX(z, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const z1 = cos * z[1] + sin * z[2];
    const z2 = cos * z[2] - sin * z[1];

    z[1] = z1;
    z[2] = z2;
}

function mengerFold(z) {
    let a = Math.min(z[0] - z[1], 0.0);
    z[0] -= a;
    z[1] += a;
    a = Math.min(z[0] - z[2], 0.0);
    z[0] -= a;
    z[2] += a;
    a = Math.min(z[1] - z[2], 0.0);
    z[1] -= a;
    z[2] += a;
}

function mengerUnfold(p, n) {
    const mx = Math.max(p[0], p[1]);
    if (Math.min(p[0], p[1]) < Math.min(mx, p[2])) {
        swap(n, 1, 2);
    }
    if (mx < p[2]) {
        swap(n, 0, 2);
    }
    if (p[0] < p[1]) {
        swap(n, 0, 1);
    }
}

function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function absUnfold(p, n) {
    if (p[0] < 0) {
        n[0] = -n[0];
    }
    if (p[1] < 0) {
        n[1] = -n[1];
    }
    if (p[2] < 0) {
        n[2] = -n[2];
    }
}

function scaleVector(arr, scalar) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] *= scalar;
    }

    return arr;
}

function abs(p) {
    // only first 3 components
    for (let j = 0; j < 3; j++) {
        p[j] = Math.abs(p[j]);
    }
}

function shift(p) {
    p[0] += fractal.shift.x;
    p[1] += fractal.shift.y;
    p[2] += fractal.shift.z;
}

function unshift(p) {
    p[0] -= fractal.shift.x;
    p[1] -= fractal.shift.y;
    p[2] -= fractal.shift.z;
}

// old fractal-specific nearest point, for safekeeping
function NP_old(pt) {
    const p_hist = [];
    let p = [pt.x, pt.y, pt.z, 1];

    // Fold
    for (let i = 0; i < fractalIters; i++) {
        p_hist.push([...p]);

        abs(p);

        rotZ(p, fractal.angle1);
        p_hist.push([...p]);
        mengerFold(p);
        rotX(p, fractal.angle2);

        scaleVector(p, fractal.scale);
        shift(p);
    }

    // Get the nearest point
    let n = [];
    for (let i = 0; i < 3; i++) {
        n[i] = clamp(p[i], -6, 6);
    }

    // Unfold (in reverse order)
    for (let i = 0; i < fractalIters; i++) {
        unshift(n);
        scaleVector(n, 1 / fractal.scale);

        rotX(n, -fractal.angle2);
        mengerUnfold(p_hist.pop(), n);
        rotZ(n, -fractal.angle1);

        absUnfold(p_hist.pop(), n);
    }
    return new Vector(n[0], n[1], n[2]);
}