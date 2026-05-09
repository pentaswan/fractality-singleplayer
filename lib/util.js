const tps = 60;
const msPerFrame = 1000 / tps;

function interpolate(s, e, t) {
    return s + (e - s) * t;
}

function clampAngle(a){
    if(a < Math.PI * 2) a += Math.PI * 2;
    return a % (Math.PI * 2);
}

function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

function angleToSphere(center, r, θ, φ) {
    const cθ = Math.cos(θ);
    const sθ = Math.sin(θ);
    const cφ = Math.cos(φ);
    const sφ = Math.sin(φ);

    return center.clone().add(
        new Vector(
            cθ * sφ,
            sθ * sφ,
            cφ
        ).scale(r)
    )
}

const eps = 1e-10;