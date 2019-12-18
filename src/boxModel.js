export default class BoxModel {
  constructor (w, h, opts={}) {
    this.margin = Object.assign({top: 50, right: 50, bottom: 50, left: 50}, opts.margin);
    this.padding = Object.assign({top: 0, right: 0, bottom: 30, left: 30});
    this.outerBoxOrigin = {
      x: this.margin.left,
      y: h - this.margin.bottom,
    };
    this.innerBoxOrigin = {
      x: this.margin.left + this.padding.left,
      y: h - (this.margin.bottom + this.padding.bottom),
    };
    this.outerBoxWidth = w - (this.margin.left + this.margin.right);
    this.outerBoxHeight = h - (this.margin.top + this.margin.bottom);
    this.innerBoxWidth = this.outerBoxWidth - (this.padding.left + this.padding.right);
    this.innerBoxHeight = this.outerBoxHeight - (this.padding.top + this.padding.bottom);
  }
}