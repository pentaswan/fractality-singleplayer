class Matrix {
    constructor(...args) {
        this.elements = args;
    }

    static xRotationMatrix(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix(
            1, 0,   0,  
            0, cos, -sin,
            0, sin, cos,
        )
    }
    static yRotationMatrix(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix(
            cos, 0,  sin,
            0,   1,  0,
            -sin, 0, cos,
        )
    }
    static zRotationMatrix(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Matrix(
            cos, -sin, 0,
            sin, cos,  0,
            0,   0,    1,
        )
    }

    clone() {
        return new Matrix(this.elements);
    }

    mul(otherMat) {
        return this.mul3(otherMat);
    }
    
    mul3(otherMat) {
        function index(row, col) {
            return 3 * col + row;
        }
        
        let newMat = [];
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                newMat[index(row, col)] =
                    this.elements[index(row, 0)] * otherMat.elements[index(0, col)] +
                    this.elements[index(row, 1)] * otherMat.elements[index(1, col)] +
                    this.elements[index(row, 2)] * otherMat.elements[index(2, col)];
            }
        }
        
        return newMat;
    }

    mul4(otherMat) {
        function index(row, col) {
            return 4 * col + row;
        }
        let newMat = [];
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 4; row++) {
                newMat[index(row, col)] =
                    this.elements[index(row, 0)] * otherMat.elements[index(0, col)] +
                    this.elements[index(row, 1)] * otherMat.elements[index(1, col)] +
                    this.elements[index(row, 2)] * otherMat.elements[index(2, col)] +
                    this.elements[index(row, 3)] * otherMat.elements[index(3, col)];
            }
        }
        return newMat;
    }

    invert(out, a) {
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        let a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        let a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        let a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
        // Calculate the determinant
        let det =
            b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
    }

    log() {
        const w = Math.sqrt(this.length);
        let str = '';
        let ind = 0;
        for(let i = 0; i < w; i++){
            for(let j = 0; j < w; j++){
                str += `${this[ind].toFixed(2)} `;
                ind++;
            }
            str += '\n';
        }
        console.log(str);
    }
}