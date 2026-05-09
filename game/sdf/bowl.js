spawnPoint = new Vector(0, 0, 0);
spawnRange = new Vector(.5, 0, .5);
marbleRadius = 0.32;
deathBarrier = -5;

const radius = 1.5;
const cutHeight = 0.4;
const thickness = 0.2;

const w = Math.sqrt(radius ** 2 - cutHeight ** 2);
const vs_de = `
float de_world(vec4 pt) {
    vec3 p = pt.xyz;

    float w = ${w.toFixed(1)};

    vec2 q = vec2(length(p.xz), p.y);

    return ((${cutHeight.toFixed(1)} * q.x < w * q.y) ? length(q - vec2(${w.toFixed(1)}, ${cutHeight.toFixed(1)})) : abs(length(q) - ${radius.toFixed(1)})) - ${thickness.toFixed(1)};
}`

function DE(pt) {
    let q = new Vector(
        new Vector(pt.x, 0, pt.z).mag(), pt.y, 0
    );

    if(cutHeight * q.x < w * q.y) {
        q.z = cutHeight;

        return q.sub(new Vector(w, cutHeight, 0)).mag();
    }

    return Math.abs(q.mag() - radius) - thickness;
}