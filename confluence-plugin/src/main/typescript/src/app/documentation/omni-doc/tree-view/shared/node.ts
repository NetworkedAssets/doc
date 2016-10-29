export class Node {
  name: string;
  parentNode: Node = null;
  isRoot: boolean;
  isHidden: boolean;
  type = '';
  children: Array<Node>;
  isExpanded = false;
  focus = false;
  params: {};

  constructor(opts: {
    name?: string,
    type?: string,
    children?: Array<Node>,
    focus?: boolean
  } = {}, parent: Node = null) {

    this.name = opts.name;
    this.type = opts.type;
    this.params = opts;
    this.parentNode = parent;
    this.type = opts.type || '';
    this.children = opts.children || [];
    let _children: Array<Node> = [];
    this.children.forEach((node) => _children.push(new Node(node, this)));
    this.children = _children;
    this.isRoot = this.children.length > 0;
  }


  expand(expand: boolean) {
    this.isExpanded = expand;
    this.children.forEach((node) => node.expand(expand));

  }


  filter(query: string) {
    this.children.forEach((node) => node.filter(query));
    this.isHidden = this.hide(query);

  }

  private hide(query: string): boolean {
    if (query === '' || ( this.children.some((node) => !node.isHidden && this.isExpanded ))) {
      return false;
    }
    return this.name.indexOf(query) === -1;
  }
}
