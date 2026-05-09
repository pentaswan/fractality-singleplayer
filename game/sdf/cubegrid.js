spawnPoint = new Vector(0, 5, 0);
spawnRange = new Vector(2, 0, 2);
marbleRadius = 0.32;
deathBarrier = -10;
gravity = 0.0012;
jumpYVThresh = -Infinity;

const mirrorSpacing = 1;
const edgeThickness = .15;

const mirrorSpacingStr = mirrorSpacing.toFixed(1);
const vs_de = `float boxFrame(vec3 p, vec3 b, float e)
{
    p = abs(p) - b;
    vec3 q = abs(p + e) - e;
    return min(min(
        length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
        length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
        length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}

float de_world(vec4 p)
{
    vec3 z = p.xyz;
    z[0] = mod(abs(z[0]), 2.) - 1.;
    z[1] = mod(abs(z[1]), 2.) - 1.;
    z[2] = mod(abs(z[2]), 2.) - 1.;
    return boxFrame(z, vec3(${mirrorSpacingStr}, ${mirrorSpacingStr}, ${mirrorSpacingStr}), ${edgeThickness.toFixed(1)});
}`

function boxFrame(p, b, e){
    const abs = (v) => {
        if(v.length === undefined){
            return Math.abs(v);
        }
        const arr = [];
        for(let i = 0; i < v.length; i++){
            arr[i] = Math.abs(v[i]);
        }
        return arr;
    }
    const max = (v, s) => {
        if(v.length === undefined){
            return Math.max(v, s);
        }
        const arr = [];
        for(let i = 0; i < v.length; i++){
            arr[i] = Math.max(v[i], s);
        }
        return arr;
    };
    const min = (v, s) => {
        if(v.length === undefined){
            return Math.min(v, s);
        }
        const arr = [];
        for(let i = 0; i < v.length; i++){
            arr[i] = Math.min(v[i], s);
        }
        return arr;
    };
    const add = (vec, vec2) => {
        const newVec = [];

        for(let i = 0; i < vec.length; i++){
            newVec[i] = vec[i] + vec2[i];
        }

        return newVec;
    }
    const sub = (vec, vec2) => {
        const newVec = [];

        for(let i = 0; i < vec.length; i++){
            newVec[i] = vec[i] - vec2[i];
        }

        return newVec;
    }
    const length = (vec) => {
        let mag = 0;
        for(let i = 0; i < vec.length; i++){
            mag += vec[i] ** 2;
        }
        return Math.sqrt(mag);
    }
    const vec3 = (a,b,c) => {return [a,b,c]};

	p = sub(abs(p), b);
	let q = sub(abs(add(p, [e,e,e])), [e,e,e]);
	let a_ = length(max(vec3(p[0],q[1],q[2]),0.0));
	let b_ = min(max(p[0],max(q[1],q[2])),0.0);
	let c_ = length(max(vec3(q[0],p[1],q[2]),0.0));
	let d_ = min(max(q[0],max(p[1],q[2])),0.0);
	let e_ = length(max(vec3(q[0],q[1],p[2]),0.0));
	let f_ = min(max(q[0],max(q[1],p[2])),0.0);

	return min(min(a_+b_, c_+d_), e_+f_);
}

function DE(pt) {
    const mod = (a, b) => {return a % b};
    const z = [pt.x, pt.y, pt.z];
    const abs = Math.abs;
    z[0] = mod(abs(z[0]), 2.) - 1.;
	z[1] = mod(abs(z[1]), 2.) - 1.;
	z[2] = mod(abs(z[2]), 2.) - 1.;
	return boxFrame(z, new Array(3).fill(mirrorSpacing), edgeThickness);
}