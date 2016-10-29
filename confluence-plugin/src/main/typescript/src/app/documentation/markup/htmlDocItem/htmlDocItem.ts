export class HtmlDocItem {

  static fromObject(obj: any) {
    return new HtmlDocItem(obj.id, obj.originalPath, obj.content);
  }

  constructor(public id: number, public originalPath: string, public content: string) {
  }

  toString() {
    return `HtmlDocItem{id: ${this.id};originalPath: ${this.originalPath};content: ${this.content} }`;
  }

}
