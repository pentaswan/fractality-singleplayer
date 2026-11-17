spawnPoint = new Vector(0, 0, 0);
spawnRange = new Vector(0, 0, 0);
marbleRadius = 0.32;
deathBarrier = -3;
deIsBound = true;
const k = 1.5;//0.4;
const deFac = 3;
const vx = 3;
const vy = 2;

const vs_de = `
vec3 twist(vec3 p) {
    const float k = ${ k.toFixed(1) };
    float c = cos(k * p.y);
    float s = sin(k * p.y);
    return vec3(
        p.x * c - p.z * s,
        p.x * s + p.z * c,
        p.y
    );
}

float torus(vec3 p, vec2 t){
	vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float de_world(vec4 pos) {
    return torus(twist(pos.xyz), vec2(${vx.toFixed(1)}, ${vy.toFixed(1)})) / ${deFac.toFixed(1)};
}`;

function twist(p) {
    let c = Math.cos(k * p.y);
    let s = Math.sin(k * p.y);
    let q = new Vector(
        p.x * c - p.z * s,
        p.x * s + p.z * c,
        p.y
    );
    return q;
}

function torus(p, t) {
    const len_pxz = Math.sqrt(p.x ** 2 + p.z ** 2);
    let q = new Vector(len_pxz - t.x, p.y, 0);
    return q.mag() - t.y;
}

function DE(pt) {
    return torus(twist(pt), new Vector(vx, vy)) / deFac;
}