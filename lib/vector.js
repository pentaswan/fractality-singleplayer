class Vector {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
        this.z += otherVec.z;

        return this;
    }

    sub(otherVec) {
        this.x -= otherVec.x;
        this.y -= otherVec.y;
        this.z -= otherVec.z;

        return this;
    }

    mul(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    interpolate(otherVec, t) {
        this.x = interpolate(this.x, otherVec.x, t);
        this.y = interpolate(this.y, otherVec.y, t);
        this.z = interpolate(this.z, otherVec.z, t);

        return this;
    }
    
    magSquared() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        
        return this;
    }

    dot(otherVec) {
        return this.x * otherVec.x + this.y * otherVec.y + this.z * otherVec.z;
    }

    normalize() {
        const mag = this.mag();

        if(mag === 0) return this;

        this.x /= mag;
        this.y /= mag;
        this.z /= mag;

        return this;
    }

    cross(otherVec) {
        this.x = this[1] * otherVec[2] - this[2] * otherVec[1];
        this.y = this[2] * otherVec[0] - this[0] * otherVec[2];
        this.z = this[0] * otherVec[1] - this[1] * otherVec[0];

        return this;
    }

    distanceSquared(otherVec) {
        return (this.x - otherVec.x) ** 2 + (this.y - otherVec.y) ** 2 + (this.z - otherVec.z) ** 2;
    }

    distance(otherVec) {
        return Math.sqrt(this.distanceSquared(otherVec));
    }
}