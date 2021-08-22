export class HtmlString extends String {
  constructor(value = "") {
    super(value);
  }
  span(value, className = "") {
    return new HtmlString(this + `<span class=${className}>${value}</span>`);
  }
  li(value, className = "") {
    return new HtmlString(this + `<li class=${className}>${value}</li>`);
  }
}
