class Colors {
  constructor(defaultColors={}) {
    this.pool = Object.assign({}, defaultColors);
  }
  setColor(name, value) {
    this.pool[name] = value;
  }
  getColor(name, alpha=1) {
    if (typeof name === 'undefined') {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return `rgba(${r},${g},${b},${Math.random().toFixed(2)})`;
    }
    if (!this.pool[name]) {
      this.pool[name] = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ]
    }
    if (typeof this.pool[name] === 'string') {
      return this.pool[name];
    }
    return `rgba(${this.pool[name][0]},${this.pool[name][1]},${this.pool[name][2]},${alpha})`;
  }
}

const colors = new Colors();

export {Colors, colors}