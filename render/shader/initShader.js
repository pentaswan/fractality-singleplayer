
// uniforms

// uniform mat4 iMat;
const iMat = new Float32Array(16);
const iMarblePos = new Float32Array(4);
const iResolution = new Float32Array(2);
const iDebug = new Float32Array(3);
function debug(v){
    iDebug[0] = v.x;
    iDebug[1] = v.y;
    iDebug[2] = v.z;
}

const testArr = [
    [iMat, 'iMat'],
    [iMarblePos, 'iMarblePos'],
    [iResolution, 'iResolution'],
    [iDebug, 'iDebug'],
]

// set up canvas and resizing
let glCanvas = document.getElementById('glCanvas');
const gl = glCanvas.getContext('webgl2');

window.resolution = 1;
setResolution(1/2);
function setResolution(ratio){
    window.resolution = ratio;
    resize();
    if(window.resolution < 1){
        glCanvas.style.imageRendering = 'pixelated';
    } else {
        glCanvas.style.imageRendering = '';
    }
}
function resize(){
    glCanvas.width = window.innerWidth * window.resolution;
    glCanvas.height = window.innerHeight * window.resolution;
    glCanvas.style.width = window.innerWidth + 'px';
    glCanvas.style.height = window.innerHeight + 'px';
    // glCanvas.style.transform = `scale(2, 2)`;
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);

    // glCanvas.setPixelRatio(window.devicePixelRatio);
}
resize();
window.onresize = resize;

let vertexData = [];
let indicies = [];

vertexData.push(
    -1,-1, 1,-1 , -1,1, 1,1 
);

indicies.push(
    0, 1, 2,
    1, 2, 3
);

vertexData = new Float32Array(vertexData);
indicies = new Uint32Array(indicies);

// Create vertex buffer
const vertexBuffer = gl.createBuffer();
{
    // Bind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // Feed vertex buffer with data
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
}

// Create index buffer
const indexBuffer = gl.createBuffer();
{
    // Bind buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Feed index buffer with data
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);
}

// Use shader program
function createShaderProgram(vs, fs) {
    function compileShader(str, type) {
        // create shader
        const shader = gl.createShader(type)
    
        // give it source code and compile
        gl.shaderSource(shader, str);
        gl.compileShader(shader)
    
        const errors = gl.getShaderInfoLog(shader)
        if (errors.length != 0) {
            console.log('Error Compiling Shader!');
            console.log(errors);
            return null;
        }
        else return shader;
    }

    // Create shader program
    const program = gl.createProgram();

    // Attach vertex shader
    const vertexShader = compileShader(vs, gl.VERTEX_SHADER)
    gl.attachShader(program, vertexShader)

    // Attach fragment shader
    const fragmentShader = compileShader(fs, gl.FRAGMENT_SHADER)
    gl.attachShader(program, fragmentShader)

    // Link and validate program
    gl.linkProgram(program);
    gl.validateProgram(program);

    // Check for errors
    const errors = gl.getProgramInfoLog(program)
    if (errors.length !== 0) {
        console.log('Error Compiling Program!');
        console.log(errors);
    }

    // Free GPU memory
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
}

let program, uniforms;
function setProgram(vs, fs){
    program = createShaderProgram(vs, fs);

    gl.useProgram(program);

    {// Specify locations of pos in the typed arrays
        let posLocation = gl.getAttribLocation(program, "iPos");
        gl.enableVertexAttribArray(posLocation);
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);// for second to last 0
    }

    uniforms = [];

    for(let i = 0; i < testArr.length; i++){
        uniforms.push(gl.getUniformLocation(program, testArr[i][1]));
    }
}

setProgram(vs, fs);