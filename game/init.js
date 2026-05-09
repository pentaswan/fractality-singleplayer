function createPlayer() {
    const spawn = getSpawnPoint();
    return {
        previous: {
            pos: spawn.clone()
        },
        pos: spawn.clone(),
        vel: new Vector(),
        jumpCooldown: 0,
        input: {
            x: 0,
            y: 0,
            jump: 0
        }
    }
}

function getSpawnPoint() {
    const sp = spawnPoint;
    const range = spawnRange.clone();

    range.x *= Math.random() * 2 - 1;
    range.y *= Math.random() * 2 - 1;
    range.z *= Math.random() * 2 - 1;

    return sp.clone().add(range);
}

let lastTime, accum, time, tick;
lastTime = time = performance.now();
accum = tick = 0;
function gameLoop() {
    lastTime = performance.now();
    accum = 0;

    new Interval(() => {
        const time = performance.now();
        const dt = (time - lastTime) / msPerFrame;

        accum += dt;

        while (accum > 0) {
            accum--;
            tick++;
            simulate();
        }

        render();

        lastTime = time;
    }, msPerFrame / 10)
}

const player = createPlayer();