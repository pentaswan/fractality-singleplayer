let input = {
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
}

const Controls = {
    KeyW: 'up',
    ArrowUp: 'up',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyS: 'down',
    ArrowDown: 'down',
    KeyD: 'right',
    ArrowRight: 'right',
    Space: 'jump'
}

window.onkeydown = window.onkeyup = (e) => {
    if(e.repeat) return;

    const inputName = Controls[e.code];
    if(inputName !== undefined){
        input[inputName] = e.type === 'keydown';

        updateInput();
    }
}

function updateInput(){
    const inputX = input.left - input.right;
    const inputY = input.down - input.up;

    // factor in camera rotation
    const converted = keysToInput(inputX, inputY, angleX);

    player.input = {
        x: converted[0],
        y: converted[1],
        jump: input.jump ? 1 : 0
    }
}

function keysToInput(dx, dy, angleX){// dx, dy are input in the x and y dir
    const c = Math.cos(angleX);
    const s = Math.sin(angleX);

    // these should be mapped to the x and z components
    return [
        -dx * c - dy * s,
        -dx * s + dy * c
    ]
}

let dragging = false;

window.onmousedown = (e) => {
    dragging = true;
}

window.onmousemove = (e) => {
    if(!dragging) return;
    moveCamera(e.movementX, e.movementY);
    updateInput();// camera makes x / y inputs change
}

window.onmouseup = (e) => {
    dragging = false;
}

const minOrbitDist = .1;
const zoomSpeed = 1 / 1000;
window.onwheel = (e) => {
    let maxOrbitDist = window.state === 'editor' ? 35 : 12;
    orbitDist *= (1 + e.deltaY * zoomSpeed);
    if(orbitDist < minOrbitDist) orbitDist = minOrbitDist;
    if(orbitDist > maxOrbitDist) orbitDist = maxOrbitDist;
}

window.oncontextmenu = (e) => {
    return e.preventDefault();
}