function simulate() {
    storeState();
    simulatePlayer();
}

function DF(pos, earlyOut=false) {
    if(!deIsBound) return DE(pos);

    // march along a few circles until we find land
    let pt = pos.clone();
    let i;

    for(i = 0; i < 1000; i++) {
        const de = DE(pt);

        if(de <= 0.0001) break;

        const gradient = normalizedGradient(DE, pt, de);

        // stepSize can be any number (0, 1]. It helps better approx the gradient.
        pt.add(gradient.scale(-de * deBoundStepSize));

        // optimization: if we know we're not intersecting, skip the rest of the 1000 iterations
        if(earlyOut && pos.distanceSquared(pt) > marbleRadius ** 2) return Infinity;
    }

    return pos.distance(pt);
}

function normalizedGradient(fn=DE, pt, fnEvaluatedAtPt=fn(pt)) {
    const h = 0.0001;
    return new Vector(
        fn(new Vector(pt.x + h, pt.y, pt.z)) - fnEvaluatedAtPt,
        fn(new Vector(pt.x, pt.y + h, pt.z)) - fnEvaluatedAtPt,
        fn(new Vector(pt.x, pt.y, pt.z + h)) - fnEvaluatedAtPt
    ).normalize();
}

let debugAccum = 0, debugNum = 0;
function marbleFractalCollision() {
    let de = DF(player.pos, true);

    // if we're not intersecting, by the distance estimate
    // don't do collision and say we're not on the ground
    if (de >= marbleRadius) return false;

    // Also early out if de is very small / negative,
    // causes collision bugs otherwise.
    if (de < marbleRadius * .001) return false;

    // 1. calculate gradients
    const pos = player.pos;
    const gradient = normalizedGradient(DE, pos, DE(player.pos));

    // 2. update position
    const normal = gradient;
    const magnitude = de - marbleRadius;
    player.pos.sub(normal.clone().mul(magnitude));

    // 3. update velocity
    player.vel.sub(
        normal.mul(player.vel.dot(normal))
    );

    return true;
}

function simulatePlayer() {
    // Marble gravity and collision
    let onGround = false;
    for (let i = 0; i < numPhysicsSteps; i++) {
        let force = gravity / numPhysicsSteps;

        player.vel.y -= force;
        player.pos.add(player.vel.clone().scale(1/6));

        onGround ||= marbleFractalCollision();
    }
    
    // Apply force from keyboard
    let dir = new Vector(
        player.input.x,
        0,
        player.input.y,
    )
    let toJump = player.input.jump;
    let mag = onGround ? groundAccel : airAccel;

    player.vel.add(
        dir.clone().mul(mag)
    );

    player.jumpCooldown--;

    if(onGround && toJump && player.jumpCooldown <= 0 && player.vel.y > jumpYVThresh){
        player.vel.y += jumpForce;
        player.jumpCooldown = 26;
    }

    // Death barrier
    if(player.pos.y < deathBarrier){
        player.pos = getSpawnPoint();
        player.vel = new Vector();
    }

    // Friction
    player.vel.scale(onGround ? groundFriction : airFriction);
}

function storeState() {
    player.previous.pos = player.pos.clone();
}