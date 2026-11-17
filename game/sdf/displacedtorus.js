spawnPoint = new Vector(3, 5, 0);
spawnRange = new Vector(0, 0, 0);
marbleRadius = 0.32;
deathBarrier = -3;
deIsBound = true;
const k = 0.4;
const vx = 3;
const vy = 2;
const displacement = Math.PI;
const displacementMag = 1;

const vs_de = `
float torus(vec3 p, vec2 t){
	vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float de_world(vec4 pos) {
    return (torus(pos.xyz, vec2(${vx.toFixed(1)}, ${vy.toFixed(1)})) + sin(${displacement.toFixed(1)}*pos.x)*sin(${displacement.toFixed(1)}*pos.y)*sin(${displacement.toFixed(1)}*pos.z*${displacementMag.toFixed(1)})) / 2.;
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
    return (torus(pt, new Vector(vx, vy)) + Math.sin(displacement * pt.x) * Math.sin(displacement * pt.y) * Math.sin(displacement * pt.z) * displacementMag) / 2;
}