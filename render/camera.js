let orbitDist = 6;
let cameraPos = new Vector(0,0,0);

let angleX = 1.5 * Math.PI;
let angleY = 1.25 * Math.PI;
let angleZ = 0;

function moveCamera(dx, dy){
    angleX += dx / window.innerWidth * 2;
    angleY += dy / window.innerHeight * 2;

    angleX = clampAngle(angleX);
    angleY = clampAngle(angleY);
}

function anglesToCameraRotation(angleX, angleY, orbitDist){
    return new Vector(
        Math.cos(angleY) * Math.sin(angleX) * orbitDist,
        -Math.sin(angleY) * orbitDist,
        -Math.cos(angleX) * Math.cos(angleY) * orbitDist
    );
}

function updateCameraRotation(){
    let aa_x = Matrix.yRotationMatrix(angleX);
    let aa_y = Matrix.xRotationMatrix(angleY);

    let finalMat = aa_x.mul3(aa_y);

    const full = new Matrix(
        finalMat[0], finalMat[1], finalMat[2], 0,
        finalMat[3], finalMat[4], finalMat[5], 0,
        finalMat[6], finalMat[7], finalMat[8], 0,
        cameraPos.x, cameraPos.y, cameraPos.z, 1
    )

    for(let i = 0; i < full.elements.length; i++){
        iMat[i] = full.elements[i];
    }
}

function updateCameraInterpolate(marblePos){
    cameraPos = marblePos.clone().add(
        anglesToCameraRotation(angleX, angleY, orbitDist)
    );

    updateCameraRotation();
}