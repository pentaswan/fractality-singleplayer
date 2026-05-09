function render() {
    // 0 to 1 range for where we should interpolate
    const t = accum;

    const p = player;
    const playerPos = p.previous.pos.clone().interpolate(p.pos, t);

    updateCameraInterpolate(playerPos);

    // set buffers
    iMarblePos[0] = playerPos.x;
    iMarblePos[1] = playerPos.y;
    iMarblePos[2] = playerPos.z;

    iResolution[0] = window.innerWidth * window.resolution;
    iResolution[1] = window.innerHeight * window.resolution;

    // add those uniforms to the gpu
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniformMatrix4fv(uniforms[0], false, testArr[0][0]);
    gl.uniform4fv(uniforms[1], testArr[1][0]);
    for(let i = 2; i < uniforms.length; i++){
        gl[`uniform${testArr[i][0].length}fv`](uniforms[i], testArr[i][0]);
    }
    
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,
        indicies.length, // how many vertecies we want to draw
        gl.UNSIGNED_INT, // Uint32 for created indicies array 
        0 // offset in index array (0 = start from beginning)
    )
}

gameLoop();