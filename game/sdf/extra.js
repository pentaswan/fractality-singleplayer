const vs_de = `float de_tetrahedron(vec4 p, float r) {
	float md = max(max(-p.x - p.y - p.z, p.x + p.y - p.z),
				max(-p.x + p.y + p.z, p.x - p.y + p.z));
	return (md - r) / (p.w * sqrt(3.0));
}
float de_capsule(vec4 p, float h, float r) {
	p.y -= clamp(p.y, -h, h);
	return (length(p.xyz) - r) / p.w;
}
    
float onion(float sdf, float thickness, int times)
{
	float result = sdf;
	for(int i = 0; i < times; i++){
		result = abs(result) - thickness;
	}
    return result;
}

float xor(float d1, float d2)
{
    return max(min(d1,d2),-max(d1,d2));
}
    
float circleWave(vec2 p, float tb, float ra){
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}

vec2 revolve(vec3 p, float o)
{
    vec2 q = vec2( length(p.xz) - o, p.y );
    return q;
}`

// old
function marbleFractalCollision() {
    const de = DE(player.pos);

    // if we're not intersecting, by the distance estimate
    // don't do collision and say we're not on the ground
    if (de >= marbleRadius) return false;

    // Also early out if de is very small / negative,
    // causes collision bugs otherwise.
    if (de < marbleRadius * .001) return false;

    // Run collision, using nearest point to push player
    // and update velocity.
    const nearestPoint = NP(player.pos, de);

    let dist = nearestPoint.clone().sub(player.pos);
    let dn = dist.clone().normalize();

    const dv = player.vel.dot(dist);

    // marble_pos -= dn * marble_rad - d;
    player.pos.sub(
        dn.clone().scale(marbleRadius).sub(dist)
    )

    // marble_vel -= dn * (dv * marble_bounce);
    player.vel.sub(
        dn.clone().mul(dv * marbleBounce)
    );

    return true;
}

function NP(pt, dist = DE(pt)) {
    // Step 1: generate random points on the sphere
    // where the points could be (the distance estimate's result)
    const pi = Math.PI;
    const pts = [
        // top and bottom
        { θ: 0, φ: 0 },
        { θ: 0, φ: pi },

        // // 4 points on the sides
        { θ: 0, φ: pi / 2 },
        { θ: pi / 2, φ: pi / 2 },
        { θ: pi, φ: pi / 2 },
        { θ: pi * 3 / 2, φ: pi / 2 }
    ]

    // step 2: construct the function that we want to find zeroes of
    // all the points are locked to the sphere containing the fractal's "peak",
    // the point that causes the DE (smallest distance) to be what it is
    const fn = (θ, φ) => {
        const ptOnSphere = angleToSphere(pt, dist, θ, φ);
        return DE(ptOnSphere);
    }

    // step 3: use newton's method to find parameters of θ and φ that make fn(θ, φ) = 0
    let best = {
        dist: Infinity,
        θ: 0, φ: 0
    };
    for (let i = 0; i < pts.length; i++) {
        const { θ, φ } = newtonsMethod(pts[i].θ, pts[i].φ, fn);
        const finalDist = fn(θ, φ);

        if (finalDist < best.dist) {
            best.dist = finalDist;
            best.θ = θ;
            best.φ = φ;
        }
    }

    if (Number.isFinite(best.dist)) {
        return angleToSphere(pt, dist, best.θ, best.φ);
    }
}

function newtonsMethod(θ, φ, fn) {
    for (let i = 0; i < 50; i++) {
        const f = fn(θ, φ);

        const h = 0.0001;
        const f_θ = (fn(θ + h, φ) - f) / h;
        const f_φ = (fn(θ, φ + h) - f) / h;

        const updateθ = Math.abs(f_θ) > eps;
        const updateφ = Math.abs(f_φ) > eps;

        if (!updateθ && !updateφ) return { θ, φ };

        // x_new = x - f(x) / f'(x)
        if (updateθ) θ -= f / f_θ;
        if (updateφ) φ -= f / f_φ;
    }

    return { θ, φ };
}