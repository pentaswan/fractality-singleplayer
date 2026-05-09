spawnPoint = new Vector(0, 10, 0);
spawnRange = new Vector(2, 0, 2);
marbleRadius = 0.32;
deathBarrier = -1;

const tileDist = 6;
const radius = 5;

const td_str = tileDist.toFixed(1);
const vs_de = `
float de_world(vec4 pos) {
    pos.x = mod(abs(pos.x), ${td_str}) - ${td_str} * .5;
    pos.z = mod(abs(pos.z), ${td_str}) - ${td_str} * .5; 

	return de_sphere(pos, ${radius.toFixed(1)});
}`

function DE(pt) {
    pt = pt.clone();
    const mod = (a, b) => {return a % b};
	pt.x = mod(Math.abs(pt.x), tileDist) - tileDist * .5;
	pt.z = mod(Math.abs(pt.z), tileDist) - tileDist * .5;

	return pt.mag() - radius;
}