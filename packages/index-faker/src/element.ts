abstract class Element {
  static tagName = "";

  static innerHTML(): string[] {
    return [];
  }

  readonly ["constructor"]!: typeof Element;
  readonly tagName: string;
  readonly innerHTML: string[];

  constructor(...innerHTML: string[]) {
    this.tagName = this.constructor.tagName;

    this.innerHTML =
      innerHTML.length > 0 ? innerHTML : this.constructor.innerHTML();
  }

  toString(): string {
    return `<${this.tagName}>${this.innerHTML.join("")}</${this.tagName}>`;
  }
}

export { Element };
