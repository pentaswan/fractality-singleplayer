spawnPoint = new Vector(0, 4, 0);
spawnRange = new Vector(.5, 0, .5);
marbleRadius = 0.32;
deathBarrier = -3;

const vs_de = `
float de_world(vec4 pos) {
    float s = sin(pos.x) * sin(pos.z);
    return pos.y - s;
}`

function DE(pt) {
	const s = Math.sin(pt.x) * Math.sin(pt.z);
    return pt.y - s;
}