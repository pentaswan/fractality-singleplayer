class Interval {
    constructor(fn, time) {
        this.intvl = setInterval(fn, time);
    }

    clear() {
        clearInterval(this.intvl);
        this.intvl = -1;
    }
}