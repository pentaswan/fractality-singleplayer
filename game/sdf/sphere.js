spawnPoint = new Vector(0, 4, 0);
spawnRange = new Vector(.5, 0, .5);
marbleRadius = 0.32;
deathBarrier = 0;

const radius = 3;
const vs_de = `
float de_world(vec4 pos) {
	return de_sphere(pos, ${radius.toFixed(1)});
}`

function DE(pt) {
	return pt.mag() - radius;
}